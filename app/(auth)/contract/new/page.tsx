"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

import { ApprovalWorkflowModal } from "../workflow/page"

// Create new plugin instance

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

// Add this type to track signer types
type SignerType = "internal" | "customer"

export default function ContractForm() {
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
  const [openSignerSelect, setOpenSignerSelect] = useState<{
    [key: number]: boolean
  }>({})
  const [searchSignerTerm, setSearchSignerTerm] = useState("")
  const [selectedSigners, setSelectedSigners] = useState<User[]>([])
  const [signerTypes, setSignerTypes] = useState<SignerType[]>(["internal"]) // First signer must be internal
  const [selectedApprovalFlow, setSelectedApprovalFlow] = useState<any>(null)
  const [isOpenCreateFlow, setIsOpenCreateFlow] = useState(false)
  const { useListUsers } = useUsers()
  const { data, isLoading } = useListUsers("customer", 1, 10, searchTerm, null)

  const customers = data?.users || []

  const { useListUsers: useListEmployees } = useUsers()
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useListEmployees("employee", 1, 10, searchTerm, null)
  const users = employeesData?.users || []

  const { useListUsers: useListSigners } = useUsers()
  const { data: signersData, isLoading: isLoadingSigners } = useListSigners(
    "",
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

  const { useAddContract } = useContracts()

  const { mutate: addContract } = useAddContract(() => {
    router.push("/contract/personal")
  })

  const { useListApprovalFlows } = useApprovalFlows()
  const { data: approvalFlowsData, isLoading: isLoadingFlows } =
    useListApprovalFlows(searchFlowTerm)
  const approvalFlows = approvalFlowsData || []

  // Thêm mutation để update approval flow
  const { useUpdateApprovalFlow } = useApprovalFlows()
  const { mutate: updateApprovalFlow } = useUpdateApprovalFlow()

  return (
    <div className="container max-w-[1200px] mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push("/contract/personal")}
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mt-4">
            Tạo hợp đồng mới
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 p-4 md:p-6">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Basic Info Section */}
                <div className="space-y-6 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="creator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Người tạo
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white h-10"
                              placeholder="Nhập tên người tạo"
                              {...field}
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contractNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Số hợp đồng *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white h-10"
                              placeholder="Nhập số hợp đồng"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Customer Selection */}
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Tên khách hàng *
                        </FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline2"
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
                                      className="hover:bg-gray-50 cursor-pointer py-3 px-4 "
                                      onSelect={() => {
                                        setCurrentCustomer(customer)
                                        form.setValue(
                                          "customerName",
                                          customer?.fullName
                                        )
                                        form.setValue(
                                          "customerId",
                                          customer?.code
                                        )
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Mã khách hàng
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white h-10"
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
                          <FormLabel className="text-gray-700">
                            Số CCCD *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white h-10"
                              placeholder="Nhập số CCCD"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white h-10"
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
                          <FormLabel className="text-gray-700">
                            Số điện thoại *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-white h-10"
                              placeholder="Nhập số điện thoại"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contract Document Section */}
                <div className="space-y-6 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tài liệu hợp đồng
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <FormLabel className="text-gray-700">
                        Hợp đồng *
                      </FormLabel>
                      <div className="relative mt-2">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={onFileChange}
                          className="hidden"
                          id="pdf-upload"
                        />
                        <Button
                          variant="outline"
                          className="w-full h-24 border-dashed bg-white hover:bg-gray-50"
                          onClick={() =>
                            document.getElementById("pdf-upload")?.click()
                          }
                          type="button"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6" />
                            <span>{fileName || "Chọn hợp đồng (.pdf)"}</span>
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
                                        (flow) =>
                                          flow.id.toString() === field.value
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
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium text-gray-700">
                                      Luồng duyệt
                                    </Label>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setIsOpenCreateFlow(true)}
                                      className="bg-teal-500 hover:bg-teal-600 text-white"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Tạo luồng duyệt mới
                                    </Button>
                                  </div>

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
                                              setSelectedApprovalFlow(flow)
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

                                  {selectedApprovalFlow && (
                                    <div className="border rounded-lg p-4 mt-4">
                                      <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold">
                                          Danh sách bước duyệt
                                        </h3>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedApprovalFlow(
                                              (prev: any) => ({
                                                ...prev,
                                                steps: [
                                                  ...prev.steps,
                                                  {
                                                    stepOrder:
                                                      prev.steps.length + 1,
                                                    department: null,
                                                    approver: null,
                                                  },
                                                ],
                                              })
                                            )
                                          }}
                                          className="bg-teal-500 hover:bg-teal-600 text-white"
                                        >
                                          <Plus className="w-4 h-4 mr-2" />
                                          Thêm bước duyệt
                                        </Button>
                                      </div>
                                      <Table>
                                        <TableHeader>
                                          <TableRow className="bg-gray-50">
                                            <TableHead className="w-[80px] text-center">
                                              STT
                                            </TableHead>
                                            <TableHead>Phòng/Ban</TableHead>
                                            <TableHead>Người duyệt</TableHead>
                                            <TableHead className="w-[100px] text-center">
                                              Thao tác
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedApprovalFlow.steps?.map(
                                            (step: any, index: number) => (
                                              <TableRow key={index}>
                                                <TableCell className="text-center">
                                                  {step.stepOrder}
                                                </TableCell>
                                                <TableCell>
                                                  {step.department
                                                    ?.departmentName || "--"}
                                                </TableCell>
                                                <TableCell>
                                                  <Popover>
                                                    <PopoverTrigger asChild>
                                                      <Button
                                                        variant="outline2"
                                                        role="combobox"
                                                        className="w-full justify-between bg-white"
                                                      >
                                                        {step.approver
                                                          ?.fullName ||
                                                          "Chọn người duyệt"}
                                                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                      </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[400px] p-0">
                                                      <Command>
                                                        <CommandInput
                                                          placeholder="Tìm kiếm người duyệt..."
                                                          value={
                                                            searchSignerTerm
                                                          }
                                                          onValueChange={
                                                            setSearchSignerTerm
                                                          }
                                                        />
                                                        <CommandEmpty>
                                                          {isLoadingSigners
                                                            ? "Đang tải..."
                                                            : "Không tìm thấy người duyệt"}
                                                        </CommandEmpty>
                                                        <CommandList>
                                                          <CommandGroup heading="Danh sách người duyệt">
                                                            {potentialSigners?.map(
                                                              (user: User) => (
                                                                <CommandItem
                                                                  key={user.id}
                                                                  value={
                                                                    user.fullName
                                                                  }
                                                                  onSelect={() => {
                                                                    setSelectedApprovalFlow(
                                                                      (
                                                                        prev: any
                                                                      ) => ({
                                                                        ...prev,
                                                                        steps:
                                                                          prev.steps.map(
                                                                            (
                                                                              s: any,
                                                                              i: number
                                                                            ) =>
                                                                              i ===
                                                                              index
                                                                                ? {
                                                                                    ...s,
                                                                                    approver:
                                                                                      user,
                                                                                    department:
                                                                                      user.department,
                                                                                  }
                                                                                : s
                                                                          ),
                                                                      })
                                                                    )
                                                                  }}
                                                                >
                                                                  <div className="flex flex-col">
                                                                    <span>
                                                                      {
                                                                        user.fullName
                                                                      }
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">
                                                                      {user
                                                                        .department
                                                                        ?.departmentName ||
                                                                        "Chưa có phòng ban"}
                                                                    </span>
                                                                  </div>
                                                                </CommandItem>
                                                              )
                                                            )}
                                                          </CommandGroup>
                                                        </CommandList>
                                                      </Command>
                                                    </PopoverContent>
                                                  </Popover>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                      setSelectedApprovalFlow(
                                                        (prev: any) => ({
                                                          ...prev,
                                                          steps:
                                                            prev.steps.filter(
                                                              (
                                                                s: any,
                                                                i: number
                                                              ) => i !== index
                                                            ),
                                                        })
                                                      )
                                                    }}
                                                    className="hover:bg-gray-100 h-8 w-8 p-0"
                                                  >
                                                    <X className="h-4 w-4 text-gray-500" />
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  )}

                                  <ApprovalWorkflowModal
                                    isOpen={isOpenCreateFlow}
                                    onOpenChange={setIsOpenCreateFlow}
                                    mode="create"
                                  />
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
                                              ?.filter((user) => {
                                                // Don't show already selected users
                                                if (
                                                  selectedSigners.some(
                                                    (selected) =>
                                                      selected.id === user.id
                                                  )
                                                ) {
                                                  return false
                                                }

                                                // For first signer (index 0), only show internal users
                                                if (
                                                  selectedSigners.length === 0
                                                ) {
                                                  return (
                                                    user.role !== "customer"
                                                  )
                                                }

                                                // For subsequent signers, show all users
                                                return true
                                              })
                                              .map((user: User) => (
                                                <CommandItem
                                                  key={user.id}
                                                  value={user.fullName}
                                                  className="hover:bg-gray-50 cursor-pointer"
                                                  onSelect={() => {
                                                    setSelectedSigners(
                                                      (prev) => [...prev, user]
                                                    )
                                                    setSignerTypes((prev) => [
                                                      ...prev,
                                                      user.role === "customer"
                                                        ? "customer"
                                                        : "internal",
                                                    ])
                                                  }}
                                                >
                                                  {user.fullName}
                                                  <span className="ml-2 text-sm text-gray-500">
                                                    (
                                                    {user.role === "customer"
                                                      ? "Khách hàng"
                                                      : "Nội bộ"}
                                                    )
                                                  </span>
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
                                              prev.filter(
                                                (s) => s.id !== signer.id
                                              )
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

                                    // Nếu có chỉnh sửa luồng duyệt, lưu luồng mới
                                    if (selectedApprovalFlow) {
                                      const payload = {
                                        id: selectedApprovalFlow.id,
                                        name: selectedApprovalFlow.name,
                                        steps: selectedApprovalFlow.steps.map(
                                          (step: any) => ({
                                            departmentId: step.department?.id,
                                            approverId: step.approver?.id,
                                            stepOrder: step.stepOrder,
                                          })
                                        ),
                                      }

                                      updateApprovalFlow(payload, {
                                        onSuccess: () => {
                                          // Refresh lại danh sách luồng duyệt nếu cần
                                          setOpenFlowDialog(false)
                                        },
                                      })
                                    } else {
                                      setOpenFlowDialog(false)
                                    }
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

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Ghi chú
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="bg-white min-h-[80px]"
                              placeholder="Nhập ghi chú"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full"
                  onClick={() => {
                    // Keep existing submit logic
                    const payload = {
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
                      approvalTemplateId: parseInt(
                        form.getValues("approvalFlow")
                      ),
                      note: form.getValues("notes"),
                      file: pdfFile,
                    }
                    addContract(payload as any)
                  }}
                >
                  Lưu hợp đồng
                </Button>
              </form>
            </Form>
          </div>

          {/* PDF Preview Card */}
          <Card className="lg:sticky lg:top-6 h-fit">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">
                Xem trước tài liệu
              </h3>
              <div className="aspect-[1/1.4] bg-muted rounded-lg flex items-center justify-center overflow-auto">
                {pdfFile ? (
                  <object
                    data={URL.createObjectURL(pdfFile) + "#toolbar=0"}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <p>Unable to display PDF file.</p>
                  </object>
                ) : (
                  "Chọn file PDF để xem trước"
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
