import { useState } from "react"

import { useUserSignatures } from "@/hooks/useUserSignatures"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import NextImage from "@/components/ui/next-img"

interface SignatureListModalProps {
  onSelect: (signatureUrl: string) => void
}

export const SignatureListModal = ({ onSelect }: SignatureListModalProps) => {
  const { useListSignatures } = useUserSignatures()
  const { data: listSignature } = useListSignatures()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Chọn chữ ký</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Chọn chữ ký có sẵn
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-6 p-6">
            {listSignature?.map((sig) => (
              <div
                key={sig.id}
                onClick={() => {
                  onSelect(`http://localhost:8000${sig.signatureImagePath}`)
                  setOpen(false)
                }}
                className="cursor-pointer group relative overflow-hidden rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-teal-500 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-teal-500/0 transition-colors group-hover:bg-teal-500/5" />
                <NextImage
                  src={`http://localhost:8000${sig.signatureImagePath}`}
                  alt="Signature"
                  className="mx-auto w-[100px] h-[100px] object-contain transition-transform"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
