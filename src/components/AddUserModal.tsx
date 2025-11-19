import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Ism majburiy"),
  email: z.string().email("Noto'g'ri email format"),
  phone: z.string().regex(/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/, "Telefon raqam formati noto'g'ri"),
  role: z.string().min(1, "Rolni tanlang"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
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
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "+998 ",
    },
  });

  const phoneValue = watch("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value.startsWith("998")) {
      value = "998" + value.slice(3);
    }
    value = value.slice(0, 12);
    
    const formatted = value.length > 3 ? 
      `+998 ${value.slice(3, 5)} ${value.slice(5, 8)} ${value.slice(8, 10)} ${value.slice(10, 12)}`.trim() : 
      "+998 ";
    
    setValue("phone", formatted);
  };

  const onSubmit = (data: FormData) => {
    toast({
      title: "Foydalanuvchi qo'shildi",
      description: `${data.name} muvaffaqiyatli qo'shildi`,
    });
    reset({ phone: "+998 " });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yangi foydalanuvchi qo'shish</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@murojaat24.uz"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
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
            <Label htmlFor="role">Rol *</Label>
            <Select onValueChange={(value) => setValue("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Rolni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operator">Call Center Operator</SelectItem>
                <SelectItem value="dispatcher">Dispatcher</SelectItem>
                <SelectItem value="specialist">Mutaxassis</SelectItem>
                <SelectItem value="manager">Menjer</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
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
              <p className="text-sm text-destructive">{errors.password.message}</p>
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
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({ phone: "+998 " });
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Bekor qilish
            </Button>
            <Button type="submit" className="flex-1">
              Saqlash
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
