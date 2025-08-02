"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Layout } from "../../../components/layout"
import { ProjectTabs } from "../../../components/project-tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Send, UserPlus, X } from "lucide-react"
import { useParams } from "next/navigation"

interface WorkLogEntry {
  id: number
  date: string
  task: string
}

interface Member {
  id: number
  name: string
  role: "supervisor" | "student"
}

interface Comment {
  id: number
  author: string
  role: "supervisor" | "student"
  content: string
  timestamp: string
}

export default function ProjectPage() {
  const params = useParams()

  const [activeTab, setActiveTab] = useState("project")
  const [workLogEntries, setWorkLogEntries] = useState<WorkLogEntry[]>([
    { id: 1, date: "2024-01-15", task: "Initial project setup and requirements gathering" },
    { id: 2, date: "2024-01-20", task: "Database design and schema creation" },
    { id: 3, date: "2024-01-25", task: "Frontend component development" },
  ])
  const [newDate, setNewDate] = useState("")
  const [newTask, setNewTask] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Suman Shrestha",
      role: "supervisor",
      content: "Excellent work on the database design! The schema looks well-structured and normalized.",
      timestamp: "2024-01-22 9:15 AM",
    },
    {
      id: 2,
      author: "Erika Shrestha",
      role: "student",
      content: "Thank you! I've also added indexes for better query performance.",
      timestamp: "2024-01-22 11:30 AM",
    },
    {
      id: 3,
      author: "Suman Shrestha",
      role: "supervisor",
      content: "Great thinking ahead! Make sure to document the indexing strategy in your report.",
      timestamp: "2024-01-22 2:45 PM",
    },
  ])
  const [newComment, setNewComment] = useState("")

  // Members state
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Suman Shrestha", role: "supervisor" },
    { id: 2, name: "Erika Shrestha", role: "student" },
    { id: 3, name: "Rujan Dhamala", role: "student" },
    { id: 4, name: "Safalta Baidar Shrestha", role: "student" },
    { id: 5, name: "Utsav Subedi", role: "student" },
  ])

  // Add member form state
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"supervisor" | "student">("student")

  // Sample project data based on projectId
  const { id: projectId } = useParams() // projectId comes from the route
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

