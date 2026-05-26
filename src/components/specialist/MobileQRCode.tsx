import { useEffect } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getRoleRedirectPath, useCurrentUser, useLogout } from "@/lib/api/auth";
import {
  isStandalonePwa,
  registerSpecialistPwa,
  shouldEnableSpecialistPwa,
} from "@/lib/pwa";

type Props = {
  loginUrl?: string;
};

export const MobileQRCode = ({ loginUrl }: Props) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();
  const url = loginUrl || `${window.location.origin}/login`;
  const isStandalone = isStandalonePwa();

  useEffect(() => {
    if (currentUser?.role === "specialist" && isStandalone) {
      navigate(getRoleRedirectPath(currentUser?.role || "specialist"), {
        replace: true,
      });
    }
  }, [currentUser?.role, isStandalone, navigate]);

  useEffect(() => {
    if (shouldEnableSpecialistPwa(currentUser?.role)) {
      void registerSpecialistPwa();
    }
  }, [currentUser]);

  const handleReturn = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  const renderSplashScreen = (message: string) => (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-5 py-8 text-white sm:px-8">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <div className="flex h-8 w-8 items-center justify-center gap-1">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/80" />
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/80 [animation-delay:150ms]" />
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/80 [animation-delay:300ms]" />
          </div>
        </div>
        <h1 className="mt-5 text-2xl font-bold">Murojaat24</h1>
        <p className="mt-2 text-sm text-slate-200">{message}</p>
      </div>
    </div>
  );

  if (isMobile && isStandalone) {
    return renderSplashScreen(
      "Ilova PWA rejimida ochildi. Tez orada boshqaruv paneliga yo'naltirilasiz.",
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-dvh bg-slate-950 px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
                Mutaxassis ilovasini o'rnatish
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                Brauzer menyusidan o'rnating
              </h1>
              <p className="mt-3 text-sm text-slate-200 sm:text-base">
                Ushbu sahifa brauzerda ochilgan. Chrome menyusidan "Bosh ekranga
                qo'shish" (Add to homescreen / Добавить на главный экран) bosing
                va "Ilovani o'rnatish" (Install app / Установить приложение)
                bandini tanlab ilovani o'rnating.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Qayta tekshirish
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-white/15"
                onClick={handleReturn}
              >
                Bosh sahifaga qaytish
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-100 p-4 md:p-8">
      <div className="mx-auto flex h-[calc(100dvh-2rem)] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:h-[calc(100dvh-4rem)] lg:flex-row">
        <div className="flex h-56 items-center justify-center bg-slate-900 p-5 sm:h-72 md:h-80 lg:h-auto lg:w-1/2 lg:p-8">
          <img
            src="/qr-scan.svg"
            alt="QR kodni skanerlash rasmi"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex w-full flex-1 items-center justify-center overflow-auto p-5 sm:p-6 md:p-8 lg:w-1/2 lg:p-12">
          <div className="w-full max-w-md text-center lg:max-w-lg">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Ilovani mobil qurilmada oching yoki QR kodni skanerlang
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Mobil qurilmangiz orqali ushbu QR kodni skanerlab tizimga kiring
              va mutaxassis ilovasini o'rnating.
            </p>

            <div className="mx-auto mt-6 w-fit rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-8 sm:p-5">
              <QRCode
                value={url}
                size={220}
                bgColor="#ffffff"
                fgColor="#0f172a"
                className="mx-auto"
              />
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6"
              onClick={handleReturn}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending
                ? "Chiqilmoqda..."
                : "Bosh sahifaga qaytish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
