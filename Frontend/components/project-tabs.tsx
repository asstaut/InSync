"use client"

import { Button } from "@/components/ui/button"

interface ProjectTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole?: "Student" | "Supervisor"
}

export function ProjectTabs({ activeTab, onTabChange, userRole = "Student" }: ProjectTabsProps) {
  const tabs = [
    { id: "project", label: "Project Page" },
    { id: "comments", label: "Comments" },
    { id: "worklog", label: "Work Log" },
    { id: "members", label: "Members" },
  ]

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`px-0 py-2 border-b-2 rounded-none ${
              activeTab === tab.id
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </div>
  )
}
