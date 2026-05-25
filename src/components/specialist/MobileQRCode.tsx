import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { getRoleRedirectPath, useCurrentUser, useLogout } from "@/lib/api/auth";
import {
  BeforeInstallPromptEvent,
  getSpecialistPermissionStatus,
  isStandalonePwa,
  registerSpecialistPwa,
  requestSpecialistPermissions,
  shouldEnableSpecialistPwa,
  type SpecialistPermissionStatus,
} from "@/lib/pwa";

type Props = {
  loginUrl?: string;
};

const SPECIALIST_PWA_ACCESS_KEY = "specialist_pwa_permissions_granted";

export const MobileQRCode = ({ loginUrl }: Props) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();
  const url = loginUrl || `${window.location.origin}/login`;
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandalonePwa());
  const [isStandalone, setIsStandalone] = useState(isStandalonePwa());
  const [isInstalling, setIsInstalling] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<SpecialistPermissionStatus | null>(null);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(isStandalonePwa());

  const hasStoredPwaAccess = () => {
    return localStorage.getItem(SPECIALIST_PWA_ACCESS_KEY) === "true";
  };

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

    const installedHandler = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallHandler);
    window.addEventListener("appinstalled", installedHandler);

    const updateStandaloneState = () => {
      const standalone = isStandalonePwa();
      setIsStandalone(standalone);

      if (standalone) {
        if (hasStoredPwaAccess()) {
          navigate(getRoleRedirectPath(currentUser?.role || "specialist"), {
            replace: true,
          });
          return;
        }

        setIsCheckingAccess(true);
        void getSpecialistPermissionStatus().then((nextStatus) => {
          setPermissionStatus(nextStatus);
          setIsCheckingAccess(false);
        });
      } else {
        setPermissionStatus(null);
        setIsCheckingAccess(false);
      }
    };

    updateStandaloneState();

    window.addEventListener("focus", updateStandaloneState);
    window.addEventListener("visibilitychange", updateStandaloneState);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallHandler);
      window.removeEventListener("appinstalled", installedHandler);
      window.removeEventListener("focus", updateStandaloneState);
      window.removeEventListener("visibilitychange", updateStandaloneState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needsPermissions = useMemo(() => {
    if (!permissionStatus) {
      return true;
    }

    return (
      permissionStatus.notifications !== "granted" ||
      permissionStatus.camera !== "granted" ||
      permissionStatus.location !== "granted"
    );
  }, [permissionStatus]);

  const handleInstallApp = async () => {
    if (!installPrompt) {
      window.location.reload();
      return;
    }

    setIsInstalling(true);

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
    } finally {
      setIsInstalling(false);
      setInstallPrompt(null);
    }
  };

  const handleGrantPermissions = async () => {
    if (!isStandalone) {
      return;
    }

    setIsRequestingPermissions(true);

    try {
      const nextStatus = await requestSpecialistPermissions();
      setPermissionStatus(nextStatus);

      const allGranted =
        nextStatus.notifications === "granted" &&
        nextStatus.camera === "granted" &&
        nextStatus.location === "granted";

      if (allGranted) {
        localStorage.setItem(SPECIALIST_PWA_ACCESS_KEY, "true");
        navigate(getRoleRedirectPath(currentUser?.role || "specialist"), {
          replace: true,
        });
      }
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  useEffect(() => {
    if (!isStandalone || isCheckingAccess || !permissionStatus) {
      return;
    }

    const allGranted =
      permissionStatus.notifications === "granted" &&
      permissionStatus.camera === "granted" &&
      permissionStatus.location === "granted";

    if (allGranted) {
      localStorage.setItem(SPECIALIST_PWA_ACCESS_KEY, "true");
      navigate(getRoleRedirectPath(currentUser?.role || "specialist"), {
        replace: true,
      });
    }
  }, [
    currentUser?.role,
    isCheckingAccess,
    isStandalone,
    navigate,
    permissionStatus,
  ]);

  const handleReturn = async () => {
    await logoutMutation.mutateAsync();
    navigate("/");
  };

  const renderPermissionState = () => {
    if (!permissionStatus) {
      return "Ruxsatlar holati tekshirilmoqda...";
    }

    return [
      ["Bildirishnomalar", permissionStatus.notifications],
      ["Kamera", permissionStatus.camera],
      ["Joylashuv", permissionStatus.location],
    ]
      .map(([label, status]) => `${label}: ${status}`)
      .join(" • ");
  };

  if (isMobile) {
    return (
      <div className="min-h-dvh bg-slate-950 text-white md:p-6">
        <div className="flex flex-1 items-center justify-center overflow-auto bg-white px-5 py-8 text-slate-900 sm:px-8 lg:w-7/12 lg:px-12 lg:py-10">
          <div className="w-full max-w-2xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Mutaxasis ilovasini o'rnatish
              </p>
              <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                Ilovani o'rnating va ruxsatlarni bering
              </h1>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Avval ilovani mobil qurilmangizga o'rnating. O'rnatilgandan
                so'ng xabarnomalar, kamera va joylashuv xizmatlariga ruxsat
                berish kerak bo'ladi.
              </p>
            </div>

            {!isInstalled ? (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Install step
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-950">
                    Ilovani o'rnating
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Avval ilovani qurilmaga qo'shing. O'rnatilgach, appni qayta
                    ochib ruxsatlar beriladi.
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-slate-700">
                    <p>
                      • Chrome yoki browser menyusidan install oynasi chiqadi.
                    </p>
                    <p>• Oynani ko'rmasangiz, sahifani qayta tekshiring.</p>
                    <p>• O'rnatilgach browserdan chiqing.</p>
                  </div>

                  <button
                    type="button"
                    className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleInstallApp}
                    disabled={isInstalling}
                  >
                    {isInstalling
                      ? "O'rnatilmoqda..."
                      : installPrompt
                        ? "Ilovani o'rnatish"
                        : "Qayta tekshirish"}
                  </button>

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
            ) : !isStandalone ? (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Ilova o'rnatildi.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Endi Chrome web oynasini yoping va ilovani uy ekranidan yoki
                    ilovalar ro'yxatidan oching. Ruxsatlar faqat standalone
                    rejimda so'raladi.
                  </p>

                  <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
                    Ilovani qayta ochgandan keyin kamera, joylashuv va
                    bildirishnomalar so'raladi.
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={handleReturn}
                  disabled={isInstalling}
                >
                  Bosh sahifaga qaytish
                </button>
              </div>
            ) : isCheckingAccess || !permissionStatus ? (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
                <div className="rounded-xl bg-white p-5 shadow-sm text-center">
                  <p className="text-sm font-semibold text-slate-900">
                    Ilova tekshirilmoqda...
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    O'rnatish va ruxsatlar holati aniqlanmoqda.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-400" />
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={handleReturn}
                >
                  Bosh sahifaga qaytish
                </button>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
                <div className="rounded-xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    O'rnatildi. Endi ruxsat bering.
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Bildirishnomalar, kamera va joylashuvsiz ilova to'liq
                    ishlamaydi.
                  </p>

                  <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
                    {renderPermissionState()}
                  </div>

                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleGrantPermissions}
                    disabled={isRequestingPermissions}
                  >
                    {isRequestingPermissions
                      ? "Ruxsat so'ralmoqda..."
                      : needsPermissions
                        ? "Ruxsatlarni berish"
                        : "Davom etish"}
                  </button>
                </div>

                <button
                  type="button"
                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={handleReturn}
                  disabled={isInstalling}
                >
                  Bosh sahifaga qaytish
                </button>
              </div>
            )}
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
              va mutaxasis ilovasini o'rnating.
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
