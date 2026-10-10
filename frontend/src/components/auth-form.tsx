"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      email
      name
    }
  }
`;

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      id
      email
      name
    }
  }
`;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submit, { loading }] = useMutation(mode === "login" ? LOGIN : REGISTER);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");

    try {
      await submit({
        variables: {
          input:
            mode === "login" ? { email, password } : { email, password, name },
        },
      });
      router.push("/account");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("failed"));
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-line bg-panel p-6"
    >
      <h1 className="text-2xl font-semibold">
        {mode === "login" ? t("loginTitle") : t("registerTitle")}
      </h1>
      {mode === "register" && (
        <label className="flex flex-col gap-1 text-sm">
          {t("name")}
          <input
            name="name"
            required
            className="rounded-lg border border-line bg-paper px-3 py-2"
          />
        </label>
      )}
      <label className="flex flex-col gap-1 text-sm">
        {t("email")}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-line bg-paper px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        {t("password")}
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="rounded-lg border border-line bg-paper px-3 py-2"
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-ink disabled:opacity-60"
      >
        {loading
          ? t("submitting")
          : mode === "login"
            ? t("loginTitle")
            : t("registerTitle")}
      </button>
      <p className="text-sm text-muted">
        {mode === "login" ? (
          <Link href="/register" className="text-accent">
            {t("needAccount")}
          </Link>
        ) : (
          <Link href="/login" className="text-accent">
            {t("haveAccount")}
          </Link>
        )}
      </p>
    </form>
  );
}
