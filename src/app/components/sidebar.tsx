import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Attendance from './attendance'

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }: SidebarProps) {
  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'subjects', icon: '📚', label: 'Subjects' },
    { id: 'attendance', icon: '📅', label: 'Attendance' },
    { id: 'absences', icon: '❌', label: 'Absences' },
  ]

  return (
    <>
      <div
        className={`inset-0 z-40 transition-opacity bg-black bg-opacity-50 lg:hidden ${
          sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform sidebar lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-between flex-shrink-0 p-6">
          <span className="text-lg font-semibold gradient-text">Attendance Dashboard</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md transition ease-in-out duration-150 hover-lift ${
                activeSection === item.id
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => {
                setActiveSection(item.id)
                setSidebarOpen(false)
              }}
            >
              <span className="mr-4 text-xl">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        {/* <div className="mt-6 px-2">
          <Attendance />
        </div> */}
      </div>
    </>
  )
}