'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/sidebar'
import Header from '../components/header'
import Overview from '../components/overview'
import Subjects from '../components/subjects'
import Attendance from '../components/attendance'
import Absences from '../components/absent'
import FuturisticLoader from './Loader'

interface AttendanceData {
  Name: string
  overallPercentage: number
  overallPresent: number
  overallLecture: number
  Subject: Array<{
    Name: string
    PercentageAttendance: string
    PresentAttendance: number
    TotalAttendance: number
  }>
  attendanceData: Array<{
    Subject: string
    Absent: string
    isAbsent: boolean
  }>
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('/api/attendance')
        const data = await response.json()
        setAttendanceData(data)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
      }
    }

    fetchAttendance()
  }, [])

  if (!attendanceData) {
    return <FuturisticLoader />
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          studentName={attendanceData.Name} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-card p-6">
          {activeSection === 'overview' && <Overview data={attendanceData} />}
          {activeSection === 'subjects' && <Subjects subjects={attendanceData.Subject} />}
          {activeSection === 'attendance' && <Attendance />}
          {activeSection === 'absences' && <Absences absences={attendanceData.attendanceData} />}
        </main>
      </div>
    </div>
  )
}