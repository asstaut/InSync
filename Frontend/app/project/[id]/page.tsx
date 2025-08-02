"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Layout } from "../../../components/layout";
import ProjectTab from "../../../components/project-tab/project";
import { ProjectTabs } from "../../../components/project-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Send, X } from "lucide-react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  userID: string;
  email: string;
  role: string;
};

let isCurrentUserSupervisor = false;

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      isCurrentUserSupervisor = decoded.role?.toLowerCase() === "supervisor";
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }
}

interface WorkLogEntry {
  id: number;
  date: string;
  task: string;
}

type Member = {
  id: number;
  name: string;
  Role: string;
  activityScore: number;
};

interface Comment {
  id: number;
  author: string;
  role: "supervisor" | "student";
  content: string;
  timestamp: string;
}

export default function ProjectPage() {
  const params = useParams();

  const [activeTab, setActiveTab] = useState("project");
  const [workLogEntries, setWorkLogEntries] = useState<WorkLogEntry[]>([
    {
      id: 1,
      date: "2024-01-15",
      task: "Initial project setup and requirements gathering",
    },
    { id: 2, date: "2024-01-20", task: "Database design and schema creation" },
    { id: 3, date: "2024-01-25", task: "Frontend component development" },
  ]);
  const [newDate, setNewDate] = useState("");
  const [newTask, setNewTask] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
const [newComment, setNewComment] = useState("");

  // Members state
  const [members, setMembers] = useState<Member[]>([]);
  const [supervisors, setSupervisors] = useState<Member[]>([]);
  const [students, setStudents] = useState<Member[]>([]);

  // Sample project data based on projectId
  const { id: projectId } = useParams(); // projectId comes from the route
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    } else if (
      typeof currentProject.proposal === "object" &&
      currentProject.proposal.data
    ) {
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
    } else if (
      typeof currentProject.proposal === "object" &&
      currentProject.proposal.data
    ) {
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
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch project");
        const data = await res.json();
        setCurrentProject({
          name: data.projectTitle,
          semester: data.Semester,
          description: data.projectDescription,
          repository: data.projectRepository,
          status: data.status,
          joinCode: data.joinCode,
          proposal: data.proposal,
        });
      } catch (error) {
        console.error("Error fetching project:", error);
        setCurrentProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user-projects/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        console.log("Fetched members:", data);

        const formattedMembers: Member[] = data.map((member: any) => ({
          id: member.userid,
          name: member.username,
          Role: member.Role ? member.Role.toLowerCase() : "unknown", // ensure it's lowercase
          activityScore: member.activityScore,
        }));

        setMembers(formattedMembers);
        setSupervisors(formattedMembers.filter((m) => m.Role === "supervisor"));
        setStudents(formattedMembers.filter((m) => m.Role === "student"));
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    if (projectId) fetchMembers();
  }, [projectId]);

  useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/project/${projectId}`,
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();

      const formattedComments: Comment[] = data.map((item: any) => ({
        id: item.commentID,
        author: item.username,
        role: item.role,
        content: item.commentText,
        timestamp: new Date(item.createdAt).toLocaleString(),
      }));

      setComments(formattedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  fetchComments();
}, [projectId]);

  if (loading) return <p>Loading...</p>;
  if (!currentProject) return <p>Project not found.</p>;

  const handleAddWorkLog = () => {
    if (newDate && newTask) {
      const newEntry: WorkLogEntry = {
        id: Date.now(),
        date: newDate,
        task: newTask,
      };
      setWorkLogEntries([...workLogEntries, newEntry]);
      setNewDate("");
      setNewTask("");
      setShowAddForm(false);
    }
  };
  {
    /*
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
*/
  }
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
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleRemoveMember = (memberId: number) => {
    if (
      window.confirm(
        "Are you sure you want to remove this member from the project?"
      )
    ) {
      setMembers(members.filter((member) => member.id !== memberId));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "project":
        return (
          <ProjectTab
            project={currentProject}
            onOpenProposal={openProposalFromBuffer}
          />
        );
      case "comments":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Comments</h3>
              <span className="text-sm text-gray-500">
                {comments.length} comments
              </span>
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
                            <span className="font-medium text-sm text-gray-900">
                              {comment.author}
                            </span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                comment.role === "supervisor"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {comment.role}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
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
                      <AvatarFallback className="text-white text-xs font-medium">
                        CU
                      </AvatarFallback>
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
                    <p className="text-xs text-gray-500">
                      Press Enter to send, Shift+Enter for new line
                    </p>
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
        );
      case "worklog":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Work Log</h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>

            {showAddForm && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Task
                      </label>
                      <Input
                        placeholder="Enter task description"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddWorkLog}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
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
                      <TableHead className="w-1/3 font-medium text-gray-900 bg-gray-50">
                        Date
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 bg-gray-50">
                        Task
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workLogEntries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center py-8 text-gray-500"
                        >
                          No work log entries yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      workLogEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {entry.date}
                          </TableCell>
                          <TableCell>{entry.task}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      case "members":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Team Members
              </h3>
            </div>

            {/* Supervisor Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Supervisor ({supervisors.length})
              </h3>
              <div className="space-y-3">
                {supervisors.map((supervisor) => (
                  <div
                    key={supervisor.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 bg-gray-300">
                        <AvatarFallback className="text-gray-600 font-medium">
                          {supervisor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-900 font-medium">
                        {supervisor.name}
                      </span>
                    </div>
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
                  <div
                    key={student.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 bg-gray-300">
                        <AvatarFallback className="text-gray-600 font-medium">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-gray-900 font-medium">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Score: {student.activityScore}
                        </div>
                      </div>
                    </div>

                    {isCurrentUserSupervisor && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(student.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout title={`Project: ${currentProject.name}`} userRole="Student">
      <div className="max-w-4xl">
        <ProjectTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole="Student"
        />
        {renderTabContent()}
      </div>
    </Layout>
  );
}