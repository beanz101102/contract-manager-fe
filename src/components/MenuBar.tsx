import React, { useState } from "react"
import { FileSignature, Image, PenLine, Save } from "lucide-react"

import { Button } from "@/components/ui/button"

import { SignatureListModal } from "../modals/components/SignatureListModal"

interface MenuBarProps {
  openHelp: () => void
  saveToServer: () => void
  downloadPdf: () => void
  addText: () => void
  addImage: (file?: File) => void
  addDrawing: () => void
  savingPdfStatus: boolean
  uploadNewPdf: () => void
  isPdfLoaded: boolean
}

export const MenuBar: React.FC<MenuBarProps> = ({
  openHelp,
  saveToServer,
  downloadPdf,
  addText,
  addImage,
  addDrawing,
  savingPdfStatus,
  uploadNewPdf,
  isPdfLoaded,
}) => {
  const handleSignatureSelect = async (signatureUrl: string) => {
    try {
      const response = await fetch(signatureUrl)
      const blob = await response.blob()
      const file = new File([blob], "signature.png", { type: "image/png" })
      addImage(file as any)
    } catch (error) {
      console.error("Error loading signature:", error)
    }
  }

  return (
    <div className="w-full bg-white border-b">
      <div className="mx-auto flex h-12 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <Button onClick={() => addImage()}>
            <Image className="h-4 w-4 mr-1.5" />
            Thêm hình ảnh
          </Button>

          <Button onClick={addDrawing}>
            <PenLine className="h-4 w-4 mr-1.5" />
            Chữ ký
          </Button>
          <SignatureListModal onSelect={handleSignatureSelect} />
        </div>

        {/* Right side */}
        <Button
          variant="default"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={saveToServer}
          disabled={savingPdfStatus}
        >
          <Save className="h-4 w-4 mr-1.5" />
          {savingPdfStatus ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>
    </div>
  )
}
