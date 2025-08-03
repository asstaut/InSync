"use client";
import { useEffect, useState } from "react";
import type React from "react";
import { Layout } from "../../components/layout";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Archive, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import { jwtDecode } from "jwt-decode";

interface ProjectCardWithMenuProps {
  title: string;
  semester: string;
  projectId: string;
  onArchive: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

type JwtPayload = {
  userID: string;
  email: string;
  role: string;
};

function ProjectCardWithMenu({
  title,
  semester,
  projectId,
  onArchive,
  onDelete,
}: ProjectCardWithMenuProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/project/${projectId}`);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(projectId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(projectId);
  };

  return (
    <Card
      className="bg-teal-50 border-teal-200 relative cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleArchive}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
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
  );
}

export default function ArchivedProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<
    { title: string; semester: string; projectId: string }[]
  >([]);
  const [joinCode, setJoinCode] = useState("");
  const [isSupervisor, setIsSupervisor] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects/completed", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch projects");

        const rawData = await res.json();
        const formatted = rawData.map((p: any) => ({
          title: p.projectTitle,
          semester: p.Semester,
          projectId: p.projectID,
        }));
        setProjects(formatted);
      } catch (err) {
        console.log("1");
        console.log(err);
        console.error("Error fetching projects:", err);
        alert("Could not load projects.");
      }
    };

    const checkRole = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            setIsSupervisor(decoded.role?.toLowerCase() === "supervisor");
          } catch (err) {
            console.error("Failed to decode token", err);
          }
        }
      }
    };

    fetchProjects();
    checkRole();
  }, []);

  const handleAddProject = () => {
    router.push("/create-project");
  };

  const handleArchiveProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.projectId !== projectId));
    alert("Project archived successfully!");
  };

  const handleDeleteProject = (projectId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      setProjects(
        projects.filter((project) => project.projectId !== projectId)
      );
      alert("Project deleted successfully!");
    }
  };

  const handleJoinCode = async () => {
    if (!joinCode.trim()) {
      alert("Please enter a join code.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to join a project.");
      return;
    }

    try {
      // Optional: decode userID if you want to use it locally (not mandatory for this request)
      const decoded = jwtDecode<{ userID: number }>(token);
      const userID = decoded.userID;
      console.log("User ID from token:", userID);

      const response = await fetch("http://localhost:5000/api/user-projects/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // assuming your backend uses Bearer token in header for authenticateToken middleware
        },
        body: JSON.stringify({ joinCode }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Joined project successfully!");
        setJoinCode("");
      } else {
        alert(data.error || "Failed to join project");
      }
    } catch (error) {
      console.error("Error joining project:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
              onArchive={handleArchiveProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>

        {/* Buttons at bottom right */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Join a Project
              </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

              <Dialog.Content className="fixed top-[50%] left-[50%] max-w-md w-full p-6 bg-white rounded-md shadow-lg -translate-x-1/2 -translate-y-1/2">
                <Dialog.Title className="text-lg font-bold mb-4">
                  Enter Join Code
                </Dialog.Title>

                <div className="mb-4">
                  <Input
                    placeholder="Project Join Code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Dialog.Close asChild>
                    <Button
                      onClick={handleJoinCode}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Join
                    </Button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          {!isSupervisor && (
            <Button
              onClick={handleAddProject}
              className="bg-teal-600 hover:bg-teal-700 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add a Project
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
