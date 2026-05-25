import type { UserRole } from "@/lib/api/auth";

const SPECIALIST_PWA_CACHE = "murojaat24-specialist-pwa-v1";

export type SpecialistPermissionStatus = {
  notifications: NotificationPermission | "unsupported";
  camera: PermissionState | "unsupported";
  location: PermissionState | "unsupported";
};

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export const isMobileDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
};

export const shouldEnableSpecialistPwa = (role?: UserRole) => {
  return role === "specialist" && isMobileDevice();
};

export const isStandalonePwa = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
};

export const getSpecialistPermissionStatus =
  async (): Promise<SpecialistPermissionStatus> => {
    const notifications =
      typeof Notification === "undefined"
        ? "unsupported"
        : Notification.permission;

    const camera =
      typeof navigator !== "undefined" && "permissions" in navigator
        ? ((
            await navigator.permissions.query({
              name: "camera" as PermissionName,
            })
          ).state as PermissionState)
        : "unsupported";

    const location =
      typeof navigator !== "undefined" && "permissions" in navigator
        ? ((
            await navigator.permissions.query({
              name: "geolocation" as PermissionName,
            })
          ).state as PermissionState)
        : "unsupported";

    return { notifications, camera, location };
  };

export const requestSpecialistPermissions =
  async (): Promise<SpecialistPermissionStatus> => {
    const notifications =
      typeof Notification === "undefined"
        ? "unsupported"
        : await Notification.requestPermission();

    const camera =
      typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia
        ? await navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
              stream.getTracks().forEach((track) => track.stop());
              return "granted" as PermissionState;
            })
            .catch(() => "denied" as PermissionState)
        : ("unsupported" as const);

    const location =
      typeof navigator !== "undefined" && "geolocation" in navigator
        ? await new Promise<PermissionState>((resolve) => {
            navigator.geolocation.getCurrentPosition(
              () => resolve("granted"),
              () => resolve("denied"),
              { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
            );
          })
        : ("unsupported" as const);

    return { notifications, camera, location };
  };

export const registerSpecialistPwa = async () => {
  if (!shouldEnableSpecialistPwa("specialist")) {
    return null;
  }

  if (!("serviceWorker" in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
};

export const unregisterSpecialistPwa = async () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations.map((registration) => registration.unregister()),
  );

  if ("caches" in window) {
    await caches.delete(SPECIALIST_PWA_CACHE);
  }
};
