"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

type Member = {
  id: number;
  name: string;
  Role: string;
  activityScore: number;
};

interface MembersSectionProps {
  projectId: string;
  isSupervisor: boolean;
}

export const MembersSection = ({ projectId, isSupervisor }: MembersSectionProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [supervisors, setSupervisors] = useState<Member[]>([]);
  const [students, setStudents] = useState<Member[]>([]);

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
        const formattedMembers: Member[] = data.map((member: any) => ({
          id: member.userid,
          name: member.username,
          Role: member.Role?.toLowerCase() || "unknown",
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

  const handleRemoveMember = async (memberId: number) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Login required");

      const res = await fetch("http://localhost:5000/api/user-projects/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userID: memberId,
          projectID: projectId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove");

      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setStudents((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("Error removing member:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
      </div>

      {/* Supervisors */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Supervisor ({supervisors.length})
        </h3>
        <div className="space-y-3">
          {supervisors.map((supervisor) => (
            <div key={supervisor.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 bg-gray-300">
                  <AvatarFallback>
                    {supervisor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-900 font-medium">{supervisor.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Students ({students.length})
        </h3>
        <div className="space-y-3">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 bg-gray-300">
                  <AvatarFallback>
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-gray-900 font-medium">{student.name}</div>
                  <div className="text-sm text-gray-500">
                    Score: {student.activityScore}
                  </div>
                </div>
              </div>

              {isSupervisor && (
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
};
