"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { isValidPhone, normalizePhone } from "@/lib/phone";

export type ActionResult = { ok: true } | { ok: false; error: string };

type ContactInput = { name: string; phone: string; email: string | null; memo: string | null };
type Parsed = { error: string; data?: undefined } | { error?: undefined; data: ContactInput };

function parseContact(formData: FormData): Parsed {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const email = String(formData.get("email") ?? "").trim() || null;
  const memo = String(formData.get("memo") ?? "").trim() || null;

  if (!name) return { error: "이름을 입력해 주세요." };
  if (name.length > 50) return { error: "이름은 50자 이내로 입력해 주세요." };
  if (!isValidPhone(phone)) {
    return { error: "전화번호 형식이 올바르지 않습니다. (숫자 8~15자리)" };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "이메일 형식이 올바르지 않습니다." };
  }
  if (memo && memo.length > 500) return { error: "메모는 500자 이내로 입력해 주세요." };

  return { data: { name, phone, email, memo } };
}

export async function addContact(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseContact(formData);
  if (parsed.error !== undefined) return { ok: false, error: parsed.error };

  const { error } = await getSupabase().from("contacts").insert(parsed.data);
  if (error) return { ok: false, error: `저장 실패: ${error.message}` };

  revalidatePath("/");
  return { ok: true };
}

export async function updateContact(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseContact(formData);
  if (parsed.error !== undefined) return { ok: false, error: parsed.error };

  const { error } = await getSupabase().from("contacts").update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: `수정 실패: ${error.message}` };

  revalidatePath("/");
  return { ok: true };
}

export async function deleteContact(id: string): Promise<ActionResult> {
  const { error } = await getSupabase().from("contacts").delete().eq("id", id);
  if (error) return { ok: false, error: `삭제 실패: ${error.message}` };

  revalidatePath("/");
  return { ok: true };
}
