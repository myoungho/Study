export const todoQueryKeys = {
  all: ["todos"] as const,
  lists: () => [...todoQueryKeys.all, "list"] as const,
  list: (filters: string) => [...todoQueryKeys.lists(), { filters }] as const,
  details: () => [...todoQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...todoQueryKeys.details(), id] as const,
};
