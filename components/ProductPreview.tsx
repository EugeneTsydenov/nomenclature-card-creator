"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Star, ShoppingCart, Heart, Share2, Tag, Package, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UNIT_LABELS, CASHBACK_LABELS, TYPE_LABELS } from "@/model/consts";

interface ProductPreviewProps {
  name?: string;
  descriptionShort?: string;
  descriptionLong?: string;
  marketplacePrice?: number | string;
  category?: string;
  code?: string;
  cashbackType?: string;
  chattingPercent?: number | string;
  type?: string;
  unit?: string;
  imageUrl?: string | null;
}

export function ProductPreview({
  name,
  descriptionShort,
  descriptionLong,
  marketplacePrice,
  category,
  code,
  cashbackType, 
  chattingPercent,
  type,
  unit,
  imageUrl,
}: ProductPreviewProps) {
  const isEmpty = !name && !marketplacePrice && !descriptionShort;

  return (
    <div className="flex flex-col gap-3 max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Предпросмотр карточки</p>
        {!isEmpty && (
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        )}
      </div>

      <Card className="overflow-hidden border shadow-sm">
        <div className="relative bg-muted h-56 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt="Фото товара" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="w-10 h-10 opacity-30" />
              <span className="text-xs opacity-40">Фото товара</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {type && (
              <Badge className="text-xs px-2 py-0.5 bg-primary text-primary-foreground">
                {TYPE_LABELS[type] ?? type}
              </Badge>
            )}
            {cashbackType && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {CASHBACK_LABELS[cashbackType] ?? cashbackType}
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <button className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-background transition-colors">
              <Heart className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-background transition-colors">
              <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-snug text-foreground line-clamp-2">
              {name || <span className="text-muted-foreground font-normal italic">Название товара</span>}
            </h3>
            <div className="shrink-0 text-right">
              <p className="font-bold text-lg text-foreground leading-none">
                {marketplacePrice ? `${Number(marketplacePrice).toLocaleString("ru-RU")} ₽` : (
                  <span className="text-muted-foreground font-normal text-sm italic">Цена</span>
                )}
              </p>
              {chattingPercent && Number(chattingPercent) > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">{chattingPercent}% комиссия</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">4.0 · 0 отзывов</span>
          </div>
          <Separator />
          {descriptionShort ? (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {descriptionShort}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/40 italic">Краткое описание появится здесь...</p>
          )}
          {descriptionLong && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 border-l-2 border-border pl-3 whitespace-pre-wrap break-words">
              {descriptionLong}
            </p>
          )}

          <Separator />
          <div className="flex flex-col gap-1.5">
            {code && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="w-3.5 h-3.5 shrink-0" />
                <span>Артикул: <span className="font-mono text-foreground">{code}</span></span>
              </div>
            )}
            {category && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span>Категория: <span className="text-foreground">{category}</span></span>
              </div>
            )}
            {unit && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Ruler className="w-3.5 h-3.5 shrink-0" />
                <span>Ед. измерения: <span className="text-foreground">{UNIT_LABELS[unit] ?? unit}</span></span>
              </div>
            )}
          </div>
          <Button className="w-full mt-1 gap-2" disabled>
            <ShoppingCart className="w-4 h-4" />
            В корзину
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}