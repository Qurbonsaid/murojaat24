import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useCreateAssignment } from "@/lib/api/assignments";
import { ApiError } from "@/lib/api/client";
import { getStaffUserDisplayName, useSpecialists } from "@/lib/api/users";
import { Loader2 } from "lucide-react";

interface AssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  requestNumber: string;
  organizationId?: string;
}

const AssignModal = ({
  open,
  onOpenChange,
  requestId,
  requestNumber,
  organizationId,
}: AssignModalProps) => {
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const { toast } = useToast();
  const createAssignment = useCreateAssignment();

  const specialistsQuery = useSpecialists(
    {
      limit: 100,
      ...(organizationId ? { organizations: [organizationId] } : {}),
    },
    { enabled: open },
  );

  const specialists = specialistsQuery.data?.data ?? [];

  useEffect(() => {
    if (!open) {
      setSelectedSpecialist("");
    }
  }, [open]);

  const specialistOptions = useMemo(
    () =>
      specialists.map((specialist) => ({
        id: specialist._id,
        name: getStaffUserDisplayName(specialist),
        status: specialist.status,
      })),
    [specialists],
  );

  const handleAssign = async () => {
    if (!requestId || !selectedSpecialist) return;

    try {
      await createAssignment.mutateAsync({
        requestId,
        specialistId: selectedSpecialist,
      });

      const specialist = specialistOptions.find(
        (item) => item.id === selectedSpecialist,
      );

      toast({
        title: "Tayinlandi",
        description: `Murojaat ${specialist?.name ?? "mutaxassis"}ga tayinlandi`,
      });
      onOpenChange(false);
      setSelectedSpecialist("");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Tayinlashda xatolik";
      toast({
        variant: "destructive",
        title: "Xatolik",
        description: message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mutaxassisni tanlang</DialogTitle>
          <DialogDescription>
            Murojaat:{" "}
            <span className="font-semibold text-foreground">{requestNumber}</span>
          </DialogDescription>
        </DialogHeader>

        {specialistsQuery.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : specialistsQuery.isError ? (
          <p className="py-4 text-center text-sm text-destructive">
            Mutaxassislarni yuklashda xatolik
          </p>
        ) : specialistOptions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Mos mutaxassislar topilmadi
          </p>
        ) : (
          <RadioGroup
            value={selectedSpecialist}
            onValueChange={setSelectedSpecialist}
            className="space-y-3"
          >
            {specialistOptions.map((specialist) => (
              <div
                key={specialist.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-colors ${
                  selectedSpecialist === specialist.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedSpecialist(specialist.id)}
              >
                <RadioGroupItem
                  value={specialist.id}
                  id={specialist.id}
                  className="mt-1"
                />

                <div className="flex flex-1 items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {specialist.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor={specialist.id} className="cursor-pointer font-semibold">
                      {specialist.name}
                    </Label>
                    {specialist.status && (
                      <p className="text-xs text-muted-foreground capitalize">
                        {specialist.status}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        )}

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={createAssignment.isPending}
          >
            Bekor qilish
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              !selectedSpecialist ||
              createAssignment.isPending ||
              specialistsQuery.isLoading
            }
            className="flex-1"
          >
            {createAssignment.isPending ? "Tayinlanmoqda..." : "Tayinlash"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
