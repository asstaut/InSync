"use client"

import type React from "react"
import { useState } from "react"
import { Layout } from "../../components/layout"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Trash2, FolderOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface ProjectCardWithMenuProps {
  title: string
  semester: string
  projectId: string
  onRestore: (projectId: string) => void
  onDelete: (projectId: string) => void
}

function ProjectCardWithMenu({ title, semester, projectId, onRestore, onDelete }: ProjectCardWithMenuProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/project/${projectId}`)
  }

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRestore(projectId)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(projectId)
  }

  return (
    <Card
      className="bg-teal-50 border-teal-200 relative cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleRestore} className="cursor-pointer">
                <FolderOpen className="w-4 h-4 mr-2" />
                Restore
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-center">
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{semester}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ArchivedProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState([
    { title: "IoT Smart Home", semester: "(2023/II)", projectId: "iot-smart-home" },
    { title: "E-Commerce Web", semester: "(2023/II)", projectId: "ecommerce-web" },
    { title: "Mobile Banking", semester: "(2023/I)", projectId: "mobile-banking" },
    { title: "AI Chatbot", semester: "(2023/I)", projectId: "ai-chatbot" },
  ])

  const handleAddProject = () => {
    router.push("/create-project")
  }

  const handleRestoreProject = (projectId: string) => {
    // Remove from archived projects (in real app, this would move to current projects)
    setProjects(projects.filter((project) => project.projectId !== projectId))

    // Show confirmation message
    alert(`Project restored to current projects!`)
  }

  const handleDeleteProject = (projectId: string) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) {
      setProjects(projects.filter((project) => project.projectId !== projectId))
      alert(`Project permanently deleted!`)
    }
  }

  return (
    <Layout title="Archived Projects">
      <div className="space-y-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project, index) => (
            <ProjectCardWithMenu
              key={index}
              title={project.title}
              semester={project.semester}
              projectId={project.projectId}
              onRestore={handleRestoreProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>

        {/* Add Project Button - positioned at bottom right */}
        <div className="fixed bottom-6 right-6">
          <Button onClick={handleAddProject} className="bg-teal-600 hover:bg-teal-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add a Project
          </Button>
        </div>
      </div>
    </Layout>
  )
}
