import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Subject {
  Name: string
  PercentageAttendance: string
  PresentAttendance: number
  TotalAttendance: number
}

interface SubjectsProps {
  subjects: Subject[]
}

export default function Subjects({ subjects }: SubjectsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Subject Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Attendance %</TableHead>
              <TableHead>Present / Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => {
              const percentage = parseFloat(subject.PercentageAttendance)
              let badgeVariant: 'default' | 'secondary' | 'destructive' = 'default'
              let status = 'Good'
              if (percentage < 75) {
                badgeVariant = 'destructive'
                status = 'Poor'
              } else if (percentage < 80) {
                badgeVariant = 'secondary'
                status = 'Average'
              }

              return (
                <TableRow key={subject.Name}>
                  <TableCell>{subject.Name}</TableCell>
                  <TableCell>{subject.PercentageAttendance}</TableCell>
                  <TableCell>
                    {subject.PresentAttendance} / {subject.TotalAttendance}
                  </TableCell>
                  <TableCell>
                    <Badge variant={badgeVariant}>{status}</Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}