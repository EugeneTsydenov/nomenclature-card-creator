"use client";

import { useState } from "react";

import { ProductPreview } from "@/components/ProductPreview";
import { CardCompleteness } from "@/components/CardCompleteness";
import { StatusAlert } from "@/components/StatusAlert";
import { BaseTab } from "@/components/tabs/BaseTab";
import { SeoTab } from "@/components/tabs/SeoTab";
import { PriceTab } from "@/components/tabs/PriceTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductForm } from "@/hooks/useProductForm";
import { X, Sparkles, Loader2 } from "lucide-react";

export default function Home() {
  const {
    form,
    values,
    categoryLabel,
    seoTitleLen,
    seoDescLen,
    keywords,
    kwInput,
    setKwInput,
    addKeyword,
    removeKeyword,
    status,
    errorMsg,
    onSubmit,
    onValidationError,
    aiLoading,
    generateAll,
    generateSEO,
    prettify,
    clearForm,
  } = useProductForm();

  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
  };

  const previewProps = {
    name: values.name,
    descriptionShort: values.description_short,
    descriptionLong: values.description_long,
    category: categoryLabel,
    code: values.code,
    cashbackType: values.cashback_type,
    chattingPercent: values.chatting_percent,
    type: values.type,
    unit: values.unit,
    marketplacePrice: values.marketplace_price,
    imageUrl,
  };

  return (
    <main>
      <div className="container mx-auto px-4 sm:px-10">
        <div className="flex items-center justify-between py-6 border-b border-border gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold">Новый товар</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Заполните карточку товара
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              className="lg:hidden"
              onClick={() => setShowMobilePreview(true)}
            >
              Предпросмотр карточки товара
            </Button>
            <Button
              variant="outline"
              onClick={clearForm}
            >
              Очистить
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit, onValidationError)}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Публикация..." : "Опубликовать"}
            </Button>
          </div>
        </div>

        <StatusAlert status={status} errorMsg={errorMsg} />

        <div className="flex gap-8 items-start py-8">
          <div className="w-full lg:w-1/2">
            <div className="mb-6">
              <CardCompleteness
                name={values.name}
                marketplacePrice={values.marketplace_price}
                descriptionShort={values.description_short}
                descriptionLong={values.description_long}
                code={values.code}
                category={categoryLabel}
              />
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground flex-1">
                Введите название товара и нажмите кнопку — ИИ заполнит все поля
              </p>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={!values.name || aiLoading.all}
                onClick={generateAll}
              >
                {aiLoading.all ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-1.5" />
                )}
                Заполнить всё
              </Button>
            </div>

            <Tabs defaultValue="base" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="base">
                  Основное
                </TabsTrigger>
                <TabsTrigger className="w-full" value="seo">
                  SEO
                </TabsTrigger>
                <TabsTrigger className="w-full" value="price">
                  Цены и доп.
                </TabsTrigger>
              </TabsList>

              <TabsContent value="base">
                <BaseTab
                  form={form}
                  imageUrl={imageUrl}
                  onImageChange={handleImageChange}
                  onImageRemove={removeImage}
                  aiLoading={aiLoading}
                  onPrettify={prettify}
                />
              </TabsContent>

              <TabsContent value="seo">
                <SeoTab
                  form={form}
                  seoTitleLen={seoTitleLen}
                  seoDescLen={seoDescLen}
                  keywords={keywords}
                  kwInput={kwInput}
                  setKwInput={setKwInput}
                  addKeyword={addKeyword}
                  removeKeyword={removeKeyword}
                  aiLoading={aiLoading}
                  onGenerateSEO={generateSEO}
                />
              </TabsContent>

              <TabsContent value="price">
                <PriceTab form={form} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden lg:block lg:w-1/2 sticky top-8">
            <ProductPreview {...previewProps} />
          </div>
        </div>
      </div>

      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm lg:hidden overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <h2 className="text-lg font-semibold">Предпросмотр</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobilePreview(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="p-4 pb-8">
            <ProductPreview {...previewProps} />
          </div>
        </div>
      )}
    </main>
  );
}