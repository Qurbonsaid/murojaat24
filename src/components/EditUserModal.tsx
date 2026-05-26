import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import type { StaffUser } from "@/lib/api/users";
import { useResetUserPassword, useUpdateUser } from "@/lib/api/users";

const formSchema = z
  .object({
    phone: z.string().optional(),
    firstName: z
      .string()
      .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
    lastName: z
      .string()
      .min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
    role: z.enum(["operator", "dispatcher", "specialist", "manager", "admin"]),
    organization: z.string().optional(),
    quarter: z.string().optional(),
    sector: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.newPassword) return true;
      return data.newPassword.length >= 6;
    },
    {
      message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (!data.newPassword && !data.confirmPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      message: "Parollar mos kelmayapti",
      path: ["confirmPassword"],
    },
  );

type FormData = z.infer<typeof formSchema>;

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: StaffUser | null;
}

const resolveOrganizationId = (organization: StaffUser["organization"]) => {
  if (!organization) return "none";
  if (typeof organization === "string") return organization;
  if (typeof organization === "object" && "_id" in organization) {
    return String(organization._id);
  }
  return "none";
};

const EditUserModal = ({ open, onOpenChange, user }: EditUserModalProps) => {
  const { toast } = useToast();
  const organizationsQuery = useOrganizations();
  const updateUser = useUpdateUser();
  const resetPassword = useResetUserPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organization: "none",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const organizationValue = watch("organization");

  useEffect(() => {
    if (!open) return;

    reset({
      phone: user?.phone ?? "",
      firstName: user?.profile?.firstName ?? "",
      lastName: user?.profile?.lastName ?? "",
      role: (user?.role as FormData["role"]) ?? "operator",
      organization: resolveOrganizationId(user?.organization) ?? "none",
      quarter: user?.quarter ?? "",
      sector: user?.sector ?? "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [open, reset, user]);

  const onSubmit = async (data: FormData) => {
    if (!user?._id) return;

    const organization =
      data.organization && data.organization !== "none"
        ? data.organization
        : "";

    const quarterValue = data.quarter?.trim() || "";
    const sectorValue = data.sector?.trim() || "";
    const hadQuarter =
      typeof user.quarter === "string" && user.quarter.trim().length > 0;
    const hadSector =
      typeof user.sector === "string" && user.sector.trim().length > 0;

    try {
      const updatePayload = {
        id: user._id,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        role: data.role,
        organization,
        ...(quarterValue
          ? { quarter: quarterValue }
          : hadQuarter
            ? { quarter: "" }
            : {}),
        ...(sectorValue
          ? { sector: sectorValue }
          : hadSector
            ? { sector: "" }
            : {}),
      };

      await updateUser.mutateAsync(updatePayload);

      if (data.newPassword) {
        await resetPassword.mutateAsync({
          id: user._id,
          newPassword: data.newPassword,
        });
      }

      toast({
        title: "Saqlandi",
        description: "Foydalanuvchi ma'lumotlari yangilandi",
      });
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Foydalanuvchini yangilashda xatolik";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  const isPending = updateUser.isPending || resetPassword.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          reset({
            organization: "none",
            newPassword: "",
            confirmPassword: "",
          });
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-lg overflow-y-scroll max-h-full">
        <DialogHeader>
          <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <div className="space-y-2">
            <Label htmlFor="firstName">Ism *</Label>
            <Input
              id="firstName"
              placeholder="Masalan: Akmal"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Familiya *</Label>
            <Input
              id="lastName"
              placeholder="Masalan: Rahimov"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select
              value={watch("role")}
              onValueChange={(value) =>
                setValue("role", value as FormData["role"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rolni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operator">Call Center Operator</SelectItem>
                <SelectItem value="dispatcher">Dispetcher</SelectItem>
                <SelectItem value="specialist">Mutaxassis</SelectItem>
                <SelectItem value="manager">Menejer</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Tashkilotni tanlang</Label>
            <Select
              value={organizationValue || "none"}
              onValueChange={(value) =>
                setValue("organization", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tashkilotni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tanlanmagan</SelectItem>
                {(organizationsQuery.data || []).map((org) => (
                  <SelectItem key={org._id} value={org._id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quarter">Mahalla</Label>
            <Input
              id="quarter"
              placeholder="Masalan: Nurafshon (ixtiyoriy)"
              {...register("quarter")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Sektor</Label>
            <Input
              id="sector"
              placeholder="Masalan: 3-sektor (ixtiyoriy)"
              {...register("sector")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqami</Label>
            <Input
              id="phone"
              disabled={user?.role === "admin"}
              {...register("phone")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Yangi parol (ixtiyoriy)</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Parolni tasdiqlash (ixtiyoriy)
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isPending}
            >
              Bekor qilish
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
