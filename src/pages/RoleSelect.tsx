import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, UserCircle, MapPin, BarChart2, Shield } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "operator",
      title: "Call Center Operator",
      description: "Fuqarolardan murojaatlarni qabul qilish",
      icon: UserCircle,
      color: "bg-blue-500",
      route: "/operator-dashboard",
      sessionKey: "operator_session",
      userData: { name: "Sardor Karimov", role: "Operator" }
    },
    {
      id: "dispatcher",
      title: "Dispatcher",
      description: "Murojaatlarni mutaxassislarga tayinlash",
      icon: MapPin,
      color: "bg-purple-500",
      route: "/dispatcher-dashboard",
      sessionKey: "dispatcher_session",
      userData: { name: "Dilshod Mirzayev", role: "Dispatcher" }
    },
    {
      id: "specialist",
      title: "Mutaxassis",
      description: "Topshiriqlarni bajarish",
      icon: UserCircle,
      color: "bg-green-500",
      route: "/specialist-mobile",
      sessionKey: "specialist_session",
      userData: { name: "Akmal Rahimov", role: "Mutaxassis" }
    },
    {
      id: "manager",
      title: "Menjer",
      description: "Bajarilgan ishlarni nazorat qilish",
      icon: BarChart2,
      color: "bg-orange-500",
      route: "/manager-dashboard",
      sessionKey: "manager_session",
      userData: { name: "Gulnora Saidova", role: "Menjer" }
    },
    {
      id: "admin",
      title: "Hokimiyat",
      description: "Tizimni boshqarish va sozlash",
      icon: Shield,
      color: "bg-red-500",
      route: "/admin-dashboard",
      sessionKey: "operator_session",
      userData: { name: "Admin User", role: "Hokimiyat" }
    },
  ];

  const handleRoleSelect = (role: typeof roles[0]) => {
    localStorage.setItem(role.sessionKey, JSON.stringify(role.userData));
    navigate(role.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Murojaat24</h1>
          </div>
          <p className="text-xl text-muted-foreground">Tizimga kirish uchun rolingizni tanlang</p>
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