const openProposalFromBuffer = () => {
  if (!currentProject?.proposal) {
    console.log("No proposal found");
    alert("No proposal available");
    return;
  }

  console.log("Raw proposal data:", currentProject.proposal);

  // Check type of proposal data
  if (currentProject.proposal instanceof Uint8Array) {
    console.log("proposal is Uint8Array");
  } else if (Array.isArray(currentProject.proposal)) {
    console.log("proposal is an Array");
  } else if (typeof currentProject.proposal === "object" && currentProject.proposal.data) {
    // Sometimes Buffer is serialized as { type: 'Buffer', data: [...] }
    console.log("proposal is a Buffer-like object with data field");
  } else if (typeof currentProject.proposal === "string") {
    console.log("proposal is a string (maybe base64)");
  } else {
    console.log("Unknown proposal type:", typeof currentProject.proposal);
  }

  // Convert proposal to Uint8Array, depending on its shape
  let uint8Array;

  if (currentProject.proposal instanceof Uint8Array) {
    uint8Array = currentProject.proposal;
  } else if (Array.isArray(currentProject.proposal)) {
    uint8Array = new Uint8Array(currentProject.proposal);
  } else if (typeof currentProject.proposal === "object" && currentProject.proposal.data) {
    uint8Array = new Uint8Array(currentProject.proposal.data);
  } else if (typeof currentProject.proposal === "string") {
    // If base64 string:
    try {
      const binaryString = atob(currentProject.proposal);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      uint8Array = bytes;
    } catch {
      alert("Proposal data string is not base64");
      return;
    }
  } else {
    alert("Proposal data format not recognized");
    return;
  }

  console.log("Uint8Array length:", uint8Array.length);
  console.log("First 10 bytes:", uint8Array.slice(0, 10));

  const blob = new Blob([uint8Array], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};




  useEffect(() => {
    if (!projectId) return

    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch project")
        const data = await res.json()
        setCurrentProject({
          name: data.projectTitle,
          semester: data.Semester,
          description: data.projectDescription,
          repository: data.projectRepository,
          status: data.status,
          joinCode: data.joinCode,
          proposal: data.proposal
        })
      } catch (error) {
        console.error("Error fetching project:", error)
        setCurrentProject(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) return <p>Loading...</p>
  if (!currentProject) return <p>Project not found.</p>

  const handleAddWorkLog = () => {
    if (newDate && newTask) {
      const newEntry: WorkLogEntry = {
        id: Date.now(),
        date: newDate,
        task: newTask,
      }
      setWorkLogEntries([...workLogEntries, newEntry])
      setNewDate("")
      setNewTask("")
      setShowAddForm(false)
    }
  }
  {/*
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(),
        author: "Current User", // In real app, this would be the logged-in user
        role: "student", // This would be determined by the user's role
        content: newComment.trim(),
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }
*/}
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // Example: use real values in a real app
    const userID = 1; // Replace with actual logged-in user ID
    const projectID = 2; // Replace with the active project ID

    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          projectID,
          commentText: newComment.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add comment");
      }

      const { id } = await res.json();

      // Build the comment locally with the returned id
      const comment: Comment = {
        id,
        author: "Current User", // Ideally fetched from user context
        role: "student",
        content: newComment.trim(),
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        id: Date.now(),
        name: newMemberName.trim(),
        role: newMemberRole,
      }
      setMembers([...members, newMember])
      setNewMemberName("")
      setNewMemberRole("student")
      setShowAddMemberForm(false)
    }
  }

  const handleRemoveMember = (memberId: number) => {
    if (window.confirm("Are you sure you want to remove this member from the project?")) {
      setMembers(members.filter((member) => member.id !== memberId))
    }
  }

  const supervisors = members.filter((member) => member.role === "supervisor")
  const students = members.filter((member) => member.role === "student")

  const renderTabContent = () => {
    switch (activeTab) {
      case "project":
        return (
          <div className="space-y-6">
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{currentProject.name}</h3>
                    <p className="text-sm text-gray-600">Join Code: {currentProject.joinCode}</p>
                  </div>
                  {/*<div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      📋
                    </Button>
                    <Button size="sm" variant="outline">
                      📁
                    </Button>
                  </div>*/}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">Name: {currentProject.name}</h4>
                    <p className="text-sm text-gray-600">Semester: {currentProject.semester}</p>
                    <p className="text-sm text-gray-600 mt-2">{currentProject.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-2">Repository</h5>
                      <div className="space-y-2">
                        <Input
                          placeholder="Project repository link"
                          defaultValue={currentProject.repository}
                          className="text-sm"
                          readOnly
                        />
                        <Button variant="outline" size="sm" className="bg-transparent">
                          📁 View repository
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-900 mb-2">Proposal Status</h5>
                      <div className="space-y-2">
                        <Badge
                          variant="secondary"
                          className={
                            currentProject.status === "Submitted"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {currentProject.status}
                        </Badge>
                        <div className="space-y-1">
                          {
  currentProject.proposal ? (
<Button onClick={openProposalFromBuffer}>
  View Proposal
</Button>



  ) : (
    <p className="text-sm text-gray-500">No proposal file available</p>
  )
}



                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "comments":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Comments</h3>
              <span className="text-sm text-gray-500">{comments.length} comments</span>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">No comments yet</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8 bg-gray-300">
                          <AvatarFallback className="text-gray-600 text-xs font-medium">
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${comment.role === "supervisor"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                                }`}
                            >
                              {comment.role}
                            </Badge>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <Card className="bg-white border-2 border-teal-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 bg-blue-500">
                      <AvatarFallback className="text-white text-xs font-medium">CU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[80px] resize-none border-gray-200 focus:border-teal-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "worklog":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Work Log</h3>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>

            {showAddForm && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <Input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                      <Input
                        placeholder="Enter task description"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddWorkLog} className="bg-teal-600 hover:bg-teal-700">
                      Add Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3 font-medium text-gray-900 bg-gray-50">Date</TableHead>
                      <TableHead className="font-medium text-gray-900 bg-gray-50">Task</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workLogEntries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                          No work log entries yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      workLogEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.date}</TableCell>
                          <TableCell>{entry.task}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )
      case "members":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
              <Button
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {/* Add Member Form */}
            {showAddMemberForm && (
              <Card className="bg-gray-50 border-2 border-teal-200">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Add New Member</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input
                          placeholder="Enter member name"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <Select
                          value={newMemberRole}
                          onValueChange={(value: "supervisor" | "student") => setNewMemberRole(value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddMemberForm(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMember}
                        disabled={!newMemberName.trim()}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Add Member
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Supervisor Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Supervisor ({supervisors.length})
              </h3>
              <div className="space-y-3">
                {supervisors.map((supervisor) => (
                  <div key={supervisor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 bg-gray-300">
                        <AvatarFallback className="text-gray-600 font-medium">
                          {supervisor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900 font-medium">{supervisor.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(supervisor.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Students Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Students ({students.length})
              </h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 bg-gray-300">
                        <AvatarFallback className="text-gray-600 font-medium">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900 font-medium">{student.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(student.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Layout title={`Project: ${currentProject.name}`} userRole="Student">
      <div className="max-w-4xl">
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} userRole="Student" />
        {renderTabContent()}
      </div>
    </Layout>
  )
}