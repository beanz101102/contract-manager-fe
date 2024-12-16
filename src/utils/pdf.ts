import { PDFDocument } from "pdf-lib"

import { readAsArrayBuffer } from "./asyncReader"
import { normalize } from "./helpers"
import { getAsset } from "./prepareAssets"

export async function save(
  pdfFile: File,
  objects: Attachments[],
  name: string
) {
  const PDFLib = await getAsset("PDFLib")
  const download = await getAsset("download")
  let pdfDoc: {
    getPages: () => any[]
    embedFont: (arg0: unknown) => any
    embedJpg: (arg0: unknown) => any
    embedPng: (arg0: unknown) => any
    embedPdf: (arg0: any) => [any] | PromiseLike<[any]>
    save: () => any
  }

  try {
    pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile))
  } catch (e) {
    console.log("Failed to load PDF.")
    throw e
  }

  const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
    const pageObjects = objects[pageIndex]
    // 'y' starts from bottom in PDFLib, use this to calculate y
    const pageHeight = page.getHeight()
    const embedProcesses = pageObjects.map(async (object: Attachment) => {
      if (object.type === "image") {
        const { file, x, y, width, height } = object as ImageAttachment
        let img: any
        try {
          if (file.type === "image/jpeg") {
            img = await pdfDoc.embedJpg(await readAsArrayBuffer(file))
          } else {
            img = await pdfDoc.embedPng(await readAsArrayBuffer(file))
          }
          return () =>
            page.drawImage(img, {
              x,
              y: pageHeight - y - height,
              width,
              height,
            })
        } catch (e) {
          console.log("Failed to embed image.", e)
          throw e
        }
      } else if (object.type === "text") {
        const { x, y, text, lineHeight, size, fontFamily, width } =
          object as TextAttachment
        const pdfFont = await pdfDoc.embedFont(fontFamily)
        return () =>
          page.drawText(text, {
            maxWidth: width,
            font: pdfFont,
            size,
            lineHeight,
            x,
            y: pageHeight - size! - y,
          })
      } else if (object.type === "drawing") {
        const { x, y, path, scale, stroke, strokeWidth } =
          object as DrawingAttachment
        const {
          pushGraphicsState,
          setLineCap,
          popGraphicsState,
          setLineJoin,
          LineCapStyle,
          LineJoinStyle,
          rgb,
        } = PDFLib
        return () => {
          page.pushOperators(
            pushGraphicsState(),
            setLineCap(LineCapStyle.Round),
            setLineJoin(LineJoinStyle.Round)
          )

          const color = window.w3color(stroke!).toRgb()

          page.drawSvgPath(path, {
            borderColor: rgb(
              normalize(color.r),
              normalize(color.g),
              normalize(color.b)
            ),
            borderWidth: strokeWidth,
            scale,
            x,
            y: pageHeight - y,
          })
          page.pushOperators(popGraphicsState())
        }
      }
    })
    // embed objects in order
    const drawProcesses: any[] = await Promise.all(embedProcesses)
    drawProcesses.forEach((p) => p())
  })
  await Promise.all(pagesProcesses)
  try {
    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, name, "application/pdf")
  } catch (e) {
    console.log("Failed to save PDF.")
    throw e
  }
}

export const createPdfBlob = async (
  file: File,
  attachments: Attachments[],
  fileName: string
) => {
  const pdfDoc = await PDFDocument.load(await file.arrayBuffer())

  // Thêm các annotations vào PDF
  // ... (giữ nguyên logic xử lý attachments như trong hàm save)

  // Thay vì download, trả về Blob
  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: "application/pdf" })
}

export async function savePdfToServer(
  pdfFile: File,
  objects: Attachments[],
  name: string
): Promise<Uint8Array> {
  const PDFLib = await getAsset("PDFLib")
  let pdfDoc: {
    getPages: () => any[]
    embedFont: (arg0: unknown) => any
    embedJpg: (arg0: unknown) => any
    embedPng: (arg0: unknown) => any
    embedPdf: (arg0: any) => [any] | PromiseLike<[any]>
    save: () => any
  }

  try {
    pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile))
  } catch (e) {
    console.log("Failed to load PDF.")
    throw e
  }

  const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
    const pageObjects = objects[pageIndex] || [] // Add default empty array
    // 'y' starts from bottom in PDFLib, use this to calculate y
    const pageHeight = page.getHeight()
    const embedProcesses = pageObjects.map(async (object: Attachment) => {
      if (!object || !object.type) return () => {} // Handle undefined/null objects

      if (object.type === "image") {
        const { file, x, y, width, height } = object as ImageAttachment
        let img: any
        try {
          if (file && file.type === "image/jpeg") {
            img = await pdfDoc.embedJpg(await readAsArrayBuffer(file))
          } else if (file) {
            img = await pdfDoc.embedPng(await readAsArrayBuffer(file))
          }
          return () =>
            page.drawImage(img, {
              x,
              y: pageHeight - y - height,
              width,
              height,
            })
        } catch (e) {
          console.log("Failed to embed image.", e)
          throw e
        }
      } else if (object.type === "text") {
        const { x, y, text, lineHeight, size, fontFamily, width } =
          object as TextAttachment
        const pdfFont = await pdfDoc.embedFont(fontFamily)
        return () =>
          page.drawText(text, {
            maxWidth: width,
            font: pdfFont,
            size,
            lineHeight,
            x,
            y: pageHeight - size! - y,
          })
      } else if (object.type === "drawing") {
        const { x, y, path, scale, stroke, strokeWidth } =
          object as DrawingAttachment
        const {
          pushGraphicsState,
          setLineCap,
          popGraphicsState,
          setLineJoin,
          LineCapStyle,
          LineJoinStyle,
          rgb,
        } = PDFLib
        return () => {
          page.pushOperators(
            pushGraphicsState(),
            setLineCap(LineCapStyle.Round),
            setLineJoin(LineJoinStyle.Round)
          )

          const color = window.w3color(stroke || "#000000").toRgb() // Add default color

          page.drawSvgPath(path, {
            borderColor: rgb(
              normalize(color.r),
              normalize(color.g),
              normalize(color.b)
            ),
            borderWidth: strokeWidth,
            scale,
            x,
            y: pageHeight - y,
          })
          page.pushOperators(popGraphicsState())
        }
      }
    })
    // embed objects in order
    const drawProcesses: any[] = await Promise.all(embedProcesses)
    drawProcesses.forEach((p) => p && p()) // Check if p exists before calling
  })
  await Promise.all(pagesProcesses)
  try {
    const pdfBytes = await pdfDoc.save()
    console.log("pdfBytes", pdfBytes)
    return pdfBytes // Return the PDF bytes instead of downloading
  } catch (e) {
    console.log("Failed to save PDF.")
    throw e
  }
}
