import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import {
  toOperatorCreatePayload,
  useCreateOperatorRequest,
} from "@/lib/api/requests";
import { formatPhoneInput } from "@/lib/phone";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z
    .string()
    .regex(
      /^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/,
      "Telefon raqam formati noto'g'ri",
    ),
  organizationId: z.string().min(1, "Tashkilotni tanlang"),
  description: z
    .string()
    .min(20, "Kamida 20 ta belgi kiriting")
    .max(1000, "Tavsif 1000 ta belgidan oshmasligi kerak"),
  address: z.string().min(1, "Manzil majburiy"),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const defaultFormValues: FormData = {
  fullName: "",
  phone: "+998 ",
  organizationId: "",
  description: "",
  address: "",
  additionalInfo: "",
};

const OperatorNewAppeal = () => {
  const { toast } = useToast();
  const [openOrg, setOpenOrg] = useState(false);
  const fullNameRef = useRef<HTMLInputElement | null>(null);

  const organizationsQuery = useOrganizations();
  const createRequest = useCreateOperatorRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const phoneValue = watch("phone");
  const organizationId = watch("organizationId");
  const organizations = organizationsQuery.data ?? [];

  const selectedOrganization = organizations.find(
    (org) => org._id === organizationId,
  );

  const { ref: fullNameRegisterRef, ...fullNameRegister } =
    register("fullName");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setValue("phone", formatted || "+998 ", { shouldValidate: true });
  };

  const resetForm = () => {
    reset(defaultFormValues);
    setOpenOrg(false);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const created = await createRequest.mutateAsync(
        toOperatorCreatePayload({
          fullName: data.fullName,
          phone: data.phone,
          organizationId: data.organizationId,
          description: data.description,
          address: data.address,
        }),
      );

      toast({
        title: "Murojaat yaratildi",
        description: `Yangi murojaat raqami: ${created.requestNumber}`,
      });
      resetForm();
      fullNameRef.current?.focus();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Murojaatni saqlashda xatolik yuz berdi";

      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  const orgComboboxDisabled =
    organizationsQuery.isLoading || organizationsQuery.isError;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Yangi murojaat
        </h1>
        <p className="text-muted-foreground">
          Fuqaro murojaatini qabul qilish va ro&apos;yxatga olish
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yangi murojaat yaratish</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Fuqaro ismi *</Label>
                <Input
                  id="fullName"
                  placeholder="Ism familiyangizni kiriting"
                  {...fullNameRegister}
                  ref={(el) => {
                    fullNameRegisterRef(el);
                    fullNameRef.current = el;
                  }}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
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
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationId">Tashkilotni tanlang *</Label>
              <Popover open={openOrg} onOpenChange={setOpenOrg}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    disabled={orgComboboxDisabled}
                    className={cn(
                      "w-full justify-between font-normal",
                      !organizationId && "text-muted-foreground",
                    )}
                  >
                    {organizationsQuery.isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Yuklanmoqda...
                      </span>
                    ) : selectedOrganization ? (
                      selectedOrganization.name
                    ) : (
                      "Tashkilotni tanlang"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Qidirish..." />
                    <CommandEmpty>
                      {organizationsQuery.isError
                        ? "Tashkilotlar yuklanmadi."
                        : "Tashkilot topilmadi."}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {organizations.map((org) => (
                        <CommandItem
                          key={org._id}
                          value={org.name}
                          onSelect={() => {
                            setValue("organizationId", org._id, {
                              shouldValidate: true,
                            });
                            setOpenOrg(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              org._id === organizationId
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {org.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {organizationsQuery.isError && (
                <p className="text-sm text-destructive">
                  Tashkilotlar ro&apos;yxatini yuklab bo&apos;lmadi.
                </p>
              )}
              {errors.organizationId && (
                <p className="text-sm text-destructive">
                  {errors.organizationId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Muammo tavsifi *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Muammoni batafsil tasvirlab bering..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Aniq manzil *</Label>
              <Input
                id="address"
                placeholder="Masalan: Yunusobod tumani, Abdulla Qodiriy ko'chasi, 12-uy"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">
                Qo&apos;shimcha ma&apos;lumot (ixtiyoriy)
              </Label>
              <Textarea
                id="additionalInfo"
                rows={3}
                placeholder="Agar qo'shimcha tafsilotlar bo'lsa, yozing..."
                {...register("additionalInfo")}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={createRequest.isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={createRequest.isPending}>
                {createRequest.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default OperatorNewAppeal;
