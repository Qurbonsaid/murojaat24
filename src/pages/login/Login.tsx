import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { getRoleRedirectPath, useCurrentUser, useLogin } from "@/lib/api/auth";
import { MobileQRCode } from "@/components/specialist/MobileQRCode";
import { shouldBypassSpecialistInstallWall } from "@/lib/pwa";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const currentUserQuery = useCurrentUser();
  const currentUser = currentUserQuery.data;

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const bypassSpecialistWall =
      currentUser.role === "specialist" && shouldBypassSpecialistInstallWall();

    if (currentUser.role !== "specialist" || bypassSpecialistWall) {
      navigate(getRoleRedirectPath(currentUser.role), {
        replace: true,
      });
    }
  }, [currentUser, navigate]);

  const renderSplashScreen = (message: string) => (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Murojaat24</h1>
        <p className="mt-2 text-sm text-slate-200">{message}</p>
        <div
          className="mt-6 flex items-center justify-center gap-2"
          aria-label="Loading"
        >
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/80" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/80 [animation-delay:150ms]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/80 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );

  const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const normalized = digits.startsWith("998") ? digits.slice(3) : digits;
    return normalized ? `+998${normalized}` : "";
  };

  const formatPhoneInput = (value: string) => {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("998")) {
      digits = digits.slice(3);
    }
    if (digits.length > 9) {
      digits = digits.slice(0, 9);
    }

    if (!digits) return "";
    const parts = [
      digits.slice(0, 2),
      digits.slice(2, 5),
      digits.slice(5, 7),
      digits.slice(7, 9),
    ].filter(Boolean);
    return `+998 ${parts.join(" ")}`.trim();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const normalizedPhone = normalizePhone(phone);
      const user = await loginMutation.mutateAsync({
        phone: normalizedPhone,
        password,
      });

      if (
        user.role !== "specialist" ||
        shouldBypassSpecialistInstallWall()
      ) {
        if (user.role !== "specialist") {
          toast({
            title: "Muvaffaqiyatli kirish",
            description: "Tizimga muvaffaqiyatli kirdingiz",
          });
        }

        navigate(getRoleRedirectPath(user.role));
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Telefon raqam yoki parol noto'g'ri";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (currentUserQuery.isLoading || currentUserQuery.isFetching) {
    return renderSplashScreen("Sessiya tekshirilmoqda...");
  }

  if (
    currentUser?.role === "specialist" &&
    !shouldBypassSpecialistInstallWall()
  ) {
    return <MobileQRCode />;
  }

  if (currentUser?.role === "specialist") {
    return renderSplashScreen("Siz tizimga yo'naltirilmoqdasiz...");
  }

  if (currentUser) {
    return renderSplashScreen("Siz tizimga yo'naltirilmoqdasiz...");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Murojaat24
            </h1>
            <CardTitle className="text-xl">Tizimga kirish</CardTitle>
            <CardDescription>Xodimlar uchun kirish</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon raqam</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Kuting..." : "Kirish"}
            </Button>
          </form>
          <div className="mt-6 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
            <p className="font-medium mb-1">Demo hisoblar:</p>
            <div className="space-y-0.5">
              <p>Operator: +998 90 123 45 70</p>
              <p>Dispetcher: +998 90 123 45 69</p>
              <p>Mutaxassis: +998 90 123 45 72</p>
              <p>Menejer: +998 90 123 45 68</p>
              <p>Hokimiyat: +998 90 123 45 67</p>
            </div>
            <p className="mt-2">Parol: murojaat24</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
