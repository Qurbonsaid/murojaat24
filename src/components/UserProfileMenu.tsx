import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { LogOut } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { useCurrentUser, useLogout } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

type UserProfileMenuProps = {
  className?: string;
};

const UserProfileMenu = ({ className }: UserProfileMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUserQuery = useCurrentUser();
  const logoutMutation = useLogout();

  const user = currentUserQuery.data;

  const displayName = useMemo(() => {
    if (!user) return "";

    const name = [user.profile?.firstName, user.profile?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    return name || user.phone;
  }, [user]);

  const roleLabel = useMemo(() => {
    if (!user) return "";

    const roleLabels: Record<string, string> = {
      admin: "Hokimiyat",
      operator: "Operator",
      dispatcher: "Dispatcher",
      specialist: "Mutaxassis",
      manager: "Menjer",
    };

    return roleLabels[user.role] || user.role;
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Chiqildi",
        description: "Tizimdan muvaffaqiyatli chiqdingiz",
      });
      navigate("/login");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Chiqishda xatolik yuz berdi";
      toast({
        title: "Xatolik",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("flex items-center gap-2", className)}
          disabled={logoutMutation.isPending}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={
                user.profile?.avatar ||
                "https://gravatar.com/avatar/00000000000000000000000000000000?s=800&d=mp&r=x"
              }
              alt={displayName}
            />
          </Avatar>
          <span className="max-w-[220px] truncate">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-sm font-medium leading-none">{displayName}</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Chiqish
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
