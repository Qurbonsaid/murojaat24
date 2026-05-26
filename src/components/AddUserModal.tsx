import type { ChangeEvent } from "react";

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
import { useCreateUser } from "@/lib/api/users";
import { useOrganizations } from "@/lib/api/organizations";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, "Ism majburiy")
      .refine((value) => value.trim().split(/\s+/).length >= 2, {
        message: "Ism va familiyani kiriting",
      }),
    phone: z
      .string()
      .regex(
        /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/,
        "Telefon raqam formati noto'g'ri",
      ),
    role: z.enum(["operator", "dispatcher", "specialist", "manager"], {
      required_error: "Rolni tanlang",
    }),
    organization: z.string().optional(),
    quarter: z.string().optional(),
    sector: z.string().optional(),
    password: z
      .string()
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmayapti",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserModal = ({ open, onOpenChange }: AddUserModalProps) => {
  const { toast } = useToast();
  const createUser = useCreateUser();
  const organizationsQuery = useOrganizations();
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
      phone: "+998 ",
      organization: "none",
      quarter: "",
      sector: "",
    },
  });

  const phoneValue = watch("phone");
  const organizationValue = watch("organization");

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("998")) {
      value = "998" + value.slice(3);
    }
    value = value.slice(0, 12);

    const formatted =
      value.length > 3
        ? `+998 ${value.slice(3, 5)} ${value.slice(5, 8)} ${value.slice(8, 10)} ${value.slice(10, 12)}`.trim()
        : "+998 ";

    setValue("phone", formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    const [firstName, ...lastNameParts] = data.name.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ");
    const normalizedPhone = data.phone.replace(/\s+/g, "");

    try {
      await createUser.mutateAsync({
        phone: normalizedPhone,
        password: data.password,
        firstName,
        lastName,
        role: data.role,
        ...(data.organization && data.organization !== "none"
          ? { organization: data.organization }
          : {}),
        ...(data.quarter?.trim() ? { quarter: data.quarter.trim() } : {}),
        ...(data.sector?.trim() ? { sector: data.sector.trim() } : {}),
      });

      toast({
        title: "Foydalanuvchi qo'shildi",
        description: `${data.name} muvaffaqiyatli qo'shildi`,
      });
      reset({ phone: "+998 ", organization: "none", quarter: "", sector: "" });
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Foydalanuvchini qo'shishda xatolik";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-y-scroll max-h-full">
        <DialogHeader>
          <DialogTitle>Yangi foydalanuvchi qo'shish</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Ism-familiya *</Label>
            <Input
              id="name"
              placeholder="Masalan: Akmal Rahimov"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqami *</Label>
            <Input
              id="phone"
              value={phoneValue}
              onChange={handlePhoneChange}
              placeholder="+998 90 123 45 67"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Parol *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Kamida 6 ta belgi"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Parolni tasdiqlash *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Parolni qaytaring"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol *</Label>
            <Select
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
                <SelectValue placeholder="Tashkilotni tanlang... (ixtiyoriy)" />
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

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({
                  phone: "+998 ",
                  organization: "none",
                  quarter: "",
                  sector: "",
                });
                onOpenChange(false);
              }}
              className="flex-1"
              disabled={createUser.isPending}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
