"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Layout } from "../../components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserIDFromToken } from "../../lib/token"


export default function CreateProjectPage() {
  const [activeTab] = useState("project")
  const [projectTitle, setProjectName] = useState("")
  const [projectDetails, setProjectDetails] = useState("")
  const [semester, setSemester] = useState("")
  const [repositoryLink, setRepositoryLink] = useState("")
const [proposalFile, setProposalFile] = useState<File | null>(null)
const [userID, setUserID] = useState<string | null>(null)

const getOrdinal = (n: number) => {
  if (n === 1) return "1st"
  if (n === 2) return "2nd"
  if (n === 3) return "3rd"
  return `${n}th`
}

const formatSemester = (sem: string): string => {
  const semNum = parseInt(sem)
  const year = Math.ceil(semNum / 2)
  const semInYear = semNum % 2 === 0 ? 2 : 1
  return `${getOrdinal(year)} Year ${getOrdinal(semInYear)} Sem`
}

useEffect(() => {
    const id = getUserIDFromToken()
    setUserID(id)
  }, [])

const handleCreateProject = async () => {
  if (!projectTitle || !semester || !projectDetails || !repositoryLink || !proposalFile) {
    alert("Please fill in all required fields.")
    return
  }

  if (!userID) {
    alert("User not logged in.")
    return
  }

  const formData = new FormData()
  formData.append("userID", userID)
  formData.append("projectTitle", projectTitle)
  formData.append("projectDescription", projectDetails)
  formData.append("Semester", formatSemester(semester))
  formData.append("projectRepository", repositoryLink)
  formData.append("status", "Pending")
  formData.append("proposal", proposalFile) // ⬅ actual file content

  try {
    const response = await fetch("http://localhost:5000/api/projects/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ leave out 'Content-Type'!
      },
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      alert("Project created successfully! Join Code: " + data.joinCode)
    } else {
      const err = await response.text()
      alert("Error: " + err)
    }
  } catch (error) {
    console.error("Error creating project:", error)
    alert("Something went wrong")
  }
}

const handleProposalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setProposalFile(file);
  }
};



  const renderTabContent = () => {
    switch (activeTab) {
      case "project":
        return (
          <div className="space-y-6">
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Your project</h3>
                    <Input
                      placeholder="Enter project name"
                      value={projectTitle}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Select Semester</h3>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Choose semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                        <SelectItem value="3">3rd Semester</SelectItem>
                        <SelectItem value="4">4th Semester</SelectItem>
                        <SelectItem value="5">5th Semester</SelectItem>
                        <SelectItem value="6">6th Semester</SelectItem>
                        <SelectItem value="7">7th Semester</SelectItem>
                        <SelectItem value="8">8th Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter details here..."
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  className="min-h-[200px] bg-gray-50 border-gray-200 resize-none"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input
  placeholder="Project repository link"
  className="text-sm"
  value={repositoryLink}
  onChange={(e) => setRepositoryLink(e.target.value)}
/>

                    <Button variant="outline" size="sm" className="bg-transparent">
                      📁 View repository
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Proposal Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Upload Pending
                    </Badge>
                    <div className="space-y-1">
                      <Input type="file" accept="application/pdf" className="text-xs" onChange={handleProposalChange} />
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Upload Proposal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <Layout title="Create Project" userRole="Student">
      <div className="max-w-4xl relative">
        {renderTabContent()}

        <div className="fixed bottom-6 right-6">
          <Button onClick={handleCreateProject} className="bg-teal-600 hover:bg-teal-700 shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>
      </div>
    </Layout>
  )
}
