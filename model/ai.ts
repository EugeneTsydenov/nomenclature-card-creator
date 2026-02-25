async function callAI(prompt: string): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "AI request failed");
  }

  const text = data.choices?.[0]?.message?.content || "";
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

export interface GeneratedFields {
  description_short?: string;
  description_long?: string;
  code?: string;
  marketplace_price?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  category_name?: string;
  unit_name?: string;
  global_category_name?: string;
}

export interface GeneratedSEO {
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
}

function parseJSON<T>(text: string): T {
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function generateAllFields(name: string): Promise<GeneratedFields> {
  const text = await callAI(
    `Ты помогаешь заполнить карточку товара для маркетплейса.
Товар: "${name}"
Ответь строго в формате JSON без markdown:
{
  "description_short": "краткое описание 1-2 предложения",
  "description_long": "подробное описание 3-5 предложений с преимуществами",
  "code": "артикул из букв и цифр",
  "marketplace_price": "рекомендуемая рыночная цена в рублях, только число",
  "seo_title": "SEO заголовок, СТРОГО не более 60 символов",
  "seo_description": "SEO описание, СТРОГО от 150 до 160 символов",
  "seo_keywords": ["ключ1", "ключ2", "ключ3", "ключ4", "ключ5"],
  "category_name": "подходящая категория из: Электроника, Одежда, Дом и сад, Спорт, Красота",
  "unit_name": "единица измерения из: шт., кг, л, м",
  "global_category_name": "глобальная категория из: Товары для дома, Электроника и техника, Одежда и обувь, Красота и здоровье, Детские товары, Спорт и отдых, Продукты питания, Автотовары, Цифровые товары, Услуги"
}`
  );
  return parseJSON<GeneratedFields>(text);
}

export async function generateSEO(
  name: string,
  descriptionShort: string
): Promise<GeneratedSEO> {
  const text = await callAI(
    `Сгенерируй SEO для товара "${name}".
Краткое описание: "${descriptionShort}"
ВАЖНО: seo_title СТРОГО не более 60 символов, seo_description СТРОГО от 150 до 160 символов.
Формат JSON без markdown:
{
  "seo_title": "...",
  "seo_description": "...",
  "seo_keywords": ["...","...","...","...","..."]
}`
  );
  return parseJSON<GeneratedSEO>(text);
}

export async function prettifyText(text: string): Promise<string> {
  const result = await callAI(
    `Улучши этот текст для карточки товара. Сделай его более привлекательным и читабельным. Верни только текст без кавычек и markdown:\n\n${text}`
  );
  return result.trim();
}
