"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";

const ME = gql`
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

type MeData = {
  me: { id: string; email: string; name: string; role: string } | null;
};

export function AccountPanel() {
  const t = useTranslations("account");
  const router = useRouter();
  const { data, loading, error } = useQuery<MeData>(ME);
  const [logout, { loading: loggingOut }] = useMutation(LOGOUT);

  async function onLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-muted">{t("loading")}</p>;
  }

  if (error || !data?.me) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-6">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="mt-3 text-sm text-muted">{t("signedOut")}</p>
        <Link
          href="/login"
          className="mt-5 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
        >
          {t("signIn")}
        </Link>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-panel p-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <dl className="mt-5 grid gap-3 text-sm">
        <div>
          <dt className="text-muted">{t("name")}</dt>
          <dd>{data.me.name}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("email")}</dt>
          <dd>{data.me.email}</dd>
        </div>
        <div>
          <dt className="text-muted">{t("role")}</dt>
          <dd>{data.me.role}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="mt-6 rounded-lg border border-line px-4 py-2 text-sm"
      >
        {t("logout")}
      </button>
    </section>
  );
}
