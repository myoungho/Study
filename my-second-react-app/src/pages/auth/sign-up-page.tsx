import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { Button } from "@/shared/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { PageContainer, PageHeader, PageSubtitle, PageTitle } from "@/shared/ui/layout";

const schema = z.object({
  name: z.string().min(2, "이름은 2자 이상 입력하세요"),
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "6자 이상 입력하세요"),
});

type FormValues = z.infer<typeof schema>;

export function SignUpPage() {
  const signUp = useAuthStore((state) => state.signUp);
  const status = useAuthStore((state) => state.status);
  const navigate = useNavigate({ from: "/auth/sign-up" });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    await signUp(values);
    navigate({ to: "/" });
  };

  return (
    <PageContainer className="max-w-xl">
      <PageHeader className="space-y-3">
        <PageTitle>새로운 계정 만들기</PageTitle>
        <PageSubtitle className="text-muted">
          팀에 합류하여 업무를 효율적으로 관리해보세요.
        </PageSubtitle>
      </PageHeader>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="surface-card flex flex-col gap-4 rounded-2xl border border-surface p-6"
      >
        <FormField>
          <FormLabel htmlFor="name">이름</FormLabel>
          <FormControl>
            <FormItem>
              <Input id="name" type="text" placeholder="홍길동" {...form.register("name")} />
              <FormMessage error={form.formState.errors.name} />
            </FormItem>
          </FormControl>
        </FormField>

        <FormField>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <FormControl>
            <FormItem>
              <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
              <FormMessage error={form.formState.errors.email} />
            </FormItem>
          </FormControl>
        </FormField>

        <FormField>
          <FormLabel htmlFor="password">비밀번호</FormLabel>
          <FormControl>
            <FormItem>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...form.register("password")}
              />
              <FormMessage error={form.formState.errors.password} />
            </FormItem>
          </FormControl>
        </FormField>

        <Button type="submit" disabled={status === "loading"} className="mt-2 w-full">
          {status === "loading" ? "가입 중..." : "회원가입"}
        </Button>
      </form>
    </PageContainer>
  );
}
