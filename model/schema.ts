import z from "zod";

export const schema = z.object({
  name: z.string().min(1, "Введите название"),
  type: z.string().min(1, "Выберите тип"),
  description_short: z.string().optional(),
  description_long: z.string().optional(),
  code: z.string().optional(),
  unit: z.string().optional(),
  category: z.string().optional(),
  global_category_id: z.string().optional(),
  cashback_type: z.string().optional(),
  marketplace_price: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  chatting_percent: z.string().optional(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;