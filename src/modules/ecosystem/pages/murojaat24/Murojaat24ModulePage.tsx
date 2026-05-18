import { useDeferredValue, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import AddUserModal from "@/components/AddUserModal";
import EditUserModal from "@/components/EditUserModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastAction } from "@/components/ui/toast";

import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import type { UserRole } from "@/lib/api/auth";
import { useCurrentUser } from "@/lib/api/auth";
import type { StaffUser } from "@/lib/api/users";
import { useDeleteUser, useUsers } from "@/lib/api/users";

import MurojaatlarSection from "./MurojaatlarSection";
import StatistikaSection from "./StatistikaSection";

type Murojaat24Section =
  | "dashboard"
  | "murojaatlar"
  | "statistika"
  | "foydalanuvchilar";

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  operator: "Operator",
  dispatcher: "Dispetcher",
  specialist: "Mutaxassis",
  manager: "Menejer",
};

const getInitials = (firstName?: string, lastName?: string) => {
  const letters = [firstName?.trim()?.[0], lastName?.trim()?.[0]]
    .filter(Boolean)
    .join("");

  return letters || "??";
};

const formatRelativeUz = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return "Hozirgina";

  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} soat oldin`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} kun oldin`;
};

const resolveSection = (pathname: string): Murojaat24Section => {
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  if (normalizedPath.endsWith("/murojaatlar")) {
    return "murojaatlar";
  }

  if (normalizedPath.endsWith("/statistika")) {
    return "statistika";
  }

  if (normalizedPath.endsWith("/foydalanuvchilar")) {
    return "foydalanuvchilar";
  }

  return "dashboard";
};

const Murojaat24ModulePage = () => {
  const location = useLocation();
  const section = resolveSection(location.pathname);

  const { toast, dismiss } = useToast();
  const currentUserQuery = useCurrentUser();

  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [userFilter, setUserFilter] = useState<UserRole | "all">("all");
  const [searchValue, setSearchValue] = useState("");
  const deferredSearch = useDeferredValue(searchValue.trim());

  const usersQuery = useUsers({
    limit: 100,
    role: userFilter === "all" ? undefined : userFilter,
    search: deferredSearch.length ? deferredSearch : undefined,
  });
  const deleteUser = useDeleteUser();

  const users = usersQuery.data?.data ?? [];

  const { sectionTitle, sectionSubtitle } = useMemo(() => {
    switch (section) {
      case "murojaatlar":
        return {
          sectionTitle: "Murojaatlar",
          sectionSubtitle: "Barcha murojaatlar ro'yxati",
        };
      case "statistika":
        return {
          sectionTitle: "Statistika",
          sectionSubtitle: "Murojaatlar statistikasi va tahlili",
        };
      case "foydalanuvchilar":
        return {
          sectionTitle: "Foydalanuvchilarni boshqarish",
          sectionSubtitle: "Tizim foydalanuvchilari va ularning rollari",
        };
      default:
        return {
          sectionTitle: "Hokimiyat Dashboard",
          sectionSubtitle: "Tizimni boshqarish va sozlash",
        };
    }
  }, [section]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{sectionTitle}</h1>
        <p className="text-muted-foreground">{sectionSubtitle}</p>
      </div>

      {section === "dashboard" && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Faol foydalanuvchilar
                    </p>
                    <p className="text-3xl font-bold text-foreground">45</p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Bugungi murojaatlar
                    </p>
                    <p className="text-3xl font-bold text-foreground">145</p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3 text-green-600">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Tizim holati
                    </p>
                    <Badge className="mt-2 bg-green-500 hover:bg-green-600">
                      Yaxshi
                    </Badge>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">
                      Oxirgi yangilanish
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      2 soat oldin
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tizim haqida qisqacha</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Murojaat24 moduli Termiz aqlli shahar ekotizimida fuqarolardan
                kelib tushgan murojaatlarni qabul qilish, taqsimlash va nazorat
                qilish uchun ishlatiladi. Sozlamalar ekotizimning yagona
                "Sozlamalar" bo'limida birlashtirilgan.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {section === "foydalanuvchilar" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
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
                <Input
                  placeholder="Qidirish..."
                  className="pl-10"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </div>
            </div>

            <Tabs
              value={userFilter}
              onValueChange={(value) =>
                setUserFilter(value as UserRole | "all")
              }
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="all">Hammasi</TabsTrigger>
                <TabsTrigger value="operator">Operatorlar</TabsTrigger>
                <TabsTrigger value="dispatcher">Dispetcherlar</TabsTrigger>
                <TabsTrigger value="specialist">Mutaxassislar</TabsTrigger>
                <TabsTrigger value="manager">Menejerlar</TabsTrigger>
              </TabsList>
            </Tabs>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tashkilot</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersQuery.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Yuklanmoqda...
                    </TableCell>
                  </TableRow>
                ) : usersQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-destructive"
                    >
                      {(usersQuery.error as Error).message}
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      Foydalanuvchilar topilmadi
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const fullName =
                      [user.profile?.firstName, user.profile?.lastName]
                        .filter(Boolean)
                        .join(" ") || user.phone;
                    const isSelf =
                      currentUserQuery.data?._id &&
                      currentUserQuery.data._id === user._id;
                    const status = user.status || "active";

                    return (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {user.profile?.avatar && (
                                <AvatarImage
                                  src={user.profile.avatar}
                                  alt={fullName}
                                />
                              )}
                              <AvatarFallback>
                                {getInitials(
                                  user.profile?.firstName,
                                  user.profile?.lastName,
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{roleLabels[user.role]}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              status === "active"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }
                          >
                            {status === "active"
                              ? "Faol"
                              : status === "busy"
                                ? "Band"
                                : "Faol emas"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foregroun">
                          {user.organization
                            ? user.organization["name"]
                            : "Tanlanmagan"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Tahrirlash"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditUserModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={deleteUser.isPending || isSelf}
                              title={
                                isSelf
                                  ? "O'zingizni o'chira olmaysiz"
                                  : "O'chirish"
                              }
                              onClick={async () => {
                                if (isSelf) return;

                                let confirmToastId = "";
                                confirmToastId = toast({
                                  title: "Tasdiqlash",
                                  description: `${fullName} foydalanuvchisini o'chirmoqchimisiz?`,
                                  action: (
                                    <ToastAction
                                      altText="O'chirish"
                                      onClick={async () => {
                                        dismiss(confirmToastId);

                                        try {
                                          await deleteUser.mutateAsync(
                                            user._id,
                                          );
                                          toast({
                                            title: "O'chirildi",
                                            description:
                                              "Foydalanuvchi muvaffaqiyatli o'chirildi",
                                          });
                                        } catch (error) {
                                          const message =
                                            error instanceof ApiError
                                              ? error.message
                                              : "O'chirishda xatolik";
                                          toast({
                                            title: "Xatolik",
                                            description: message,
                                            variant: "destructive",
                                          });
                                        }
                                      }}
                                    >
                                      O'chirish
                                    </ToastAction>
                                  ),
                                }).id;
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {section === "murojaatlar" && <MurojaatlarSection />}

      {section === "statistika" && <StatistikaSection />}

      <AddUserModal
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
      />

      <EditUserModal
        open={editUserModalOpen}
        onOpenChange={(open) => {
          setEditUserModalOpen(open);
          if (!open) setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default Murojaat24ModulePage;
