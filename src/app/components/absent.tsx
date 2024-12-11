import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format, isValid } from 'date-fns'
import { useMemo } from 'react'

interface Absence {
  Subject: string
  Absent: string
}

interface AbsencesProps {
  absences: AttendanceData[]
}

interface AttendanceData {
  Subject: string
  Absent: string
  isAbsent: boolean
}

export default function Absences({ absences }: AbsencesProps) {

  const attendanceDates = useMemo(() => {
    const dates: Record<string, boolean> = {};
    absences.forEach(item => {
      console.log(item.Absent)
      const date = new Date(item.Absent);
      if (isValid(date)) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        dates[formattedDate] = item.isAbsent;
      } else {
        console.error(`Invalid date: ${item.Absent}`);
      }
    });
    return dates;
  }, [absences]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Absences</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Absent Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(attendanceDates).map(([subject, date], index) => (
              <TableRow key={index}>
                <TableCell>{date}</TableCell>
                <TableCell>{subject}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}