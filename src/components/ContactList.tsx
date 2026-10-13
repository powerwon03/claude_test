import type { Contact } from "@/lib/types";
import { ContactRow } from "@/components/ContactRow";

export function ContactList({ contacts, query }: { contacts: Contact[]; query: string }) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
        {query
          ? `"${query}"에 해당하는 연락처가 없습니다.`
          : "아직 저장된 연락처가 없습니다. 위에서 추가해 보세요."}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {contacts.map((c) => (
        <ContactRow key={c.id} contact={c} />
      ))}
    </ul>
  );
}
