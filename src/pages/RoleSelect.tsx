import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, UserCircle, MapPin, BarChart2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import {
  getRoleRedirectPath,
  saveLegacySession,
  useLogin,
} from "@/lib/api/auth";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const roles = [
    {
      id: "operator",
      title: "Call Center Operator",
      description: "Fuqarolardan murojaatlarni qabul qilish",
      icon: UserCircle,
      color: "bg-blue-500",
      route: "/operator-dashboard",
      phone: "+998901234570",
      password: "murojaat24",
    },
    {
      id: "dispatcher",
      title: "Dispatcher",
      description: "Murojaatlarni mutaxassislarga tayinlash",
      icon: MapPin,
      color: "bg-purple-500",
      route: "/dispatcher-dashboard",
      phone: "+998901234569",
      password: "murojaat24",
    },
    {
      id: "specialist",
      title: "Mutaxassis",
      description: "Topshiriqlarni bajarish",
      icon: UserCircle,
      color: "bg-green-500",
      route: "/specialist-mobile",
      phone: "+998901234572",
      password: "murojaat24",
    },
    {
      id: "manager",
      title: "Menjer",
      description: "Bajarilgan ishlarni nazorat qilish",
      icon: BarChart2,
      color: "bg-orange-500",
      route: "/manager-dashboard",
      phone: "+998901234568",
      password: "murojaat24",
    },
    {
      id: "admin",
      title: "Hokimiyat",
      description: "Tizimni boshqarish va sozlash",
      icon: Shield,
      color: "bg-red-500",
      route: "/admin-dashboard",
      phone: "+998901234567",
      password: "murojaat24",
    },
  ];

  const handleRoleSelect = async (role: (typeof roles)[0]) => {
    try {
      const user = await loginMutation.mutateAsync({
        phone: role.phone,
        password: role.password,
      });

      saveLegacySession(user);
      navigate(getRoleRedirectPath(user.role));
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Kirishda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Murojaat24</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Tizimga kirish uchun rolingizni tanlang
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => handleRoleSelect(role)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`${role.color} p-6 rounded-full`}>
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {role.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Demo rejim: Har qanday rolni tanlash mumkin
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;
