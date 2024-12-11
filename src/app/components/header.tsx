import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  studentName: string;
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean
}

export default function Header({ studentName, setSidebarOpen, sidebarOpen }: HeaderProps) {
  return (
    <header className="bg-[#000000] shadow-md z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-4 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
            <h2 className="text-xl font-semibold text-white">
              Welcome, {studentName}
            </h2>
          </div>
          <div className="text-sm text-gray-400 sm:text-base md:text-sm lg:text-md hidden sm:block xl:text-lg">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </header>
  );
}
