import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({ open, onOpenChange }: ChangePasswordModalProps) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Yangi parollar mos kelmayapti");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }

    // Here you would make an API call to change the password
    toast.success("Parol muvaffaqiyatli o'zgartirildi");
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Parolni o'zgartirish</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <Label className="text-sm">Joriy parol</Label>
            <div className="relative mt-1">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Joriy parolni kiriting"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <Label className="text-sm">Yangi parol</Label>
            <div className="relative mt-1">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Yangi parolni kiriting"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label className="text-sm">Yangi parolni tasdiqlash</Label>
            <div className="relative mt-1">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Yangi parolni qayta kiriting"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Parol talablari:</p>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              <li>• Kamida 8 ta belgi</li>
              <li>• Katta va kichik harflar</li>
              <li>• Kamida bitta raqam</li>
              <li>• Kamida bitta maxsus belgi (!@#$%)</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Bekor qilish
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Saqlash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
