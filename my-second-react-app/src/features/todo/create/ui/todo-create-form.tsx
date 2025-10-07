import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTodoMutation } from "@/entities/todo/model/hooks";
import { Button } from "@/shared/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";

const schema = z.object({
  title: z.string().min(3, "세 글자 이상 입력하세요"),
});

type FormValues = z.infer<typeof schema>;

export function TodoCreateForm() {
  const mutation = useCreateTodoMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  });

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync(values);
    form.reset();
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="surface-card flex flex-col gap-4 rounded-2xl border border-surface p-4"
    >
      <FormField>
        <FormLabel htmlFor="title">새로운 업무</FormLabel>
        <FormControl>
          <FormItem>
            <Input
              className="input-surface"
              id="title"
              placeholder="다음으로 해결할 업무는?"
              {...form.register("title")}
            />
            <FormMessage error={form.formState.errors.title} />
          </FormItem>
        </FormControl>
      </FormField>
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "추가 중..." : "업무 추가"}
        </Button>
      </div>
    </form>
  );
}
