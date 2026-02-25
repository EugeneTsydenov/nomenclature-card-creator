"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

import { FormValues } from "@/model/schema";

interface SeoTabProps {
  form: UseFormReturn<FormValues>;
  seoTitleLen: number;
  seoDescLen: number;
  keywords: string[];
  kwInput: string;
  setKwInput: (v: string) => void;
  addKeyword: () => void;
  removeKeyword: (kw: string) => void;
  aiLoading: Record<string, boolean>;
  onGenerateSEO: () => void;
}

export function SeoTab({
  form,
  seoTitleLen,
  seoDescLen,
  keywords,
  kwInput,
  setKwInput,
  addKeyword,
  removeKeyword,
  aiLoading,
  onGenerateSEO,
}: SeoTabProps) {
  return (
    <div className="flex flex-col gap-5 mt-5">
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={aiLoading.seo}
        onClick={onGenerateSEO}
      >
        {aiLoading.seo ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        Сгенерировать SEO
      </Button>
      <div className="flex flex-col gap-1.5">
        <Label>SEO заголовок</Label>
        <Input
          placeholder="SEO заголовок..."
          {...form.register("seo_title")}
        />
        <p
          className={`text-xs text-right ${
            seoTitleLen > 60 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {seoTitleLen}/60
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>SEO описание</Label>
        <Textarea
          placeholder="SEO описание..."
          rows={3}
          {...form.register("seo_description")}
        />
        <p
          className={`text-xs text-right ${
            seoDescLen > 160 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {seoDescLen}/160
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>SEO ключевые слова</Label>
        <div className="flex gap-2">
          <Input
            value={kwInput}
            onChange={(e) => setKwInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addKeyword())
            }
            placeholder="Добавить ключевое слово..."
          />
          <Button type="button" variant="outline" onClick={addKeyword}>
            +
          </Button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="gap-1">
                {kw}
                <button
                  type="button"
                  onClick={() => removeKeyword(kw)}
                  className="hover:text-destructive transition-colors"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
