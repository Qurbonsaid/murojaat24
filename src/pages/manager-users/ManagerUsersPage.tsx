import { useDeferredValue, useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";

import ManagerSidebar from "@/components/ManagerSidebar";
import UserProfileMenu from "@/components/UserProfileMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveAssetUrl } from "@/lib/api/client";
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
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/api/auth";
import { useCurrentUser } from "@/lib/api/auth";
import type { StaffUser } from "@/lib/api/users";
import { useDeleteUser, useUsers } from "@/lib/api/users";

import ManagerAddUserModal from "./ManagerAddUserModal";
import ManagerEditUserModal from "./ManagerEditUserModal";

type ManagerUserFilter = "all" | "dispatcher" | "specialist";

const MANAGER_MANAGEABLE_ROLES: UserRole[] = ["dispatcher", "specialist"];

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

const isManageableUser = (user: StaffUser) =>
  MANAGER_MANAGEABLE_ROLES.includes(user.role);

const ManagerUsersPage = () => {
  const { toast, dismiss } = useToast();
  const currentUserQuery = useCurrentUser();

  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [userFilter, setUserFilter] = useState<ManagerUserFilter>("all");
  const [searchValue, setSearchValue] = useState("");
  const deferredSearch = useDeferredValue(searchValue.trim());

  const usersQuery = useUsers({
    limit: 100,
    role: userFilter === "all" ? undefined : userFilter,
    search: deferredSearch.length ? deferredSearch : undefined,
  });
  const deleteUser = useDeleteUser();

  const users = useMemo(() => {
    const raw = usersQuery.data?.data ?? [];
    return raw.filter(isManageableUser);
  }, [usersQuery.data?.data]);

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />

      <main className="ml-64 flex-1 p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              Foydalanuvchilarni boshqarish
            </h1>
            <p className="text-muted-foreground">
              Tizim foydalanuvchilari va ularning rollari
            </p>
          </div>
          <UserProfileMenu />
        </div>

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
                setUserFilter(value as ManagerUserFilter)
              }
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="all">Hammasi</TabsTrigger>
                <TabsTrigger value="dispatcher">Dispetcherlar</TabsTrigger>
                <TabsTrigger value="specialist">Mutaxassislar</TabsTrigger>
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
                    const canManage = isManageableUser(user);

                    return (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {user.profile?.avatar && (
                                <AvatarImage
                                  src={resolveAssetUrl(user.profile.avatar)}
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
                            className={cn(
                              status === "active" ? "bg-green-500" : "bg-gray-500",
                            )}
                          >
                            {status === "active"
                              ? "Faol"
                              : status === "busy"
                                ? "Band"
                                : "Faol emas"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.organization &&
                          typeof user.organization === "object" &&
                          "name" in user.organization
                            ? user.organization.name
                            : "Tanlanmagan"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Tahrirlash"
                              disabled={!canManage}
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
                              disabled={
                                !canManage || deleteUser.isPending || isSelf
                              }
                              title={
                                isSelf
                                  ? "O'zingizni o'chira olmaysiz"
                                  : "O'chirish"
                              }
                              onClick={async () => {
                                if (isSelf || !canManage) return;

                                let confirmToastId = "";
                                confirmToastId = toast({
                                  title: "Tasdiqlash",
                                  description: `${fullName} foydalanuvchisini o'chirmoqchimisiz?`,
                                  duration: Number.POSITIVE_INFINITY,
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
      </main>

      <ManagerAddUserModal
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
      />

      <ManagerEditUserModal
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

export default ManagerUsersPage;
