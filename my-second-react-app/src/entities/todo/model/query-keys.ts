export const todoQueryKeys = {
  all: () => ["todos"] as const,
  byId: (id: string | number) => ["todos", id] as const,
};
