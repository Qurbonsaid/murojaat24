import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, Menu, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";
import { useCurrentUser, useLogout } from "@/lib/api/auth";

const navLinks = [
  { label: "Bosh sahifa", href: "#hero" },
  { label: "Xizmatlar", href: "#xizmatlar" },
  { label: "Raqamlarda Termiz", href: "#statistika" },
  { label: "Bog'lanish", href: "#bog-lanish" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUserQuery = useCurrentUser();
  const logoutMutation = useLogout();

  const user = currentUserQuery.data;
  const displayName = user
    ? [user.profile?.firstName, user.profile?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || user.phone
    : "";

  const handleLogout = async () => {
    setMobileOpen(false);
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-900/10 bg-white/90 backdrop-blur">
      <div className="border-b border-slate-100 bg-[#0d4c8b] text-sky-50">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs">
          <span className="font-medium">
            Termiz shahar hokimligi rasmiy raqamli platformasi
          </span>
          <a
            href="tel:1089"
            className="inline-flex items-center gap-1.5 text-sky-100 transition-colors hover:text-white"
          >
            <Phone className="h-3.5 w-3.5" />
            Ishonch telefoni: 1089
          </a>
        </div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/termiz-aqlli-shahar-logo.svg"
            alt="Termiz aqlli shahar logotipi"
            className="h-10 w-10 rounded-xl shadow-sm"
            loading="eager"
            decoding="async"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-[#0d4c8b] sm:text-lg">
              Termiz aqlli shahar
            </span>
            <span className="text-xs text-slate-500">
              Fuqarolar uchun raqamli xizmatlar
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-[#0d4c8b]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="hidden items-center gap-2 border-[#0d4c8b]/30 text-[#0d4c8b] hover:bg-[#0d4c8b]/5 sm:inline-flex"
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
                  <span className="max-w-[160px] truncate">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Profil</DropdownMenuLabel>
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
          ) : (
            <Button
              asChild
              variant="outline"
              className="hidden border-[#0d4c8b]/30 text-[#0d4c8b] hover:bg-[#0d4c8b]/5 sm:inline-flex"
            >
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Tizimga kirish
              </Link>
            </Button>
          )}

          <Button
            asChild
            className="hidden bg-[#0d4c8b] text-white hover:bg-[#0a3d70] sm:inline-flex"
          >
            <a
              href="https://murojaat.aqllishahar-termizsh.uz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Murojaat qoldirish
            </a>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menyuni ochish</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0d4c8b]"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  asChild
                  className="mt-4 bg-[#0d4c8b] text-white hover:bg-[#0a3d70]"
                >
                  <a
                    href="https://murojaat.aqllishahar-termizsh.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    Murojaat qoldirish
                  </a>
                </Button>
                <Button
                  asChild={!user}
                  variant={user ? "destructive" : "outline"}
                  className={
                    user
                      ? "mt-2"
                      : "border-[#0d4c8b]/30 text-[#0d4c8b] hover:bg-[#0d4c8b]/5"
                  }
                  onClick={user ? handleLogout : undefined}
                >
                  {user ? (
                    <span className="inline-flex items-center justify-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      Chiqish
                    </span>
                  ) : (
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Tizimga kirish
                    </Link>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
