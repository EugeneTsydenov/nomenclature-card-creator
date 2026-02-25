import { FormValues } from "./schema";

export interface NomenclaturePayload {
  name: string;
  type: string;
  description_short?: string;
  description_long?: string;
  code?: string;
  unit?: number;
  category?: number;
  cashback_type?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  global_category_id?: number;
  marketplace_price?: number;
  chatting_percent?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export function buildPayload(
  data: FormValues,
  keywords: string[]
): NomenclaturePayload {
  return {
    name: data.name,
    type: data.type,
    description_short: data.description_short || undefined,
    description_long: data.description_long || undefined,
    code: data.code || undefined,
    unit: data.unit ? Number(data.unit) : undefined,
    category: data.category ? Number(data.category) : undefined,
    global_category_id: data.global_category_id
      ? Number(data.global_category_id)
      : undefined,
    chatting_percent: data.chatting_percent
      ? Number(data.chatting_percent)
      : undefined,
    cashback_type: data.cashback_type || undefined,
    seo_title: data.seo_title || undefined,
    seo_description: data.seo_description || undefined,
    seo_keywords: keywords,
    marketplace_price: data.marketplace_price
      ? Number(data.marketplace_price)
      : undefined,
    address: data.address || undefined,
    latitude: data.latitude ? Number(data.latitude) : undefined,
    longitude: data.longitude ? Number(data.longitude) : undefined,
  };
}

export async function createNomenclature(
  payload: NomenclaturePayload
): Promise<void> {
  const res = await fetch("/api/nomenclature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([payload]),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
}
