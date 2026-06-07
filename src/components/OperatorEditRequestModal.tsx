import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { useOrganizations } from "@/lib/api/organizations";
import {
  resolveOrganizationId,
  resolveOrganizationName,
  type AppealRequestListItem,
  useUpdateRequest,
} from "@/lib/api/requests";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  organizationId: z.string().min(1, "Tashkilotni tanlang"),
});

type FormData = z.infer<typeof formSchema>;

type OperatorEditRequestModalProps = {
  request: AppealRequestListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const OperatorEditRequestModal = ({
  request,
  open,
  onOpenChange,
}: OperatorEditRequestModalProps) => {
  const { toast } = useToast();
  const [openOrg, setOpenOrg] = useState(false);

  const organizationsQuery = useOrganizations();
  const updateRequest = useUpdateRequest();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { organizationId: "" },
  });

  const organizationId = watch("organizationId");
  const organizations = organizationsQuery.data ?? [];

  const organizationNameById = new Map(
    organizations.map((org) => [org._id, org.name])
  );

  const selectedOrganization = organizations.find(
    (org) => org._id === organizationId
  );

  useEffect(() => {
    if (!open || !request) return;

    reset({
      organizationId: resolveOrganizationId(request.organization) ?? "",
    });
    setOpenOrg(false);
  }, [open, request, reset]);

  const onSubmit = async (data: FormData) => {
    if (!request?._id) return;

    try {
      await updateRequest.mutateAsync({
        id: request._id,
        organization: data.organizationId,
        ...(request.incorrectOrganization
          ? { incorrectOrganization: false }
          : {}),
      });

      toast({
        title: "Yangilandi",
        description: `${request.requestNumber} tashkiloti o'zgartirildi`,
      });
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Murojaatni yangilashda xatolik yuz berdi";

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Murojaatni tahrirlash</DialogTitle>
        </DialogHeader>

        {request ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Raqam: </span>
                <span className="font-medium">{request.requestNumber}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Fuqaro: </span>
                <span>{request.citizen?.name ?? "—"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Joriy tashkilot: </span>
                <span>
                  {resolveOrganizationName(
                    request.organization,
                    organizationNameById
                  )}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-organizationId">Yangi tashkilot *</Label>
              <Popover open={openOrg} onOpenChange={setOpenOrg}>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-organizationId"
                    type="button"
                    variant="outline"
                    role="combobox"
                    disabled={orgComboboxDisabled}
                    className={cn(
                      "w-full justify-between font-normal",
                      !organizationId && "text-muted-foreground"
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
                                : "opacity-0"
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

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateRequest.isPending}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={updateRequest.isPending}>
                {updateRequest.isPending ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default OperatorEditRequestModal;
