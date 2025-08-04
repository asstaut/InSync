"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Layout } from "../../../components/layout";
import ProjectTab from "../../../components/project-tab/project";
import { ProjectTabs } from "../../../components/project-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommentSection } from "@/components/project-tab/comment";
import { MembersSection } from "@/components/project-tab/members";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  userID: string;
  email: string;
  role: string;
};

interface WorkLogEntry {
  id: number;
  date: string;
  task: string;
  author: string;
}

export default function ProjectPage() {
  const isCurrentUserSupervisor = useMemo(() => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role?.toLowerCase() === "supervisor";
    } catch {
      return false;
    }
  }, []);
  const params = useParams();
  const projectId = params.id;

  const [activeTab, setActiveTab] = useState("project");

  const [workLogEntries, setWorkLogEntries] = useState<WorkLogEntry[]>([]);

  const [newDate, setNewDate] = useState("");
  const [newTask, setNewTask] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

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
          `http://localhost:4000/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Cache-Control": "no-cache",
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
          score: data.projectScore,
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
    const fetchTasks = async () => {
    console.log("called");
    try {
      const res = await fetch(
        `http://localhost:4000/api/tasks/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Cache-Control": "no-cache", // ask for fresh data
            Pragma: "no-cache",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch work logs");

      const data = await res.json();
      console.log("Raw tasks from backend:", data);

      const formatted = data.map((item: any) => ({
        id: item.taskID,
        author: item.username,
        task: item.taskText, // renamed for UI consistency
        date: new Date(item.createdAt).toLocaleDateString(), // just the date part
      }));

      console.log("Formatted tasks:", formatted);

      setWorkLogEntries(formatted);
    } catch (err) {
      console.error("Error fetching work logs:", err);
    }
  };

    useEffect(() => {
    if (!projectId) return;
    fetchTasks();
  }, [projectId]);

  if (loading) return <p>Loading...</p>;
  if (!currentProject) return <p>Project not found.</p>;

  async function handleChangeStatus() {
    if (!projectId) {
      alert("Project ID is missing");
      return;
    }

    let nextStatus: string | null = null;

    switch (currentProject.status) {
      case "Pending":
        nextStatus = "Approve";
        break;
      case "Approve":
        nextStatus = "Complete";
        break;
      default:
        nextStatus = null; // no change for Complete or others
    }

    if (!nextStatus) return; // no update needed

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated.");
        return;
      }

      const res = await fetch(
        `http://localhost:4000/api/projects/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update project status");
      }

      alert(`Status updated to ${nextStatus}`);

      // Optionally update local state so UI updates immediately:
      setCurrentProject((prev: any) =>
        prev ? { ...prev, status: nextStatus } : prev
      );
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating status");
    }
  }

  const handleAddWorkLog = async () => {
    if (!newDate || !newTask.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a work log.");
      return;
    }

    const decoded = jwtDecode<JwtPayload>(token);

    try {
      const res = await fetch("http://localhost:4000/api/tasks/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: decoded.userID,
          projectID: projectId,
          date: newDate,
          taskText: newTask.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add work log");

      // Clear input fields on success
      setNewDate("");
      setNewTask("");
      console.log("hel");

      fetchTasks();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding work log:", error);
      alert("Failed to add work log. Please try again.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "project":
        return (
          <ProjectTab
            project={currentProject}
            onOpenProposal={openProposalFromBuffer}
            isSupervisor={isCurrentUserSupervisor}
            onChangeStatus={handleChangeStatus}
          />
        );
      case "comments":
        return <CommentSection projectId={projectId as string} />;
      case "worklog":
        return (
          <div className="space-y-4">
            {currentProject.status !== "Complete"&& !isCurrentUserSupervisor && (
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
            )}

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
                      <TableHead className="w-[50px] font-medium text-gray-900 bg-gray-50">
                        S.N.
                      </TableHead>
                      <TableHead className="w-1/4 font-medium text-gray-900 bg-gray-50">
                        Date
                      </TableHead>
                      <TableHead className="font-medium text-gray-900 bg-gray-50">
                        Task
                      </TableHead>
                      <TableHead className="w-1/4 font-medium text-gray-900 bg-gray-50">
                        Author
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workLogEntries.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-gray-500"
                        >
                          No work log entries yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      workLogEntries.map((entry, index) => (
                        <TableRow key={entry.id}>
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{entry.task}</TableCell>
                          <TableCell>{entry.author}</TableCell>
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
          <MembersSection
            projectId={projectId as string}
            isSupervisor={isCurrentUserSupervisor}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      title={`Project: ${currentProject.name}`}
      userRole={isCurrentUserSupervisor ? "Supervisor" : "Student"}
    >
      <div className="max-w-4xl">
        <ProjectTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={isCurrentUserSupervisor ? "Supervisor" : "Student"}
        />
        {renderTabContent()}
      </div>
    </Layout>
  );
}
