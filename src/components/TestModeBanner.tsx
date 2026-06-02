import { useEffect, useState } from "react";

const BANNER_REPEAT = 3;

const TestModeBanner = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-[33px] border-b border-amber-500/30 bg-amber-500"
        aria-hidden
      />
    );
  }

  const message = "Sayt test rejimida ishlamoqda";

  return (
    <div
      className="overflow-hidden border-b border-amber-500/30 bg-amber-500 text-amber-950"
      data-nosnippet
      role="status"
      aria-live="polite"
    >
      <div className="flex w-full animate-test-banner-marquee items-center justify-between gap-8 py-2 text-xs font-semibold uppercase tracking-wide">
        {Array.from({ length: BANNER_REPEAT }).map((_, index) => (
          <span key={index} className="shrink-0">
            {message}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TestModeBanner;
