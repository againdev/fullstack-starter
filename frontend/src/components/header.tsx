"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="text-sm font-semibold tracking-wide">
          {t("brand")}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/account" className="hover:text-accent">
            {t("account")}
          </Link>
          <Link href="/login" className="hover:text-accent">
            {t("login")}
          </Link>
          <label className="sr-only" htmlFor="locale">
            {t("language")}
          </label>
          <select
            id="locale"
            className="rounded-md border border-line bg-paper px-2 py-1"
            value={locale}
            onChange={(event) =>
              router.replace(pathname, { locale: event.target.value })
            }
          >
            {routing.locales.map((item) => (
              <option key={item} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  );
}
