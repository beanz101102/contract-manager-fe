import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-white px-3 py-2",
          "text-sm text-gray-900",
          "border-gray-200",
          "focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none",
          "placeholder:text-gray-400",
          "file:mr-4 file:py-2 file:px-4 file:rounded-full",
          "file:border-0 file:text-sm file:font-medium",
          "file:bg-teal-50 file:text-teal-700",
          "hover:file:bg-teal-100",
          "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
          "disabled:border-gray-200",
          "[&.error]:border-red-500 [&.error]:text-red-500",
          "[&.error]:focus:border-red-500 [&.error]:focus:ring-red-500",
          "[&.error]:placeholder:text-red-400",
          "[&.success]:border-green-500",
          "[&.success]:focus:border-green-500 [&.success]:focus:ring-green-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
