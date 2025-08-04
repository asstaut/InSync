import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  project: {
    name: string;
    semester: string;
    description: string;
    repository: string;
    status: string;
    joinCode: string;
    proposal?: any;
    score?: number;
  };
  onOpenProposal: () => void;
  isSupervisor: boolean;
  onChangeStatus : () => void;
}

export default function ProjectTab({ project, onOpenProposal,isSupervisor, onChangeStatus }: Props) {
    console.log(isSupervisor)
    
  return (
    <div className="space-y-6">
      <Card className="bg-teal-50 border-teal-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-600">
                Join Code: {project.joinCode}
              </p>
              <p className="text-sm text-gray-600">
                Project Score: {project.score}
              </p>
            </div>
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
              <h4 className="font-medium text-sm text-gray-900">
                Name: {project.name}
              </h4>
              <p className="text-sm text-gray-600">
                Semester: {project.semester}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-sm text-gray-900 mb-2">
                  Repository
                </h5>
                <div className="space-y-2">
                  <Input
                    placeholder="Project repository link"
                    defaultValue={project.repository}
                    className="text-sm"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => window.open(project.repository, "_blank")}
                  >
                    📁 View repository
                  </Button>
                </div>
              </div>

              <div>
  {/* Proposal Status Row */}
  <div className="flex items-center gap-2 mb-2">
  <h5 className="font-medium text-sm text-gray-900">Proposal Status:</h5>
  <Badge
    variant="secondary"
    className={
      project.status === "Submitted"
        ? "bg-green-100 text-green-800"
        : project.status === "Approve"
        ? "bg-blue-100 text-blue-800"
        : project.status === "Complete"
        ? "bg-gray-200 text-gray-600"
        : "bg-orange-100 text-orange-800"
    }
  >
    {project.status}
  </Badge>

  {isSupervisor && project.status !== "Complete" && (
    <Button
      size="sm"
      variant="outline"
      onClick={onChangeStatus}
    >
      {project.status === "Pending"
        ? "Mark as Approve"
        : project.status === "Approve"
        ? "Mark as Complete"
        : null}
    </Button>
  )}
</div>


  <h5 className="font-medium text-sm text-gray-900 mb-2">Proposal</h5>

  <div className="space-y-1">
    {project.proposal ? (
      <Button onClick={onOpenProposal}>View Proposal</Button>
    ) : (
      <p className="text-sm text-gray-500">No proposal file available</p>
    )}
  </div>
</div>

              </div>
              

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
