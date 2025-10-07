import { useTodoFilterStore } from "@/features/todo/model/filter-store";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PageSubtitle } from "@/shared/ui/layout";

const filters = [
  { value: "all", label: "전체" },
  { value: "pending", label: "진행중" },
  { value: "completed", label: "완료" },
] as const;

export function TodoFilter() {
  const status = useTodoFilterStore((state) => state.status);
  const setStatus = useTodoFilterStore((state) => state.setStatus);
  const search = useTodoFilterStore((state) => state.search);
  const setSearch = useTodoFilterStore((state) => state.setSearch);

  return (
    <div className="surface-card flex flex-col gap-4 rounded-2xl border border-surface p-4">
      <div className="flex flex-col gap-1">
        <PageSubtitle className="text-sm font-semibold text-subtle">
          빠르게 찾고 상태를 전환하세요
        </PageSubtitle>
        <Input
          className="input-surface"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="업무 검색"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            type="button"
            variant={status === filter.value ? "primary" : "outline"}
            size="sm"
            onClick={() => setStatus(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
