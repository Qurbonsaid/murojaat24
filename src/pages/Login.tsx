import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (email === "operator@murojaat24.uz" && password === "demo123") {
        localStorage.setItem("operator_session", JSON.stringify({
          name: "Sardor Karimov",
          role: "Operator",
          email: email
        }));
        toast({
          title: "Muvaffaqiyatli kirish",
          description: "Xush kelibsiz, Sardor Karimov",
        });
        navigate("/operator-dashboard");
      } else {
        toast({
          title: "Xatolik",
          description: "Email yoki parol noto'g'ri",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

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
            <h1 className="text-2xl font-bold text-foreground mb-1">Murojaat24</h1>
            <CardTitle className="text-xl">Tizimga kirish</CardTitle>
            <CardDescription>Call Center Operator</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email manzil</Label>
              <Input
                id="email"
                type="email"
                placeholder="operator@murojaat24.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Kuting..." : "Kirish"}
            </Button>
          </form>
          <div className="mt-6 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
            <p className="font-medium mb-1">Demo ma'lumotlar:</p>
            <p>Email: operator@murojaat24.uz</p>
            <p>Parol: demo123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
