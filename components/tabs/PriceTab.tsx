"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressSearch } from "@/components/AddressSearch";

import { FormValues } from "@/model/schema";
import { GLOBAL_CATEGORY_OPTIONS } from "@/model/consts";

interface PriceTabProps {
  form: UseFormReturn<FormValues>;
}

export function PriceTab({ form }: PriceTabProps) {
  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="flex flex-col gap-1.5">
        <Label>Цена (₽)</Label>
        <Input
          inputMode="numeric"
          placeholder="0"
          {...form.register("marketplace_price")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Тип кэшбэка</Label>
        <Select
          defaultValue="lcard_cashback"
          onValueChange={(v) => form.setValue("cashback_type", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lcard_cashback">L-Card кэшбэк</SelectItem>
            <SelectItem value="percent">Процент</SelectItem>
            <SelectItem value="fixed">Фиксированный</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>% комиссии чата</Label>
        <Input
          inputMode="numeric"
          placeholder="4"
          {...form.register("chatting_percent")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Глобальная категория</Label>
        <Select
          defaultValue="127"
          onValueChange={(v) => form.setValue("global_category_id", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent>
            {GLOBAL_CATEGORY_OPTIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Адрес</Label>
        <AddressSearch
          value={form.getValues("address") || ""}
          placeholder="Начните вводить адрес..."
          onChange={(address, lat, lon) => {
            form.setValue("address", address);
            form.setValue("latitude", lat);
            form.setValue("longitude", lon);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Широта</Label>
          <Input
            step="any"
            placeholder="55.771..."
            {...form.register("latitude")}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Долгота</Label>
          <Input
            step="any"
            placeholder="49.102..."
            {...form.register("longitude")}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
