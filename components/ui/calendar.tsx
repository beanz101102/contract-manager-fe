import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker, useNavigation } from "react-day-picker"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear + 100 - 1900 }, 
    (_, i) => 1900 + i
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{ after: new Date() }}
      className={cn(
        "p-3 bg-white border !border-gray-200 rounded-md shadow-sm",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-1",
        caption_label: "text-sm font-medium cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 !border !border-gray-200"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-gray-900"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
        day_today: "bg-gray-100 text-gray-900",
        day_outside:
          "day-outside text-gray-400 aria-selected:bg-gray-100/50 aria-selected:text-gray-400",
        day_disabled: "text-gray-300 opacity-50",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }: { displayMonth: Date }) => {
          const { goToMonth } = useNavigation();
          const [showYearPicker, setShowYearPicker] = React.useState(false);
          
          return (
            <div className="relative">
              <div className="flex items-center justify-center pt-1">
                <div className="flex items-center gap-1">
                  <div
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 !border !border-gray-200"
                    )}
                    onClick={() => {
                      const prevMonth = new Date(displayMonth);
                      prevMonth.setMonth(prevMonth.getMonth() - 1);
                      goToMonth(prevMonth);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </div>
                  
                  <span 
                    onClick={() => setShowYearPicker(!showYearPicker)}
                    className="text-sm font-medium cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1"
                  >
                    {displayMonth.toLocaleString('default', { month: 'long' })} {displayMonth.getFullYear()}
                  </span>

                  <div
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 !border !border-gray-200"
                    )}
                    onClick={() => {
                      const nextMonth = new Date(displayMonth);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      goToMonth(nextMonth);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {showYearPicker && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-64">
                  <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          const newDate = new Date(displayMonth);
                          newDate.setFullYear(year);
                          goToMonth(newDate);
                          setShowYearPicker(false);
                        }}
                        className={cn(
                          "px-2 py-1 text-sm rounded-md text-center",
                          year === displayMonth.getFullYear()
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
