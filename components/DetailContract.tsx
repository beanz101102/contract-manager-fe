import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import dayjs from "dayjs"

import { mapiContractStatus, mappingRole } from "@/types/api"
import { useContracts } from "@/hooks/useContracts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "./ui/button"
import { Dialog, DialogContent } from "./ui/dialog"

const DetailContract = ({
  id,
  isOpen,
  onOpenChange,
}: {
  id: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const { useContractDetail } = useContracts()
  const { data } = useContractDetail(id)
  const [activeTab, setActiveTab] = useState("info")

  const listProcess = [...(data?.approvals ?? []), ...(data?.signers ?? [])]

  useEffect(() => {
    return () => {
      setActiveTab("info")
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              Thông tin hợp đồng
            </TabsTrigger>
            <TabsTrigger value="view" className="flex-1">
              Xem hợp đồng
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Thông tin chung</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p>Ngày tạo: {dayjs(data?.createdAt).format("DD/MM/YYYY")}</p>
                  <p>Người tạo: {data?.createdBy?.fullName}</p>
                  <p>
                    Trạng thái:{" "}
                    {
                      mapiContractStatus[
                        data?.status as keyof typeof mapiContractStatus
                      ]?.label
                    }
                  </p>
                  <p>Diễn giải: {data?.note}</p>
                </div>
              </div>
              {/* <div>
                <h3 className="font-semibold">Thông tin khác</h3>
                <div>
                  <p>Nhận xét:</p>
                  <Button variant="outline" className="mt-2">
                    Tệp đính kèm
                  </Button>
                </div>
              </div> */}
              <div>
                <h3 className="font-semibold">Quá trình xử lý</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STT</TableHead>
                      <TableHead>Thao tác</TableHead>
                      <TableHead>Người thực hiện</TableHead>
                      <TableHead>Chức vụ</TableHead>
                      <TableHead>Phòng ban</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày thực hiện</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listProcess?.map((process: any, index) => (
                      <TableRow key={`item-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {process?.approver ? "Duyệt" : "Ký"}
                        </TableCell>
                        <TableCell>
                          {process?.approver?.name ?? process?.signer?.name}
                        </TableCell>
                        <TableCell>
                          {
                            mappingRole[
                              (process?.approver?.role ??
                                process?.signer
                                  ?.role) as keyof typeof mappingRole
                            ]
                          }
                        </TableCell>
                        <TableCell>
                          {process?.approver?.department?.departmentName ??
                            process?.signer?.department?.departmentName}
                        </TableCell>
                        <TableCell>
                          {process?.status === "pending"
                            ? process?.approver
                              ? "Chưa duyệt"
                              : "Chưa ký"
                            : mapiContractStatus[
                                process?.status as keyof typeof mapiContractStatus
                              ]?.label}
                        </TableCell>
                        <TableCell>
                          {dayjs(
                            process?.signedAt ?? process?.approvedAt
                          ).format("DD/MM/YYYY")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="view" className="p-4">
            {data?.pdfFilePath && (
              <object
                data={`http://localhost:8000${data?.pdfFilePath}`}
                type="application/pdf"
                className="w-full h-[40vh]"
              >
                <p>Không thể hiển thị file PDF.</p>
              </object>
            )}
          </TabsContent>
        </Tabs>
        <div className="p-4 flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-100 hover:bg-gray-200 text-black"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DetailContract
