"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { type AdminLoginState, loginAdmin } from "@/app/admin/actions";

const initialState: AdminLoginState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#d10000] px-4 py-3 text-sm font-black uppercase tracking-[0.28em] text-white transition hover:bg-[#b00000] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Memproses..." : "Masuk"}
    </button>
  );
}

type LoginFormProps = {
  username: string;
};

export function LoginForm({ username }: LoginFormProps) {
  const [state, formAction] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-black/55"
        >
          Username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          value={username}
          readOnly
          aria-readonly="true"
          className="w-full cursor-not-allowed border border-black/15 bg-black/[0.03] px-4 py-3 text-sm text-black/65 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-black/55"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus={false}
          placeholder="Masukkan password admin"
          className="w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/28 focus:border-[#d10000]"
        />
      </div>

      {state.error ? (
        <p className="border border-[#d10000]/18 bg-[#fff1f1] px-4 py-3 text-sm text-[#8f0404]">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
