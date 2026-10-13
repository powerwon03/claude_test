import type { Contact } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function ContactFields({ contact }: { contact?: Contact }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">이름 *</span>
        <input
          name="name"
          required
          maxLength={50}
          defaultValue={contact?.name}
          placeholder="홍길동"
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">전화번호 *</span>
        <input
          name="phone"
          type="tel"
          required
          inputMode="tel"
          defaultValue={contact?.phone}
          placeholder="010-1234-5678"
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">이메일</span>
        <input
          name="email"
          type="email"
          defaultValue={contact?.email ?? ""}
          placeholder="hong@example.com"
          className={inputClass}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">메모</span>
        <input
          name="memo"
          maxLength={500}
          defaultValue={contact?.memo ?? ""}
          placeholder="회사, 관계 등"
          className={inputClass}
        />
      </label>
    </div>
  );
}
