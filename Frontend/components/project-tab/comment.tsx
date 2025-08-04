"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  userID: string;
  email: string;
  role: "supervisor" | "student";
};

interface Comment {
  id: number;
  author: string;
  role: "supervisor" | "student";
  content: string;
  timestamp: string;
}

interface CommentSectionProps {
  projectId: string;
}

export function CommentSection({ projectId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userRole, setUserRole] = useState<"supervisor" | "student" | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/comments/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();

      const formattedComments: Comment[] = data.map((item: any) => ({
        id: item.commentID,
        author: item.username,
        role: item.Role,
        content: item.commentText,
        timestamp: new Date(item.createdAt).toLocaleString(),
      }));

      setComments(formattedComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !token) return;
    const decoded = jwtDecode<JwtPayload>(token);

    try {
      const res = await fetch("http://localhost:4000/api/comments/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: decoded.userID,
          projectID: projectId,
          commentText: newComment.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add comment");

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:4000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete comment");
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  useEffect(() => {
    if (!projectId || !token) return;

    const decoded = jwtDecode<JwtPayload>(token);
    setUserRole(decoded.role);

    fetchComments();
    const interval = setInterval(fetchComments, 500);
    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        <span className="text-sm text-gray-500">{comments.length} comments</span>
      </div>

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
                        className={`text-xs ${comment.role === "supervisor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {comment.role}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp}
                      </span>
                      {userRole === "supervisor" && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Comment Input */}
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
}

