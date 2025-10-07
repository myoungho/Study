export interface TodoEntity {
  userId?: number;
  id: number;
  title: string;
  completed: boolean;
  description?: string;
}

export type TodoStatus = "all" | "completed" | "pending";
