"use client"

import React, { useEffect, useLayoutEffect, useState } from "react"

import "semantic-ui-css/semantic.min.css"
import { Button, Container, Grid, Segment } from "semantic-ui-react"

import { Attachments } from "./components/Attachments"
import { Empty } from "./components/Empty"
import { MenuBar } from "./components/MenuBar"
import { Page } from "./components/Page"
import { AttachmentTypes } from "./entities"
import { useAttachments } from "./hooks/useAttachments"
import { Pdf, usePdf } from "./hooks/usePdf"
import { UploadTypes, useUploader } from "./hooks/useUploader"
import { DrawingModal } from "./modals/components/DrawingModal"
import { HelpModal } from "./modals/components/HelpModal"
import * as serviceWorker from "./serviceWorker"
import { readAsDataURL, readAsImage } from "./utils/asyncReader"
import { ggID } from "./utils/helpers"
import { savePdfToServer } from "./utils/pdf"
import { prepareAssets } from "./utils/prepareAssets"

prepareAssets()
serviceWorker.unregister()

interface AppPDFProps {
  url: string
  setFile: React.Dispatch<React.SetStateAction<File | null>>
}

const AppPDF: React.FC<AppPDFProps> = ({ url, setFile }) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [drawingModalOpen, setDrawingModalOpen] = useState(false)
  const {
    file,
    initialize,
    pageIndex,
    isMultiPage,
    isFirstPage,
    isLastPage,
    currentPage,
    isSaving,
    savePdf,
    previousPage,
    nextPage,
    setDimensions,
    newFile,
    name,
    dimensions,
  } = usePdf()
  const {
    add: addAttachment,
    allPageAttachments,
    pageAttachments,
    reset: resetAttachments,
    update,
    remove,
    setPageIndex,
  } = useAttachments()

  const initializePageAndAttachments = (pdfDetails: Pdf) => {
    initialize(pdfDetails)
    const numberOfPages = pdfDetails.pages.length
    resetAttachments(numberOfPages)
  }

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
    loadPdfFromUrl,
  } = useUploader({
    use: UploadTypes.PDF,
    afterUploadPdf: initializePageAndAttachments,
  })
  const {
    inputRef: imageInput,
    handleClick: handleImageClick,
    onClick: onImageClick,
    upload: uploadImage,
  } = useUploader({
    use: UploadTypes.IMAGE,
    afterUploadAttachment: addAttachment,
  })

  const addText = () => {
    const newTextAttachment: TextAttachment = {
      id: ggID(),
      type: AttachmentTypes.TEXT,
      x: 0,
      y: 0,
      width: 120,
      height: 25,
      size: 16,
      lineHeight: 1.4,
      fontFamily: "Times-Roman",
      text: "Enter Text Here",
    }
    addAttachment(newTextAttachment)
  }

  const addDrawing = (drawing?: {
    width: number
    height: number
    path: string
  }) => {
    if (!drawing) return

    const newDrawingAttachment: DrawingAttachment = {
      id: ggID(),
      type: AttachmentTypes.DRAWING,
      ...drawing,
      x: 0,
      y: 0,
      scale: 1,
    }
    addAttachment(newDrawingAttachment)
  }

  useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex])

  const hiddenInputs = (
    <>
      <input
        data-testid="pdf-input"
        ref={pdfInput}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      />
      <input
        ref={imageInput}
        type="file"
        id="image"
        name="image"
        accept="image/*"
        onClick={onImageClick}
        style={{ display: "none" }}
        onChange={uploadImage}
      />
    </>
  )

  const handleSaveToServer = async () => {
    const file = await newFile(allPageAttachments)
    setFile(file || null)
  }
  const handleDownloadPdf = () => savePdf(allPageAttachments)

  const handleLoadPdfFromUrl = async (url: string) => {
    try {
      // setIsUploading(true)
      const result = await loadPdfFromUrl(url)
      initializePageAndAttachments(result)
    } catch (error) {
      console.error("Error loading PDF from URL:", error)
    } finally {
      // setIsUploading(false)
    }
  }

  useEffect(() => {
    handleLoadPdfFromUrl(url)
  }, [url])

  const handleAddImage = async (file?: File) => {
    if (file) {
      // Xử lý file được truyền vào (từ chữ ký có sẵn)
      try {
        const url = await readAsDataURL(file)
        const img = await readAsImage(url as string)
        const id = ggID()
        const { width, height } = img

        const imageAttachment: ImageAttachment = {
          id,
          type: AttachmentTypes.IMAGE,
          width,
          height,
          x: 0,
          y: 0,
          img,
          file,
        }
        addAttachment(imageAttachment)
      } catch (error) {
        console.log("Failed to load image", error)
      }
    } else {
      // Mở dialog chọn file khi không có file được truyền vào
      handleImageClick()
    }
  }

  return (
    <div className="w-full">
      {hiddenInputs}
      <MenuBar
        openHelp={() => setHelpModalOpen(true)}
        saveToServer={handleSaveToServer}
        addText={addText}
        addImage={handleAddImage}
        addDrawing={() => setDrawingModalOpen(true)}
        savingPdfStatus={isSaving}
        uploadNewPdf={handlePdfClick}
        downloadPdf={handleDownloadPdf}
        isPdfLoaded={!!file}
      />

      {!file ? (
        <Empty loading={isUploading} uploadPdf={handlePdfClick} />
      ) : (
        <Grid>
          <Grid.Row>
            <Grid.Column width={3} verticalAlign="middle" textAlign="left">
              {isMultiPage && !isFirstPage && (
                <Button circular icon="angle left" onClick={previousPage} />
              )}
            </Grid.Column>
            <Grid.Column width={10}>
              {currentPage && (
                <Segment
                  data-testid="page"
                  compact
                  stacked={isMultiPage && !isLastPage}
                >
                  <div style={{ position: "relative" }}>
                    <Page
                      dimensions={dimensions}
                      updateDimensions={setDimensions}
                      page={currentPage}
                    />
                    {dimensions && (
                      <Attachments
                        pdfName={name}
                        removeAttachment={remove}
                        updateAttachment={update}
                        pageDimensions={dimensions}
                        attachments={pageAttachments}
                      />
                    )}
                  </div>
                </Segment>
              )}
            </Grid.Column>
            <Grid.Column width={3} verticalAlign="middle" textAlign="right">
              {isMultiPage && !isLastPage && (
                <Button circular icon="angle right" onClick={nextPage} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
      <DrawingModal
        open={drawingModalOpen}
        dismiss={() => setDrawingModalOpen(false)}
        confirm={addDrawing}
      />
    </div>
  )
}

export default AppPDF
