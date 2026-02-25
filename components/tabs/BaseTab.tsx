"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, X, Sparkles, Loader2 } from "lucide-react";

import { FormValues } from "@/model/schema";
import { CATEGORY_OPTIONS } from "@/model/consts";

interface BaseTabProps {
  form: UseFormReturn<FormValues>;
  imageUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  aiLoading: Record<string, boolean>;
  onPrettify: (field: "description_short" | "description_long") => void;
}

export function BaseTab({
  form,
  imageUrl,
  onImageChange,
  onImageRemove,
  aiLoading,
  onPrettify,
}: BaseTabProps) {
  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="flex flex-col gap-1.5">
        <Label>Фото товара</Label>
        {imageUrl ? (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
            <img
              src={imageUrl}
              alt="Превью товара"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-7 h-7"
              onClick={onImageRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted/30">
            <ImagePlus className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <span className="text-sm text-muted-foreground">Нажмите для загрузки</span>
            <span className="text-xs text-muted-foreground/50 mt-0.5">PNG, JPG, WebP</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Название *</Label>
        <Input
          placeholder="Введите название товара"
          {...form.register("name")}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Артикул</Label>
        <Input placeholder="SKU-001" {...form.register("code")} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Единица</Label>
          <Select
            defaultValue="116"
            onValueChange={(v) => form.setValue("unit", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="116">шт.</SelectItem>
              <SelectItem value="117">кг</SelectItem>
              <SelectItem value="118">л</SelectItem>
              <SelectItem value="119">м</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Тип</Label>
          <Select
            defaultValue="product"
            onValueChange={(v) => form.setValue("type", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Товар</SelectItem>
              <SelectItem value="service">Услуга</SelectItem>
              <SelectItem value="digital">Цифровой товар</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Категория</Label>
          <Select
            defaultValue="2477"
            onValueChange={(v) => form.setValue("category", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Краткое описание</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            disabled={!form.getValues("description_short") || aiLoading.description_short}
            onClick={() => onPrettify("description_short")}
          >
            {aiLoading.description_short ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            Улучшить
          </Button>
        </div>
        <Textarea
          placeholder="1-2 предложения о товаре..."
          rows={3}
          {...form.register("description_short")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Подробное описание</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1"
            disabled={!form.getValues("description_long") || aiLoading.description_long}
            onClick={() => onPrettify("description_long")}
          >
            {aiLoading.description_long ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            Улучшить
          </Button>
        </div>
        <Textarea
          placeholder="Подробное описание, преимущества..."
          rows={5}
          {...form.register("description_long")}
        />
      </div>
    </div>
  );
}
