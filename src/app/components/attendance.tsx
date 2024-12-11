import React from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Assuming we have a type for the attendance data
type AttendanceData = {
  date: Date;
  status: "present" | "absent";
};

// This would typically come from your API or props
const attendanceData: AttendanceData[] = [
  { date: new Date(2024, 2, 5), status: "absent" },
  { date: new Date(2024, 2, 12), status: "absent" },
  { date: new Date(2024, 2, 19), status: "absent" },
  // Add more dates as needed
];

export default function Attendance() {
  const absentDays = attendanceData
    .filter((day) => day.status === "absent")
    .map((day) => day.date);

  const modifiers = {
    absent: absentDays,
  };

  const modifiersStyles = {
    absent: {
      color: "white",
      backgroundColor: "transparent",
    },
  };

  function renderDay(date: Date) {
    const isAbsent = absentDays.some(
      (absentDate) =>
        absentDate.getDate() === date.getDate() &&
        absentDate.getMonth() === date.getMonth() &&
        absentDate.getFullYear() === date.getFullYear()
    );

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{format(date, "d")}</span>
        {isAbsent && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-destructive rounded-full" />
        )}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold gradient-text">
          Attendance Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DayPicker
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          showOutsideDays
          className="mx-auto"
        //   @ts-ignore
          render={renderDay}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </CardContent>
    </Card>
  );
}
