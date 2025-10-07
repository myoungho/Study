import { z } from "zod";

// Todo 타입
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
}

// Todo 추가 스키마
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "할 일을 입력해주세요")
    .min(3, "할 일은 최소 3자 이상이어야 합니다")
    .max(100, "할 일은 최대 100자까지 가능합니다"),
  description: z
    .string()
    .max(500, "설명은 최대 500자까지 가능합니다")
    .optional()
    .or(z.literal("")),
});

// Todo 수정 스키마
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "할 일을 입력해주세요")
    .min(3, "할 일은 최소 3자 이상이어야 합니다")
    .max(100, "할 일은 최대 100자까지 가능합니다"),
  description: z
    .string()
    .max(500, "설명은 최대 500자까지 가능합니다")
    .optional()
    .or(z.literal("")),
  completed: z.boolean(),
});

// 타입 추출
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
