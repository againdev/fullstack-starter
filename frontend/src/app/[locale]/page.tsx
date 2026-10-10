import { getTranslations, setRequestLocale } from "next-intl/server";
import { HealthCard } from "@/components/health-card";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="flex flex-col gap-8">
      <section className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-4 text-base leading-7 text-muted">{t("lead")}</p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
          >
            {t("createAccount")}
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm"
          >
            {t("signIn")}
          </Link>
        </div>
      </section>
      <HealthCard />
    </div>
  );
}
