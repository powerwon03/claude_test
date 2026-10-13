"use client";

import { useActionState, useEffect, useRef } from "react";
import { addContact, type ActionResult } from "@/app/actions";
import { ContactFields } from "@/components/ContactFields";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    addContact,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <ContactFields />
      {state && !state.ok && <p className="text-sm text-danger">{state.error}</p>}
      {state?.ok && <p className="text-sm text-accent">저장되었습니다.</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "저장 중" : "추가"}
        </button>
      </div>
    </form>
  );
}
