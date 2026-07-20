export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Priority = "low" | "medium" | "high" | "critical";

export type Status = "todo" | "in_progress" | "review" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};