import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getRoleRedirectPath, useCurrentUser, useLogout } from "@/lib/api/auth";
import {
  BeforeInstallPromptEvent,
  registerSpecialistPwa,
  shouldBypassSpecialistInstallWall,
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
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (shouldBypassSpecialistInstallWall()) {
      navigate(getRoleRedirectPath(currentUser?.role || "specialist"), {
        replace: true,
      });
    }
  }, [currentUser?.role, navigate]);

  useEffect(() => {
    if (shouldEnableSpecialistPwa(currentUser?.role)) {
      void registerSpecialistPwa();
    }
  }, [currentUser?.role, isMobile]);

  useEffect(() => {
    const beforeInstallHandler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
    };
  }, []);

  const handleReturn = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  if (isMobile) {
    return (
      <div className="min-h-dvh bg-slate-950 text-white md:p-6">
        <div className="flex flex-1 items-center justify-center overflow-auto bg-white px-5 py-8 text-slate-900 sm:px-8 lg:w-7/12 lg:px-12 lg:py-10">
          <div className="w-full max-w-2xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Mutaxassis ilovasini o'rnatish
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                Ilovani o'rnating
              </h1>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Agar o'rnatish oynasi avtomatik chiqsa, uni tasdiqlang. Aks
                holda Chrome menyusidan ilovani qo'lda o'rnating.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  {installPrompt
                    ? "Avtomatik o'rnatish tayyor"
                    : "Chrome orqali qo'lda o'rnating"}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {installPrompt
                    ? "Quyidagi tugma yordamida ilovani qurilmaga o'rnatishingiz mumkin."
                    : "Chrome menyusini oching [⋮ / Install app / Ilovani o'rnatish / Установить приложение] va shu sahifani ilova sifatida o'rnating."}
                </p>

                {!installPrompt ? (
                  <div className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
                    Chrome menyusi [⋮ / Install app / Ilovani o'rnatish /
                    Установить приложение]
                  </div>
                ) : null}

                {installPrompt ? (
                  <button
                    type="button"
                    className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={async () => {
                      setIsInstalling(true);
                      try {
                        await installPrompt.prompt();
                        await installPrompt.userChoice;
                      } finally {
                        setIsInstalling(false);
                        setInstallPrompt(null);
                      }
                    }}
                    disabled={isInstalling}
                  >
                    {isInstalling ? "O'rnatilmoqda..." : "Ilovani o'rnatish"}
                  </button>
                ) : null}

                <button
                  type="button"
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={handleReturn}
                  disabled={isInstalling}
                >
                  Bosh sahifaga qaytish
                </button>
              </div>
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
              disabled={logoutMutation.isPending || isInstalling}
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
