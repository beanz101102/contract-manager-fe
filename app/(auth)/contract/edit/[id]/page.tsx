"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Plus, Search, Upload, X } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { User } from "@/types/auth"
import { useApprovalFlows } from "@/hooks/useApprovalFlows"
import { useContracts } from "@/hooks/useContracts"
import { useUsers } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  department: z.string().min(1, "Vui lòng chọn phòng ban"),
  creator: z.string().min(1, "Vui lòng nhập người tạo"),
  contractNumber: z.string().min(1, "Vui lòng nhập số hợp đồng"),
  customerName: z.string().min(1, "Vui lòng nhập tên khách hàng"),
  customerId: z.string(),
  idNumber: z.string().min(1, "Vui lòng nhập số CCCD"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  notes: z.string(),
  approvalFlow: z.string().min(1, "Vui lòng chọn luồng duyệt"),
})

export default function EditContractPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [fileName, setFileName] = useState<string>("")
  const [currentCustomer, setCurrentCustomer] = useState<User | null>(null)
  const router = useRouter()
  const [openFlowDialog, setOpenFlowDialog] = useState(false)
  const [searchFlowTerm, setSearchFlowTerm] = useState("")
  const [searchSignerTerm, setSearchSignerTerm] = useState("")
  const [selectedSigners, setSelectedSigners] = useState<User[]>([])
  const id = useParams().id

  const { useContractDetail, useUpdateContract } = useContracts()
  const { mutate: updateContract } = useUpdateContract()

  const { data: contractDetail, isLoading: isLoadingContractDetail } =
    useContractDetail(Number(id))

  const { useListUsers } = useUsers()
  const { data, isLoading } = useListUsers("customer", 1, 10, searchTerm, null)

  const customers = data?.users || []

  const { useListUsers: useListEmployees } = useUsers()
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useListEmployees("employee", 1, 10, searchTerm, null)
  const users = employeesData?.users || []

  const { useListUsers: useListSigners } = useUsers()
  const { data: signersData, isLoading: isLoadingSigners } = useListSigners(
    "employee",
    1,
    10,
    searchSignerTerm,
    null
  )
  const potentialSigners = signersData?.users || []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      creator: "",
      contractNumber: "",
      customerName: "",
      customerId: "",
      idNumber: "",
      email: "",
      phone: "",
      notes: "",
      approvalFlow: "",
    },
  })

  useEffect(() => {
    if (contractDetail) {
      setCurrentCustomer(contractDetail.customer)

      form.reset({
        creator: contractDetail.createdBy.fullName,
        contractNumber: contractDetail.contractNumber,
        customerName: contractDetail.customer.fullName,
        customerId: contractDetail.customer.code,
        idNumber: contractDetail.customer.idNumber,
        email: contractDetail.customer.email,
        phone: contractDetail.customer.phoneNumber || "",
        notes: contractDetail.note,
        approvalFlow: contractDetail.approvalTemplate?.id.toString(),
      })

      if (contractDetail.signers) {
        const sortedSigners = [...contractDetail.signers]
          .sort((a, b) => a.signOrder - b.signOrder)
          .map(
            (signer) =>
              ({
                ...signer.signer,
                id: signer.signer.id,
                fullName: signer.signer.name,
                email: signer.signer.email,
              } as any)
          )
        setSelectedSigners(sortedSigners)
      }
    }
  }, [contractDetail])

  useEffect(() => {
    if (user?.fullName) {
      form.setValue("creator", user.fullName)
    }
  }, [user?.fullName])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      contractNumber: values.contractNumber,
      customerId: currentCustomer?.id || 0,
      contractType: "purchase",
      createdById: user?.id || 0,
      signers: selectedSigners.map((signer) => signer?.id),
      approvalTemplateId: parseInt(values.approvalFlow),
      note: values.notes,
      file: pdfFile,
    }
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      setFileName(file.name)
    } else {
      alert("Vui lòng chọn file PDF")
    }
  }

  useEffect(() => {
    return () => {
      if (pdfFile) {
        URL.revokeObjectURL(pdfFile.name)
      }
    }
  }, [pdfFile])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const { useListApprovalFlows } = useApprovalFlows()
  const { data: approvalFlowsData, isLoading: isLoadingFlows } =
    useListApprovalFlows(searchFlowTerm)
  const approvalFlows = approvalFlowsData || []

  return (
    <div className="container mx-auto py-6 bg-white rounded-[10px] border-none shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => {
                router.push("/contract/personal")
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="creator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người tạo</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white h-10 border border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-gray-950"
                          placeholder="Nhập tên người tạo"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contractNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số hợp đồng *</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white h-10 border border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-gray-950"
                        placeholder="Nhập số hợp đồng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700">
                      Tên khách hàng *
                    </FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="h-10 w-full justify-between bg-white hover:bg-gray-50 border-gray-200 text-left font-normal"
                            role="combobox"
                          >
                            {field.value
                              ? customers?.find(
                                  (customer) =>
                                    customer.fullName === field.value
                                )?.fullName
                              : "Chọn khách hàng"}
                            <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0 bg-white border border-gray-200 shadow-lg">
                        <Command className="border-none bg-white">
                          <CommandInput
                            placeholder="Tìm kiếm khách hàng..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                            className="border-none focus:ring-0"
                          />
                          <CommandEmpty className="py-4 text-sm text-gray-500 text-center">
                            {isLoading
                              ? "Đang tải..."
                              : "Không tìm thấy khách hàng"}
                          </CommandEmpty>
                          <CommandList>
                            <CommandGroup
                              heading="Gợi ý"
                              className="text-sm text-gray-700"
                            >
                              {customers?.map((customer: any) => (
                                <CommandItem
                                  key={customer?.id}
                                  value={customer?.fullName}
                                  className="hover:bg-gray-50 cursor-pointer py-3 px-4"
                                  onSelect={() => {
                                    setCurrentCustomer(customer)
                                    form.setValue(
                                      "customerName",
                                      customer?.fullName
                                    )
                                    form.setValue("customerId", customer?.code)
                                    form.setValue(
                                      "idNumber",
                                      customer?.idNumber
                                    )
                                    form.setValue("email", customer?.email)
                                    form.setValue(
                                      "phone",
                                      customer?.phoneNumber || ""
                                    )
                                    setOpen(false)
                                  }}
                                >
                                  <span className="text-gray-700">
                                    {customer?.fullName}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã khách hàng</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white h-10 border border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-gray-950"
                        placeholder="Nhập mã khách hàng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số CCCD *</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white h-10 border border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-gray-950"
                        placeholder="Nhập số căn cước công dân"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white h-10 border border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-gray-950"
                          type="email"
                          placeholder="Nhập email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại *</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white h-10 border border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-gray-950"
                          placeholder="Nhập số điện thoại"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <FormLabel>Hợp đồng *</FormLabel>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={onFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <Button
                      variant="outline"
                      className="w-full h-24 border-dashed bg-white hover:bg-gray-50 border-gray-200"
                      onClick={() =>
                        document.getElementById("pdf-upload")?.click()
                      }
                      type="button"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6" />
                        <span>
                          {fileName ||
                            (contractDetail?.pdfFilePath
                              ? "Chọn hợp đồng mới (.pdf)"
                              : "Chọn hợp đồng (.pdf)")}
                        </span>
                      </div>
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="approvalFlow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Luồng duyệt và ký *
                      </FormLabel>
                      <Dialog
                        open={openFlowDialog}
                        onOpenChange={setOpenFlowDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-10 w-full justify-between bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                            type="button"
                          >
                            <span className="text-gray-600">
                              {field.value
                                ? approvalFlows.find(
                                    (flow) => flow.id.toString() === field.value
                                  )?.name
                                : "Chọn luồng duyệt và ký"}
                            </span>
                            <Search className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] p-6 bg-white">
                          <DialogHeader className="border-b border-gray-200 pb-4">
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                              Chọn luồng duyệt và ký
                            </DialogTitle>
                          </DialogHeader>

                          <div className="py-4 space-y-6">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                Luồng duyệt
                              </Label>
                              <Command className="border border-gray-200 rounded-md mt-2 bg-white">
                                <CommandInput
                                  placeholder="Tìm kiếm luồng duyệt..."
                                  value={searchFlowTerm}
                                  onValueChange={setSearchFlowTerm}
                                  className="border-none focus:ring-0 text-gray-700"
                                />
                                <CommandEmpty className="py-4 text-sm text-gray-500 text-center">
                                  {isLoadingFlows
                                    ? "Đang tải..."
                                    : "Không tìm thấy luồng duyệt"}
                                </CommandEmpty>
                                <CommandList>
                                  <CommandGroup
                                    heading="Danh sách luồng duyệt"
                                    className="text-sm text-gray-500"
                                  >
                                    {approvalFlows?.map((flow) => (
                                      <CommandItem
                                        key={flow.id}
                                        value={flow.name}
                                        className="hover:bg-gray-50 cursor-pointer py-3 px-4"
                                        onSelect={() => {
                                          form.setValue(
                                            "approvalFlow",
                                            flow.id.toString()
                                          )
                                        }}
                                      >
                                        <div className="flex flex-col gap-1">
                                          <span className="font-medium text-gray-700">
                                            {flow.name}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </div>

                            <div className="space-y-4">
                              <Label className="text-sm font-medium">
                                Danh sách người ký
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="h-10 w-full justify-between bg-white hover:bg-gray-50 border-gray-200"
                                  >
                                    Thêm người ký
                                    <Plus className="ml-2 h-4 w-4 shrink-0 text-gray-500" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0 shadow-lg border border-gray-200">
                                  <Command>
                                    <CommandInput
                                      placeholder="Tìm kiếm người ký..."
                                      value={searchSignerTerm}
                                      onValueChange={setSearchSignerTerm}
                                      className="border-none focus:ring-0"
                                    />
                                    <CommandEmpty className="py-4 text-sm text-gray-500 text-center">
                                      {isLoadingSigners
                                        ? "Đang tải..."
                                        : "Không tìm thấy người ký"}
                                    </CommandEmpty>
                                    <CommandList>
                                      <CommandGroup
                                        heading="Danh sách người ký"
                                        className="text-sm text-gray-700"
                                      >
                                        {potentialSigners
                                          ?.filter(
                                            (user) =>
                                              !selectedSigners.some(
                                                (selected) =>
                                                  selected.id === user.id
                                              )
                                          )
                                          .map((user: User) => (
                                            <CommandItem
                                              key={user.id}
                                              value={user.fullName}
                                              className="hover:bg-gray-50 cursor-pointer"
                                              onSelect={() => {
                                                setSelectedSigners((prev) => [
                                                  ...prev,
                                                  user,
                                                ])
                                              }}
                                            >
                                              {user.fullName}
                                            </CommandItem>
                                          ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>

                              <div className="space-y-2">
                                {selectedSigners.map((signer, index) => (
                                  <div
                                    key={signer.id}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-700">
                                        Người ký {index + 1}:
                                      </span>
                                      <span className="text-sm text-gray-600">
                                        {signer.fullName}
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setSelectedSigners((prev) =>
                                          prev.filter((s) => s.id !== signer.id)
                                        )
                                      }
                                      className="hover:bg-gray-100 h-8 w-8 p-0"
                                    >
                                      <X className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <DialogFooter className="border-t border-gray-200 pt-4 gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setOpenFlowDialog(false)}
                              className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={() => {
                                if (!form.getValues("approvalFlow")) {
                                  alert("Vui lòng chọn luồng duyệt")
                                  return
                                }

                                setOpenFlowDialog(false)
                              }}
                            >
                              Xác nhận
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-white min-h-[80px] border border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-gray-950"
                        placeholder="Nhập ghi chú"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button
            className="w-full mt-4"
            onClick={() => {
              const payload = {
                id: Number(id),
                contractNumber: form.getValues("contractNumber"),
                customerId: currentCustomer?.id || 0,
                contractType: "purchase",
                createdById: user?.id || 0,
                signers: JSON.stringify(
                  selectedSigners.map((signer, idx) => ({
                    userId: signer?.id,
                    order: idx + 1,
                  }))
                ),
                approvalTemplateId: parseInt(form.getValues("approvalFlow")),
                note: form.getValues("notes"),
                file: pdfFile,
              }

              updateContract(payload as any)
            }}
          >
            Lưu hợp đồng
          </Button>
        </div>

        <Card className="p-4">
          <div className="aspect-[1/1.4] bg-muted rounded-lg flex items-center justify-center overflow-auto">
            {pdfFile || contractDetail?.pdfFilePath ? (
              <object
                data={
                  pdfFile
                    ? URL.createObjectURL(pdfFile)
                    : `${process.env.NEXT_PUBLIC_API_URL}${contractDetail?.pdfFilePath}`
                }
                type="application/pdf"
                className="w-full h-full"
              >
                <p>Unable to display PDF file.</p>
              </object>
            ) : (
              "Chọn file PDF để xem trước"
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
