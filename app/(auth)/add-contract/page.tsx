"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Search, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { Document, Page } from "react-pdf"
import * as z from "zod"

import { User } from "@/types/auth"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Create new plugin instance

const formSchema = z.object({
  department: z.string().min(1, "Vui lòng chọn phòng ban"),
  creator: z.string().min(1, "Vui lòng nhập người tạo"),
  creationDate: z.string().min(1, "Vui lòng chọn ngày tạo"),
  contractNumber: z.string().min(1, "Vui lòng nhập số hợp đồng"),
  customerName: z.string().min(1, "Vui lòng nhập tên khách hàng"),
  customerId: z.string(),
  idNumber: z.string().min(1, "Vui lòng nhập số CCCD"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  signerCount: z.string().min(1, "Vui lòng chọn số lượng người ký"),
  notes: z.string(),
})

export default function ContractForm() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [fileName, setFileName] = useState<string>("")
  const [currentCustomer, setCurrentCustomer] = useState<User | null>(null)
  const router = useRouter()

  const { useListUsers } = useUsers()
  const { data, isLoading } = useListUsers("customer", 1, 10, searchTerm, null)

  const customers = data?.users || []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      creator: user?.fullName || "",
      creationDate: "",
      contractNumber: "",
      customerName: "",
      customerId: "",
      idNumber: "",
      email: "",
      phone: "",
      signerCount: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (user?.fullName) {
      form.setValue("creator", user.fullName)
    }
  }, [user?.fullName])

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("submit", values)
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
    router.back()
  })

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => {
                router.push("/individual-management")
              }}
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <Button
              onClick={() => {
                const payload = {
                  contractNumber: form.getValues("contractNumber"),
                  customer: currentCustomer?.id || 0,
                  contractType: "abc",
                  createdBy: user?.id || 0,
                  signersCount: parseInt(form.getValues("signerCount")),
                  note: form.getValues("notes"),
                }

                console.log("payload", payload)

                addContract({
                  ...payload,
                  file: pdfFile,
                })
              }}
            >
              Lưu hợp đồng
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
                          className="bg-white"
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
                  name="creationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày tạo</FormLabel>
                      <FormControl>
                        <Input className="bg-white" type="date" {...field} />
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
                        className="bg-white"
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
                    <FormLabel>Tên khách hàng *</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={`w-full justify-between bg-white ${
                              !field.value && "text-muted-foreground"
                            }`}
                          >
                            {field.value
                              ? customers?.find(
                                  (customer) =>
                                    customer.fullName === field.value
                                )?.fullName
                              : "Chọn khách hàng"}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Tìm kiếm khách hàng..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                          />
                          <CommandEmpty>
                            {isLoading
                              ? "Đang tải..."
                              : "Không tìm thấy khách hàng"}
                          </CommandEmpty>
                          <CommandList>
                            <CommandGroup heading="Suggestions">
                              {customers?.map((customer: any) => (
                                <CommandItem
                                  key={customer?.id}
                                  value={customer?.fullName}
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
                                  {customer?.fullName}
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
                        className="bg-white"
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
                        className="bg-white"
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
                          className="bg-white"
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
                          className="bg-white"
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
                      className="w-full h-24 border-dashed bg-white"
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
                  name="signerCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng người ký *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Chọn số lượng người ký" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 người</SelectItem>
                          <SelectItem value="2">2 người</SelectItem>
                          <SelectItem value="3">3 người</SelectItem>
                        </SelectContent>
                      </Select>
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
                        className="bg-white"
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
        </div>

        <Card className="p-4">
          <div className="aspect-[1/1.4] bg-muted rounded-lg flex items-center justify-center overflow-auto">
            {pdfFile ? (
              <object
                data={URL.createObjectURL(pdfFile)}
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
