"use client";

import { useActionState, useState, useTransition } from "react";
import { deleteContact, updateContact, type ActionResult } from "@/app/actions";
import { formatPhone } from "@/lib/phone";
import type { Contact } from "@/lib/types";
import { ContactFields } from "@/components/ContactFields";

export function ContactRow({ contact }: { contact: Contact }) {
  const [editing, setEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    async (prev, formData) => {
      const result = await updateContact(contact.id, prev, formData);
      if (result.ok) setEditing(false);
      return result;
    },
    null
  );

  function handleDelete() {
    if (!confirm(`${contact.name} 연락처를 삭제할까요?`)) return;
    setDeleteError(null);
    startDelete(async () => {
      const result = await deleteContact(contact.id);
      if (!result.ok) setDeleteError(result.error);
    });
  }

  if (editing) {
    return (
      <li className="p-4 sm:p-5">
        <form action={formAction} className="space-y-4">
          <ContactFields contact={contact} />
          {state && !state.ok && <p className="text-sm text-danger">{state.error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "저장 중" : "저장"}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-semibold">{contact.name}</span>
          <a href={`tel:${contact.phone}`} className="font-mono text-sm text-accent hover:underline">
            {formatPhone(contact.phone)}
          </a>
        </div>
        {(contact.email || contact.memo) && (
          <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="truncate hover:underline">
                {contact.email}
              </a>
            )}
            {contact.memo && <span className="truncate">{contact.memo}</span>}
          </div>
        )}
        {deleteError && <p className="mt-1 text-sm text-danger">{deleteError}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-background"
        >
          수정
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-lg border border-danger/40 px-3 py-1.5 text-sm text-danger hover:bg-danger/10 disabled:opacity-50"
        >
          {isDeleting ? "삭제 중" : "삭제"}
        </button>
      </div>
    </li>
  );
}
