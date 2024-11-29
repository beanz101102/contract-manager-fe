"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"

import { useDepartment } from "@/hooks/useDepartment"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  departmentName: z.string().min(2, {
    message: "Tên phòng ban phải có ít nhất 2 ký tự",
  }),
  description: z.string().min(10, {
    message: "Mô tả phải có ít nhất 10 ký tự",
  }),
})

export default function DepartmentCreatePage() {
  const router = useRouter()
  const { useAddDepartment } = useDepartment()
  const { mutate: addDepartment } = useAddDepartment()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departmentName: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addDepartment(values)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Tạo phòng ban mới</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="departmentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Tên phòng ban</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên phòng ban"
                    className="bg-white border-gray-200 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả cho phòng ban"
                    className="bg-white border-gray-200 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Tạo phòng ban
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
