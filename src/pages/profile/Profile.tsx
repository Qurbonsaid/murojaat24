import { type ChangeEvent, useEffect, useMemo, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Camera, ImageUp, Save, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import DispatcherSidebar from "@/components/DispatcherSidebar";
import ManagerSidebar from "@/components/ManagerSidebar";
import OperatorSidebar from "@/components/OperatorSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";
import {
  getRoleRedirectPath,
  type CurrentUser,
  type UserRole,
  useCurrentUser,
  useUpdateProfile,
} from "@/lib/api/auth";
import { resolveOrganizationName } from "@/lib/api/requests";
import { useOrganizations } from "@/lib/api/organizations";
import { useUploadAvatar } from "@/lib/api/uploads";

const ROLES_WITH_ORGANIZATION: UserRole[] = [
  "dispatcher",
  "manager",
  "specialist",
];

const roleLabels: Record<UserRole, string> = {
  admin: "Hokimiyat",
  operator: "Operator",
  dispatcher: "Dispetcher",
  specialist: "Mutaxassis",
  manager: "Menejer",
};

const formSchema = z.object({
  firstName: z
    .string()
    .refine((value) => value.trim().length >= 2, {
      message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
    })
    .refine((value) => value.trim().length <= 50, {
      message: "Ism 50 ta belgidan oshmasligi kerak",
    }),
  lastName: z
    .string()
    .refine((value) => value.trim().length >= 2, {
      message: "Familiya kamida 2 ta belgidan iborat bo'lishi kerak",
    })
    .refine((value) => value.trim().length <= 50, {
      message: "Familiya 50 ta belgidan oshmasligi kerak",
    }),
  avatar: z.string().nullable().optional(),
});

type ProfileFormData = z.infer<typeof formSchema>;

type ProfileProps = {
  embedded?: boolean;
};

const getProfileDefaults = (user: CurrentUser): ProfileFormData => ({
  firstName: user.profile?.firstName ?? "",
  lastName: user.profile?.lastName ?? "",
  avatar: user.profile?.avatar?.trim()
    ? (resolveAssetUrl(user.profile.avatar.trim()) ?? null)
    : null,
});

const getInitials = (firstName?: string, lastName?: string) => {
  const initials = [firstName?.trim()?.[0], lastName?.trim()?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return initials || "FP";
};

const Profile = ({ embedded = false }: ProfileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const currentUserQuery = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const user = currentUserQuery.data;
  const showOrganization =
    user != null && ROLES_WITH_ORGANIZATION.includes(user.role);
  const organizationsQuery = useOrganizations();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatar: null,
    },
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const avatar = watch("avatar");

  useEffect(() => {
    if (!user) return;
    reset(getProfileDefaults(user));
  }, [reset, user?._id, user?.profile, user?.phone]);

  const dashboardPath = user ? getRoleRedirectPath(user.role) : "/";
  const roleLabel = user ? roleLabels[user.role] : "";
  const displayName = useMemo(() => {
    const name = [firstName, lastName]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(" ");

    return name || user?.phone || "Foydalanuvchi";
  }, [firstName, lastName, user?.phone]);
  const initials = getInitials(firstName, lastName);

  const organizationNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const org of organizationsQuery.data ?? []) {
      map.set(org._id, org.name);
    }
    return map;
  }, [organizationsQuery.data]);

  const organizationLabel = useMemo(() => {
    if (!user?.organization) return "—";
    return resolveOrganizationName(user.organization, organizationNameById);
  }, [organizationNameById, user?.organization]);

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAvatarSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Xatolik",
        description: "Faqat JPG yoki PNG rasmlarini yuklash mumkin",
        variant: "destructive",
      });
      clearFileInput();
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Xatolik",
        description: "Rasm hajmi 5MB dan oshmasligi kerak",
        variant: "destructive",
      });
      clearFileInput();
      return;
    }

    try {
      const { url } = await uploadAvatar.mutateAsync(file);
      setValue("avatar", url, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Rasmni yuklashda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    } finally {
      clearFileInput();
    }
  };

  const handleRemoveAvatar = () => {
    setValue("avatar", null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearFileInput();
  };

  const handleReset = () => {
    if (!user) return;
    reset(getProfileDefaults(user));
    clearFileInput();
  };

  const onSubmit = async (data: ProfileFormData) => {
    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      avatar: data.avatar?.trim()
        ? (resolveAssetUrl(data.avatar.trim()) ?? null)
        : null,
    };

    try {
      await updateProfile.mutateAsync(payload);
      reset(payload);
      toast({
        title: "Saqlandi",
        description: "Profil ma'lumotlari yangilandi",
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Profilni yangilashda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (currentUserQuery.isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-5xl px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (user.role === "admin" && !embedded) {
    return <Navigate to="/ecosystem/profile" replace />;
  }

  const isPending = updateProfile.isPending;
  const isUploading = uploadAvatar.isPending;
  const isAvatarBusy = isPending || isUploading;

  const content = (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Profil</h1>
          <p className="text-sm text-slate-500">{roleLabel}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={dashboardPath}>
            <ArrowLeft className="h-4 w-4" />
            Panelga qaytish
          </Link>
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]"
        autoComplete="off"
      >
        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">Avatar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <div className="relative">
              <Avatar className="h-28 w-28 border border-slate-200">
                {avatar ? (
                  <AvatarImage
                    src={resolveAssetUrl(avatar)}
                    alt={displayName}
                  />
                ) : null}
                <AvatarFallback className="bg-[#0d4c8b] text-3xl font-semibold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 h-9 w-9 rounded-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAvatarBusy}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Rasm tanlash</span>
              </Button>
            </div>

            <div className="w-full space-y-3 text-center">
              <div>
                <p className="font-medium text-slate-950">{displayName}</p>
                <p className="text-sm text-slate-500">{user.phone}</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleAvatarSelect}
              />

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAvatarBusy}
                >
                  <ImageUp className="h-4 w-4" />
                  {isUploading ? "Yuklanmoqda..." : "Rasm tanlash"}
                </Button>
                {avatar ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={handleRemoveAvatar}
                    disabled={isAvatarBusy}
                  >
                    <Trash2 className="h-4 w-4" />
                    Olib tashlash
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">Shaxsiy ma'lumotlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ism</Label>
                <Input
                  id="firstName"
                  autoComplete="given-name"
                  {...register("firstName")}
                />
                {errors.firstName ? (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Familiya</Label>
                <Input
                  id="lastName"
                  autoComplete="family-name"
                  {...register("lastName")}
                />
                {errors.lastName ? (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon raqami</Label>
                <Input id="phone" value={user.phone} disabled readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Input id="role" value={roleLabel} disabled readOnly />
              </div>

              {showOrganization ? (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="organization">Tashkilot</Label>
                  <Input
                    id="organization"
                    value={organizationLabel}
                    disabled
                    readOnly
                  />
                </div>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!isDirty || isPending}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={!isDirty || isAvatarBusy}>
              <Save className="h-4 w-4" />
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );

  if (embedded) {
    return content;
  }

  if (user.role === "operator") {
    return (
      <div className="flex min-h-screen bg-background">
        <OperatorSidebar />
        <main className="ml-64 flex-1 p-8">{content}</main>
      </div>
    );
  }

  if (user.role === "dispatcher") {
    return (
      <div className="flex min-h-screen bg-background">
        <DispatcherSidebar />
        <main className="ml-64 flex-1 p-6">{content}</main>
      </div>
    );
  }

  if (user.role === "manager") {
    return (
      <div className="flex min-h-screen bg-background">
        <ManagerSidebar />
        <main className="ml-64 flex-1 p-8">{content}</main>
      </div>
    );
  }

  return <div className="min-h-screen bg-background px-4 py-6">{content}</div>;
};

export default Profile;
