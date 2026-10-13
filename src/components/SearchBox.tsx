"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export function SearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handle = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed === initialQuery.trim()) return;
      startTransition(() => {
        router.replace(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [value, initialQuery, router]);

  return (
    <div className="relative w-full sm:w-72">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="이름, 번호, 이메일, 메모 검색"
        aria-label="연락처 검색"
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">검색중</span>
      )}
    </div>
  );
}
