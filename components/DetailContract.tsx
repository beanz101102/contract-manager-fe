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
      <DialogContent className="sm:max-w-[900px] p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full border-b">
            <TabsTrigger
              value="info"
              className="flex-1 px-6 py-3 hover:bg-[#4bc5be]/10 data-[state=active]:bg-[#4bc5be] data-[state=active]:border-b-2 data-[state=active]:border-[#4bc5be] data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Thông tin hợp đồng
            </TabsTrigger>
            <TabsTrigger
              value="view"
              className="flex-1 px-6 py-3 hover:bg-[#4bc5be]/10 data-[state=active]:bg-[#4bc5be] data-[state=active]:border-b-2 data-[state=active]:border-[#4bc5be] data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Xem hợp đồng
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="p-6">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Thông tin chung</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <span className="text-gray-500">Ngày tạo:</span>
                    <span>{dayjs(data?.createdAt).format("DD/MM/YYYY")}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Người tạo:</span>
                    <span>{data?.createdBy?.fullName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span>
                      {
                        mapiContractStatus[
                          data?.status as keyof typeof mapiContractStatus
                        ]?.label
                      }
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">Diễn giải:</span>
                    <span>{data?.note}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Quá trình xử lý</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
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
                          {((process?.approver?.role ??
                            process?.signer?.role) === "customer"
                            ? "--"
                            : process?.approver?.department?.departmentName ??
                              process?.signer?.department?.departmentName) ||
                            "--"}
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
                          {process?.status === "pending"
                            ? "--"
                            : dayjs(
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
          <TabsContent value="view" className="p-6">
            {data?.pdfFilePath && (
              <iframe
                src={`${process.env.NEXT_PUBLIC_API_URL}${data?.pdfFilePath}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-[60vh] rounded-lg"
                frameBorder="0"
              />
            )}
          </TabsContent>
        </Tabs>
        <div className="p-6 flex justify-end border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DetailContract
