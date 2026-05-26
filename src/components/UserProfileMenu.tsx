import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ApiError, resolveAssetUrl } from "@/lib/api/client";
import { useCurrentUser, useLogout } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

type UserProfileMenuProps = {
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  showRoleInTrigger?: boolean;
  nameClassName?: string;
  subLabelClassName?: string;
  avatarFallbackClassName?: string;
};

const UserProfileMenu = ({
  className,
  variant = "outline",
  size,
  showRoleInTrigger = false,
  nameClassName,
  subLabelClassName,
  avatarFallbackClassName,
}: UserProfileMenuProps) => {
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
      dispatcher: "Dispetcher",
      specialist: "Mutaxassis",
      manager: "Menejer",
    };

    return roleLabels[user.role] || user.role;
  }, [user]);

  const initials = useMemo(() => {
    if (!user) return "FP";

    const letters = [user.profile?.firstName, user.profile?.lastName]
      .map((part) => part?.trim()?.[0])
      .filter(Boolean)
      .join("")
      .toUpperCase();

    return letters || "FP";
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
          variant={variant}
          size={size}
          className={cn("flex items-center gap-2", className)}
          disabled={logoutMutation.isPending}
        >
          <Avatar className="h-7 w-7">
            {user.profile?.avatar?.trim() ? (
              <AvatarImage
                src={resolveAssetUrl(user.profile.avatar)}
                alt={displayName}
              />
            ) : null}
            <AvatarFallback
              className={cn(
                "bg-primary text-xs font-semibold text-primary-foreground",
                avatarFallbackClassName,
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          {showRoleInTrigger ? (
            <div className="min-w-0 text-left">
              <p
                className={cn(
                  "max-w-[220px] truncate text-sm leading-tight",
                  nameClassName,
                )}
              >
                {displayName}
              </p>
              {roleLabel ? (
                <p
                  className={cn(
                    "max-w-[220px] truncate text-xs leading-tight text-muted-foreground",
                    subLabelClassName,
                  )}
                >
                  {roleLabel}
                </p>
              ) : null}
            </div>
          ) : (
            <span
              className={cn(
                "max-w-[160px] truncate sm:max-w-[220px]",
                nameClassName,
              )}
            >
              {displayName}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-sm font-medium leading-none">{displayName}</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            navigate(user.role === "admin" ? "/ecosystem/profile" : "/profile")
          }
        >
          <User className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
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
