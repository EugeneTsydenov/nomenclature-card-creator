"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { schema, FormValues } from "@/model/schema";
import { buildPayload, createNomenclature } from "@/model/api";
import { CATEGORY_OPTIONS } from "@/model/consts";
import {
    generateAllFields,
    generateSEO as generateSEOService,
    prettifyText as prettifyTextService,
} from "@/model/ai";

export type SubmitStatus = "idle" | "loading" | "success" | "error";

const STORAGE_KEY = "nomenclature_draft";
const SAVE_DELAY = 500;

interface DraftState {
    fields: Partial<FormValues>;
    keywords: string[];
}

function loadDraft(): DraftState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveDraft(fields: Partial<FormValues>, keywords: string[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fields, keywords }));
}

function clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
}

const CATEGORY_NAME_TO_ID: Record<string, string> = {
    Электроника: "2477",
    Одежда: "2478",
    "Дом и сад": "2479",
    Спорт: "2480",
    Красота: "2481",
};

const UNIT_NAME_TO_ID: Record<string, string> = {
    "шт.": "116",
    "кг": "117",
    "л": "118",
    "м": "119",
};

const GLOBAL_CATEGORY_NAME_TO_ID: Record<string, string> = {
    "Товары для дома": "127",
    "Электроника и техника": "128",
    "Одежда и обувь": "129",
    "Красота и здоровье": "130",
    "Детские товары": "131",
    "Спорт и отдых": "132",
    "Продукты питания": "133",
    "Автотовары": "134",
    "Цифровые товары": "135",
    "Услуги": "136",
};

const DEFAULT_VALUES: FormValues = {
    name: "",
    type: "product",
    description_short: "",
    description_long: "",
    code: "",
    unit: "116",
    category: "2477",
    cashback_type: "lcard_cashback",
    marketplace_price: "",
    chatting_percent: "4",
    global_category_id: "127",
    seo_title: "",
    seo_description: "",
    address: "",
    latitude: "",
    longitude: "",
};

export function useProductForm() {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [kwInput, setKwInput] = useState("");
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});
    const draftLoaded = useRef(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: DEFAULT_VALUES,
    });

    const values = useWatch({ control: form.control });

    useEffect(() => {
        if (draftLoaded.current) return;
        draftLoaded.current = true;
        const draft = loadDraft();
        if (!draft) return;
        if (draft.fields) {
            const merged = { ...DEFAULT_VALUES, ...draft.fields };
            Object.keys(merged).forEach((key) => {
                const k = key as keyof FormValues;
                const v = merged[k];
                if (v === undefined || v === null) {
                    merged[k] = DEFAULT_VALUES[k] ?? "";
                } else {
                    merged[k] = String(v);
                }
            });
            form.reset(merged);
            setTimeout(() => form.trigger(), 0);
        }
        if (draft.keywords?.length) setKeywords(draft.keywords);
    }, [form]);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            saveDraft(values as Partial<FormValues>, keywords);
        }, SAVE_DELAY);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [values, keywords]);

    const categoryLabel =
        CATEGORY_OPTIONS.find((c) => c.value === values.category)?.label;

    const seoTitleLen = values.seo_title?.length ?? 0;
    const seoDescLen = values.seo_description?.length ?? 0;

    const addKeyword = () => {
        const kw = kwInput.trim();
        if (kw && !keywords.includes(kw)) {
            setKeywords((p) => [...p, kw]);
            setKwInput("");
        }
    };

    const removeKeyword = (keyword: string) => {
        setKeywords((p) => p.filter((k) => k !== keyword));
    };

    const onSubmit = async (data: FormValues) => {
        setStatus("loading");
        setErrorMsg("");
        try {
            const payload = buildPayload(data, keywords);
            await createNomenclature(payload);
            clearDraft();
            setStatus("success");
        } catch (e: unknown) {
            setStatus("error");
            setErrorMsg(e instanceof Error ? e.message : "Неизвестная ошибка");
        }
    };

    const onValidationError = (errors: Record<string, unknown>) => {
        const fields = Object.keys(errors).join(", ");
        setStatus("error");
        setErrorMsg(`Ошибка валидации: ${fields}`);
    };

    const clearForm = useCallback(() => {
        form.reset(DEFAULT_VALUES);
        setKeywords([]);
        setKwInput("");
        setStatus("idle");
        setErrorMsg("");
        clearDraft();
    }, [form]);

    const setAi = (key: string, v: boolean) =>
        setAiLoading((p) => ({ ...p, [key]: v }));

    const generateAll = useCallback(async () => {
        const name = form.getValues("name");
        if (!name) return;
        setAi("all", true);
        try {
            const r = await generateAllFields(name);
            if (r.description_short) form.setValue("description_short", r.description_short);
            if (r.description_long) form.setValue("description_long", r.description_long);
            if (r.code) form.setValue("code", r.code);
            if (r.marketplace_price) form.setValue("marketplace_price", String(r.marketplace_price));
            if (r.seo_title) form.setValue("seo_title", r.seo_title);
            if (r.seo_description) form.setValue("seo_description", r.seo_description);
            if (r.seo_keywords) setKeywords(r.seo_keywords);
            if (r.category_name && CATEGORY_NAME_TO_ID[r.category_name]) {
                form.setValue("category", CATEGORY_NAME_TO_ID[r.category_name]);
            }
            if (r.unit_name && UNIT_NAME_TO_ID[r.unit_name]) {
                form.setValue("unit", UNIT_NAME_TO_ID[r.unit_name]);
            }
            if (r.global_category_name && GLOBAL_CATEGORY_NAME_TO_ID[r.global_category_name]) {
                form.setValue("global_category_id", GLOBAL_CATEGORY_NAME_TO_ID[r.global_category_name]);
            }
        } finally {
            setAi("all", false);
        }
    }, [form]);

    const generateSEO = useCallback(async () => {
        const name = form.getValues("name");
        const desc = form.getValues("description_short") || "";
        if (!name) return;
        setAi("seo", true);
        try {
            const r = await generateSEOService(name, desc);
            if (r.seo_title) form.setValue("seo_title", r.seo_title);
            if (r.seo_description) form.setValue("seo_description", r.seo_description);
            if (r.seo_keywords) setKeywords(r.seo_keywords);
        } finally {
            setAi("seo", false);
        }
    }, [form]);

    const prettify = useCallback(
        async (field: "description_short" | "description_long") => {
            const text = form.getValues(field);
            if (!text) return;
            setAi(field, true);
            try {
                const result = await prettifyTextService(text);
                form.setValue(field, result);
            } finally {
                setAi(field, false);
            }
        },
        [form]
    );

    return {
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
    };
}
