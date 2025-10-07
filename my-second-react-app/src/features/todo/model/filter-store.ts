import { create } from "zustand";
import type { TodoStatus } from "@/entities/todo/model/types";

interface TodoFilterState {
  status: TodoStatus;
  search: string;
  setStatus: (status: TodoStatus) => void;
  setSearch: (value: string) => void;
  reset: () => void;
}

export const useTodoFilterStore = create<TodoFilterState>((set) => ({
  status: "all",
  search: "",
  setStatus: (status) => set({ status }),
  setSearch: (search) => set({ search }),
  reset: () => set({ status: "all", search: "" }),
}));
