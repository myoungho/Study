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
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "6자 이상 입력하세요"),
});

type FormValues = z.infer<typeof schema>;

export function SignInPage() {
  const signIn = useAuthStore((state) => state.signIn);
  const status = useAuthStore((state) => state.status);
  const navigate = useNavigate({ from: "/auth/sign-in" });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    await signIn(values);
    navigate({ to: "/" });
  };

  return (
    <PageContainer className="max-w-xl">
      <PageHeader className="space-y-3">
        <PageTitle>팀 워크스페이스에 로그인</PageTitle>
        <PageSubtitle className="text-muted">
          ASP.NET Core API와 연동하기 전에, 프론트엔드만으로 로그인 경험을 설계해봅니다.
        </PageSubtitle>
      </PageHeader>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="surface-card flex flex-col gap-4 rounded-2xl border border-surface p-6"
      >
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
          {status === "loading" ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </PageContainer>
  );
}
