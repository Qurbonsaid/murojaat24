import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import OperatorSidebar from "@/components/OperatorSidebar";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { CheckCircle, Clock, AlertCircle, Timer, MapPin, Eye, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { organizations } from "@/lib/organizations";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(1, "Ism familiya majburiy"),
  phone: z.string().regex(/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/, "Telefon raqam formati noto'g'ri"),
  requestType: z.string().min(1, "Tashkilotni tanlang"),
  description: z.string().min(10, "Kamida 10 ta belgi kiriting").max(500),
  address: z.string().min(1, "Manzil majburiy"),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [openOrg, setOpenOrg] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("operator_session");
    if (!session) {
      navigate("/login");
    }
  }, [navigate]);

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
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Murojaat yaratildi",
        description: `Yangi murojaat raqami: MUR-2024-${Math.floor(Math.random() * 900000 + 100000)}`,
      });
      reset({ phone: "+998 " });
      setIsLoading(false);
    }, 1000);
  };

  const mockRequests = [
    { id: "MUR-2024-001234", citizen: "Sardor Karimov", type: "Elektr energiyasi", time: "09:30", status: "completed" },
    { id: "MUR-2024-001235", citizen: "Dilnoza Rahimova", type: "Suv ta'minoti", time: "10:15", status: "in-progress" },
    { id: "MUR-2024-001236", citizen: "Otabek Toshmatov", type: "Yo'l ta'miri", time: "11:00", status: "in-progress" },
    { id: "MUR-2024-001237", citizen: "Gulnora Saidova", type: "Ko'cha yoritish", time: "11:45", status: "completed" },
    { id: "MUR-2024-001238", citizen: "Jamshid Ergashev", type: "Gaz ta'minoti", time: "12:20", status: "pending" },
    { id: "MUR-2024-001239", citizen: "Malika Yusupova", type: "Axlat chiqarish", time: "13:05", status: "completed" },
    { id: "MUR-2024-001240", citizen: "Aziz Nazarov", type: "Kanalizatsiya", time: "13:40", status: "in-progress" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Bajarilgan</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Jarayonda</Badge>;
      case "pending":
        return <Badge className="bg-red-500 hover:bg-red-600">Kutilmoqda</Badge>;
      default:
        return <Badge>Noma'lum</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <OperatorSidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Operator paneli - bugungi statistika</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={CheckCircle}
            label="Bugun qabul qilindi"
            value={23}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatsCard
            icon={Clock}
            label="Jarayonda"
            value={8}
            iconColor="bg-yellow-100 text-yellow-600"
          />
          <StatsCard
            icon={AlertCircle}
            label="Bajarilgan"
            value={15}
            iconColor="bg-green-100 text-green-600"
          />
          <StatsCard
            icon={Timer}
            label="O'rtacha vaqt"
            value="3.5 soat"
            iconColor="bg-gray-100 text-gray-600"
          />
        </div>

        <Card className="mb-8">
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
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestType">Tashkilotni tanlang *</Label>
                <Popover open={openOrg} onOpenChange={setOpenOrg}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal",
                        !watch("requestType") && "text-muted-foreground"
                      )}
                    >
                      {watch("requestType")
                        ? organizations.find((org) => org === watch("requestType"))
                        : "Tashkilotni tanlang"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Qidirish..." />
                      <CommandEmpty>Tashkilot topilmadi.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {organizations.map((org) => (
                          <CommandItem
                            key={org}
                            value={org}
                            onSelect={() => {
                              setValue("requestType", org);
                              setOpenOrg(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                org === watch("requestType") ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {org}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.requestType && (
                  <p className="text-sm text-destructive">{errors.requestType.message}</p>
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
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Aniq manzil *</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    placeholder="Masalan: Yunusobod tumani, Abdulla Qodiriy ko'chasi, 12-uy"
                    className="flex-1"
                    {...register("address")}
                  />
                  <Button type="button" variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Qo'shimcha ma'lumot (ixtiyoriy)</Label>
                <Textarea
                  id="additionalInfo"
                  rows={3}
                  placeholder="Agar qo'shimcha tafsilotlar bo'lsa, yozing..."
                  {...register("additionalInfo")}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => reset({ phone: "+998 " })}>
                  Bekor qilish
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSubmit((data) => {
                    onSubmit(data);
                  })}
                  disabled={isLoading}
                >
                  Saqlash va yangi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bugun yaratilgan murojaatlar</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Raqam</TableHead>
                  <TableHead>Fuqaro</TableHead>
                  <TableHead>Turi</TableHead>
                  <TableHead>Vaqt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.citizen}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.time}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OperatorDashboard;
