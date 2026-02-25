"use client";

interface CardCompletenessProps {
  name?: string;
  marketplacePrice?: number | string;
  descriptionShort?: string;
  descriptionLong?: string;
  code?: string;
  category?: string;
}

const FIELDS = [
  { label: "Название", key: "name" as const },
  { label: "Цена", key: "marketplacePrice" as const },
  { label: "Кр. описание", key: "descriptionShort" as const },
  { label: "Подр. описание", key: "descriptionLong" as const },
  { label: "Артикул", key: "code" as const },
  { label: "Категория", key: "category" as const },
];

export function CardCompleteness(props: CardCompletenessProps) {
  const filled = FIELDS.filter((f) => Boolean(props[f.key])).length;
  const percent = Math.round((filled / FIELDS.length) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Заполненность карточки</span>
        <span className="font-medium text-foreground">{percent}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-1 mt-0.5">
        {FIELDS.map(({ label, key }) => (
          <span
            key={label}
            className={`text-xs px-1.5 py-0.5 rounded-md ${
              props[key]
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground/50"
            }`}
          >
            {props[key] ? "✓" : "·"} {label}
          </span>
        ))}
      </div>
    </div>
  );
}
