import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Label } from "@radix-ui/react-label"

import { useContracts } from "@/hooks/useContracts"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Textarea } from "../ui/textarea"

const EditRequestModal = ({
  isOpen,
  onOpenChange,
  selectedEmployees,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedEmployees: number[]
}) => {
  const { user } = useAuth()
  const { useApproveContract } = useContracts()
  const { mutate: rejectContract } = useApproveContract()
  const [reason, setReason] = useState("")

  const handleReject = () => {
    rejectContract({
      contracts: selectedEmployees.map((id) => ({
        contractId: id,
        comments: reason,
      })),
      status: "rejected",
      approverId: user?.id || 0,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Yêu cầu sửa lại
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason" className="font-medium">
              Lý do yêu cầu <span className="text-red-500">(*)</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do yêu cầu sửa lại"
              className="min-h-[100px] bg-white !rounded-lg !border-1 !border-gray-300"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          {/* <div className="grid gap-2">
            <Label htmlFor="file-upload" className="font-medium">
              Tệp đính kèm
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <Button
                variant="outline"
                className="w-full bg-teal-500 text-white hover:bg-teal-600"
              >
                Tệp đính kèm
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                (pdf, doc, docx, xlsx, xls, png, jpg, jpeg)
              </p>
            </div>
          </div> */}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-100 hover:bg-gray-200 text-black"
          >
            Đóng
          </Button>
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white"
            onClick={handleReject}
            disabled={!reason.trim()}
          >
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditRequestModal
