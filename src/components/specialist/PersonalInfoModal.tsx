import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useCurrentUser } from "@/lib/api/auth";

interface PersonalInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PersonalInfoModal = ({ open, onOpenChange }: PersonalInfoModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const currentUserQuery = useCurrentUser();
  const user = currentUserQuery.data;

  const firstName = user?.profile?.firstName?.trim();
  const lastName = user?.profile?.lastName?.trim();
  const name =
    [firstName, lastName].filter(Boolean).join(" ") ||
    user?.phone ||
    "Mutaxassis";
  const initials =
    [firstName, lastName]
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "SP";

  const [formData, setFormData] = useState({
    firstName: "Akmal",
    lastName: "Rahimov",
    phone: "+998 90 123 45 67",
    email: "akmal.rahimov@murojaat24.uz",
    birthDate: "15.03.1990",
    department: "Elektr energiyasi",
    region: "Termiz shahri",
    startDate: "01.06.2022",
  });

  useEffect(() => {
    if (!user || isEditing) return;

    setFormData((prev) => ({
      ...prev,
      firstName: user.profile?.firstName || prev.firstName,
      lastName: user.profile?.lastName || prev.lastName,
      phone: user.phone || prev.phone,
    }));
  }, [user, isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to localStorage or API
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shaxsiy ma'lumotlar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </button>
              )}
            </div>
            {isEditing && (
              <Button variant="link" size="sm" className="mt-2">
                Rasmni o'zgartirish
              </Button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Ism</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Familiya
                </Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Telefon</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Tug'ilgan sana
              </Label>
              <Input
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Bo'lim</Label>
              <Input
                value={formData.department}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Hudud</Label>
              <Input
                value={formData.region}
                disabled
                className="mt-1 bg-muted"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Ish boshlagan sana
              </Label>
              <Input
                value={formData.startDate}
                disabled
                className="mt-1 bg-muted"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Bekor qilish
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  Saqlash
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Yopish
                </Button>
                <Button className="flex-1" onClick={() => setIsEditing(true)}>
                  Tahrirlash
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalInfoModal;
