"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useTranslations } from "next-intl";

const HEALTH = gql`
  query HealthStatus {
    healthStatus {
      status
      database
      redis
    }
  }
`;

type HealthData = {
  healthStatus: {
    status: string;
    database: string;
    redis: string;
  };
};

export function HealthCard() {
  const t = useTranslations("home");
  const { data, loading, error } = useQuery<HealthData>(HEALTH);

  return (
    <section className="rounded-2xl border border-line bg-panel p-5">
      <h2 className="text-lg font-semibold">{t("healthTitle")}</h2>
      {loading && <p className="mt-3 text-sm text-muted">{t("healthLoading")}</p>}
      {error && (
        <p className="mt-3 text-sm text-danger">
          {t("healthError")} {error.message}
        </p>
      )}
      {data && (
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <Status label={t("api")} value={data.healthStatus.status} />
          <Status label={t("database")} value={data.healthStatus.database} />
          <Status label={t("redis")} value={data.healthStatus.redis} />
        </dl>
      )}
    </section>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  const ok = value === "ok";
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className={ok ? "font-medium text-accent" : "font-medium text-danger"}>
        {value}
      </dd>
    </div>
  );
}
