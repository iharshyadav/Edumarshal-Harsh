"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from "date-fns"

interface AttendanceData {
  Subject: string
  Absent: string
  isAbsent: boolean
}

interface SubjectData {
  Name: string
  PercentageAttendance: string
  TotalAttendance: number
  PresentAttendance: number
}

interface OverviewProps {
  data: {
    Name: string
    overallPercentage: number
    overallPresent: number
    overallLecture: number
    Subject: SubjectData[]
    attendanceData: AttendanceData[]
  }
}

export default function Component({ data }: OverviewProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Overall Attendance" value={`${data.overallPercentage}%`} />
        <StatCard title="Total Subjects" value={data.Subject.length.toString()} />
        <StatCard
          title="Present / Total Lectures"
          value={`${data.overallPresent} / ${data.overallLecture}`}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {data.Subject.map((subject) => (
          <SubjectCard
            key={subject.Name}
            subject={subject}
            onClick={() => setSelectedSubject(subject)}
          />
        ))}
      </div>
      <AttendancePopup
        subject={selectedSubject}
        attendanceData={data.attendanceData}
        onClose={() => setSelectedSubject(null)}
      />
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function SubjectCard({ subject, onClick }: { subject: SubjectData; onClick: () => void }) {
  const attendance = parseFloat(subject.PercentageAttendance)
  const color = getAttendanceColor(attendance)

  const chartData = [
    { name: "Attendance", value: attendance },
    { name: "Remaining", value: 100 - attendance },
  ]

  return (
    <Card className="bg-gray-800 text-white cursor-pointer transition-all hover:bg-gray-700" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{subject.Name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="relative h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill={color}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                <Cell key="attendance" fill={color} />
                <Cell key="remaining" fill="#4B5563" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-3xl font-bold">{`${attendance}%`}</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

function AttendancePopup({ subject, attendanceData, onClose }: { subject: SubjectData | null; attendanceData: AttendanceData[]; onClose: () => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const subjectAttendance = useMemo(() => {
    if (!subject) return []
    return attendanceData
      .filter(item => item.Subject === subject.Name)
      .sort((a, b) => new Date(b.Absent).getTime() - new Date(a.Absent).getTime())
  }, [subject, attendanceData])

  const attendanceDates = useMemo(() => {
    const dates: Record<string, boolean> = {}
    subjectAttendance.forEach(item => {
      const date = format(new Date(item.Absent), 'yyyy-MM-dd')
      dates[date] = item.isAbsent
    })
    return dates
  }, [subjectAttendance])

  if (!subject) return null

  return (
    <Dialog open={!!subject} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subject.Name} Attendance</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Attendance Calendar</h3>
            <CustomCalendar
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              attendanceDates={attendanceDates}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Attendance List</h3>
            <ScrollArea className="h-[200px] md:h-[400px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectAttendance.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.Absent}</TableCell>
                      <TableCell>
                      <span className={item.isAbsent ? "text-red-500" : "text-green-500"}>
                      {item.isAbsent ? "Absent" : "Present"}
                    </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
        {/* <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div> */}
      </DialogContent>
    </Dialog>
  )
}

function CustomCalendar({ currentMonth, onMonthChange, attendanceDates }: { currentMonth: Date; onMonthChange: (date: Date) => void; attendanceDates: Record<string, boolean> }) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-white">
          &lt;
        </button>
        <h4 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h4>
        <button onClick={() => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-white">
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {monthDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const isAbsent = attendanceDates[dateKey]
          return (
            <div
              key={day.toString()}
              className={`
                text-center p-2 rounded-full
                ${isSameMonth(day, currentMonth) ? 'text-white' : 'text-gray-500'}
                ${isAbsent ? 'bg-red-500' : attendanceDates[dateKey] !== undefined ? 'bg-green-500' : ''}
              `}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getAttendanceColor(attendance: number): string {
  if (attendance < 70) return "#EF4444" // Bright red
  if (attendance <= 75) return "#F59E0B" // Bright yellow
  return "#10B981" // Bright green
}