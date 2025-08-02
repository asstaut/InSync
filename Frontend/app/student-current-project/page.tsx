"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '../../components/layout'
import { ProjectTabs } from '../../components/project-tabs'
import { EmptyState } from '../../components/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, UserPlus, X } from 'lucide-react'

interface Member {
  id: number
  name: string
  role: "supervisor" | "student"
}

export default function StudentCurrentProject() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("project")
  
  // Members state
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Current User", role: "student" },
  ])
  
  // Add member form state
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"supervisor" | "student">("student")

  const handleCreateProject = () => {
    router.push("/create-project")
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
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">Current Project</h3>
                    <Input
                      placeholder="No project selected"
                      className="bg-white border-gray-200"
                      readOnly
                    />
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      📋
                    </Button>
                    <Button size="sm" variant="outline">
                      📁
                    </Button>
                    <Button size="sm" variant="outline">
                      📊
                    </Button>
                  </div>
                </div>
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
                      readOnly
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
                      <Input type="file" accept=".pdf,.doc,.docx" className="text-xs" />
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
                Add Users
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
                {supervisors.length === 0 ? (
                  <div className="flex items-center justify-center h-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-sm">No supervisor assigned yet</p>
                  </div>
                ) : (
                  supervisors.map((supervisor) => (
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
                  ))
                )}
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
        return (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Current Projects</h1>
                <p className="text-muted-foreground">View and manage your current projects</p>
              </div>
              <div className="flex gap-4">
                <Input 
                  placeholder="Search projects..." 
                  className="w-64" 
                />
                <Button>Filter</Button>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Project Alpha</span>
                    <Badge variant="default">Active</Badge>
                  </CardTitle>
                  <CardDescription>
                    A comprehensive web application for project management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Due: Dec 31, 2024</span>
                      <span>Team: 4 members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Project Beta</span>
                    <Badge variant="secondary">In Review</Badge>
                  </CardTitle>
                  <CardDescription>
                    Mobile application for task tracking and collaboration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: '90%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Due: Jan 15, 2025</span>
                      <span>Team: 3 members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Project Gamma</span>
                    <Badge variant="outline">Planning</Badge>
                  </CardTitle>
                  <CardDescription>
                    Data analytics dashboard for business intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress:</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: '25%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Due: Mar 30, 2025</span>
                      <span>Team: 5 members</span>
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
    <Layout title="Current Projects">
      <div className="max-w-4xl relative">
        <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
        
        {/* Create Project Button - positioned at bottom right */}
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