import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AddUserModal from "@/components/AddUserModal";
import { Users, FileText, CheckCircle, Clock, Search, Plus, Edit, Trash2 } from "lucide-react";
import OperatorSidebar from "@/components/OperatorSidebar";
import { organizations } from "@/lib/organizations";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [userFilter, setUserFilter] = useState("all");

  useEffect(() => {
    const session = localStorage.getItem("operator_session");
    if (!session) {
      navigate("/login");
    }
  }, [navigate]);

  const users = [
    {
      id: 1,
      name: "Sardor Karimov",
      email: "sardor@murojaat24.uz",
      role: "Operator",
      status: "active",
      lastActive: "5 daqiqa oldin",
    },
    {
      id: 2,
      name: "Dilshod Mirzayev",
      email: "dilshod@murojaat24.uz",
      role: "Dispatcher",
      status: "active",
      lastActive: "10 daqiqa oldin",
    },
    {
      id: 3,
      name: "Akmal Rahimov",
      email: "akmal@murojaat24.uz",
      role: "Mutaxassis",
      status: "active",
      lastActive: "2 soat oldin",
    },
    {
      id: 4,
      name: "Gulnora Saidova",
      email: "gulnora@murojaat24.uz",
      role: "Menjer",
      status: "active",
      lastActive: "1 soat oldin",
    },
    {
      id: 5,
      name: "Bobur Toshmatov",
      email: "bobur@murojaat24.uz",
      role: "Mutaxassis",
      status: "inactive",
      lastActive: "2 kun oldin",
    },
    {
      id: 6,
      name: "Davron Yusupov",
      email: "davron@murojaat24.uz",
      role: "Mutaxassis",
      status: "active",
      lastActive: "30 daqiqa oldin",
    },
    {
      id: 7,
      name: "Malika Ergasheva",
      email: "malika@murojaat24.uz",
      role: "Operator",
      status: "active",
      lastActive: "15 daqiqa oldin",
    },
    {
      id: 8,
      name: "Eldor Karimov",
      email: "eldor@murojaat24.uz",
      role: "Mutaxassis",
      status: "active",
      lastActive: "1 soat oldin",
    },
  ];

  const [searchOrg, setSearchOrg] = useState("");
  
  const filteredOrganizations = organizations.filter(org => 
    org.toLowerCase().includes(searchOrg.toLowerCase())
  );

  const smsTemplates = [
    { id: 1, name: "Qabul qilindi", content: "Hurmatli {name}, murojaatingiz qabul qilindi. Raqam: {number}" },
    { id: 2, name: "Tayinlandi", content: "Murojaatingiz {specialist}ga tayinlandi. Tel: {phone}" },
    { id: 3, name: "Bajarildi", content: "Murojaatingiz bajarildi. Fikr-mulohazalaringizni bildiring." },
  ];

  const filteredUsers = userFilter === "all" 
    ? users 
    : users.filter(user => user.role.toLowerCase() === userFilter);

  return (
    <div className="flex min-h-screen bg-background">
      <OperatorSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Administrator Dashboard</h1>
          <p className="text-muted-foreground">Tizimni boshqarish va sozlash</p>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Faol foydalanuvchilar</p>
                  <p className="text-3xl font-bold text-foreground">45</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bugungi murojaatlar</p>
                  <p className="text-3xl font-bold text-foreground">145</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tizim holati</p>
                  <Badge className="bg-green-500 hover:bg-green-600 mt-2">Yaxshi</Badge>
                </div>
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Oxirgi yangilanish</p>
                  <p className="text-lg font-semibold text-foreground mt-1">2 soat oldin</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Foydalanuvchilarni boshqarish</CardTitle>
              <Button onClick={() => setAddUserModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Yangi foydalanuvchi
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Qidirish..." className="pl-10" />
              </div>
            </div>

            <Tabs value={userFilter} onValueChange={setUserFilter} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">Hammasi</TabsTrigger>
                <TabsTrigger value="operator">Operatorlar</TabsTrigger>
                <TabsTrigger value="dispatcher">Dispetcherlar</TabsTrigger>
                <TabsTrigger value="mutaxassis">Mutaxassislar</TabsTrigger>
                <TabsTrigger value="menjer">Menejerlar</TabsTrigger>
              </TabsList>
            </Tabs>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Oxirgi faoliyat</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge className={user.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                        {user.status === "active" ? "Faol" : "Faol emas"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Tizim sozlamalari</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="types">
              <TabsList className="mb-6">
                <TabsTrigger value="types">Tashkilotlar</TabsTrigger>
                <TabsTrigger value="templates">Bildirishnoma shablonlari</TabsTrigger>
                <TabsTrigger value="general">Umumiy sozlamalar</TabsTrigger>
              </TabsList>

              <TabsContent value="types" className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Tashkilot qidirish..." 
                      className="pl-10"
                      value={searchOrg}
                      onChange={(e) => setSearchOrg(e.target.value)}
                    />
                  </div>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi tashkilot
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredOrganizations.map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                      <span className="font-medium text-sm">{org}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                {smsTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{template.name}</h4>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.content}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="general" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email xabarnomalar</Label>
                      <p className="text-sm text-muted-foreground">Fuqarolarga email yuborish</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS xabarnomalar</Label>
                      <p className="text-sm text-muted-foreground">Fuqarolarga SMS yuborish</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Maksimal rasm hajmi (MB)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>

                  <div className="space-y-2">
                    <Label>Javob kutish vaqti (daqiqa)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>

                  <Button>Saqlash</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <AddUserModal open={addUserModalOpen} onOpenChange={setAddUserModalOpen} />
    </div>
  );
};

export default AdminDashboard;
