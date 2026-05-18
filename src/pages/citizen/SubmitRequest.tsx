import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { MapPin, Loader2, Check, ChevronsUpDown } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import SuccessModal from "@/components/SuccessModal";
import { organizations } from "@/lib/organizations";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  requestType: z.string().min(1, { message: "Tashkilotni tanlang" }),
  description: z
    .string()
    .min(10, { message: "Tavsif kamida 10 ta belgidan iborat bo'lishi kerak" })
    .max(500, { message: "Tavsif maksimal 500 ta belgidan iborat bo'lishi kerak" }),
  address: z.string().min(5, { message: "Aniq manzilni kiriting" }),
  phone: z
    .string()
    .regex(/^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, {
      message: "Telefon raqamini to'g'ri formatda kiriting",
    }),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const SubmitRequest = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [openOrg, setOpenOrg] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: "",
      description: "",
      address: "",
      phone: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate tracking number
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setTrackingNumber(`MUR-2024-${randomNum}`);
    
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use reverse geocoding here
          form.setValue("address", "Toshkent shahar, Yunusobod tumani");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    form.reset();
    setUploadedImage(null);
    setDescriptionLength(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Yangi Murojaat Yuborish</h1>
              <p className="text-muted-foreground">Muammoning tafsilotlarini kiriting</p>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Image Upload */}
                  <ImageUpload
                    uploadedImage={uploadedImage}
                    setUploadedImage={setUploadedImage}
                  />

                  {/* Organization Selection */}
                  <FormField
                    control={form.control}
                    name="requestType"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tashkilotni tanlang *</FormLabel>
                        <Popover open={openOrg} onOpenChange={setOpenOrg}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? organizations.find((org) => org === field.value)
                                  : "Tashkilotni tanlang"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
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
                                      form.setValue("requestType", org);
                                      setOpenOrg(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        org === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {org}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Muammo tavsifi *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Muammoni batafsil tasvirlab bering..."
                            className="resize-none"
                            rows={4}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setDescriptionLength(e.target.value.length);
                            }}
                          />
                        </FormControl>
                        <div className="flex justify-between items-center">
                          <FormMessage />
                          <span className="text-sm text-muted-foreground">
                            {descriptionLength} / 500
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aniq manzil *</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="Masalan: Yunusobod tumani, Abdulla Qodiriy ko'chasi, 12-uy"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleGetLocation}
                            className="shrink-0"
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon raqami *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+998 90 123 45 67"
                            {...field}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.startsWith("998")) {
                                value = value.slice(3);
                              }
                              if (value.length > 9) {
                                value = value.slice(0, 9);
                              }
                              const formatted = value
                                ? `+998 ${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 7)} ${value.slice(7, 9)}`.trim()
                                : "";
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Info */}
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qo'shimcha ma'lumot (ixtiyoriy)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Agar qo'shimcha tafsilotlar bo'lsa, yozing..."
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        form.reset();
                        setUploadedImage(null);
                        setDescriptionLength(0);
                      }}
                      disabled={isSubmitting}
                    >
                      Bekor qilish
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Yuklanmoqda...
                        </>
                      ) : (
                        "Yuborish"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <SuccessModal
        open={showSuccess}
        onClose={handleSuccessClose}
        trackingNumber={trackingNumber}
      />
    </div>
  );
};

export default SubmitRequest;
