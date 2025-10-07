import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export interface Todo {
  userId?: number;
  id: number;
  title: string;
  completed: boolean;
}

// 모든 할 일 가져오기
export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${BASE_URL}/todos`);
  return response.data;
};

// 할 일 추가
export const createTodo = async (title: string): Promise<Todo> => {
  const response = await axios.post(`${BASE_URL}/todos`, {
    title,
    completed: false,
    userId: 1,
  });
  return response.data;
};

// 할 일 완료 상태 변경
export const updateTodo = async (
  id: number,
  completed: boolean
): Promise<Todo> => {
  const response = await axios.patch(`${BASE_URL}/todos/${id}`, {
    completed,
  });
  return response.data;
};

// 할 일 삭제
export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/todos/${id}`);
};
