import { getSupabase } from "@/lib/supabase";
import type { Contact } from "@/lib/types";
import { ContactForm } from "@/components/ContactForm";
import { ContactList } from "@/components/ContactList";
import { SearchBox } from "@/components/SearchBox";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

async function fetchContacts(q: string): Promise<{ contacts: Contact[]; error: string | null }> {
  let supabase;
  try {
    supabase = getSupabase();
  } catch (e) {
    return { contacts: [], error: (e as Error).message };
  }

  let query = supabase.from("contacts").select("*").order("name", { ascending: true });
  if (q) {
    const safe = q.replace(/[,().%]/g, " ").trim();
    const digits = q.replace(/\D/g, "");
    const parts = [`name.ilike.%${safe}%`, `email.ilike.%${safe}%`, `memo.ilike.%${safe}%`];
    if (digits) parts.push(`phone.ilike.%${digits}%`);
    query = query.or(parts.join(","));
  }

  const { data, error } = await query;
  if (error) return { contacts: [], error: error.message };
  return { contacts: (data ?? []) as Contact[], error: null };
}

export default async function Home({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const { contacts, error } = await fetchContacts(q.trim());

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">전화번호부</h1>
        <p className="mt-1 text-sm text-muted">연락처를 추가하고 검색하고 수정할 수 있습니다.</p>
      </header>

      <section className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold">새 연락처</h2>
        <ContactForm />
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold">
            연락처 <span className="text-muted">({contacts.length})</span>
          </h2>
          <SearchBox initialQuery={q} />
        </div>

        {error ? (
          <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
            데이터를 불러오지 못했습니다: {error}
          </div>
        ) : (
          <ContactList contacts={contacts} query={q} />
        )}
      </section>
    </main>
  );
}
