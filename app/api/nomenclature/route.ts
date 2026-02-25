import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://app.tablecrm.com/api/v1/nomenclature/";

export async function POST(req: NextRequest) {
  const token = process.env.TABLECRM_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "TABLECRM_API_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const res = await fetch(`${BASE_URL}?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: text || `HTTP ${res.status}` },
        { status: res.status }
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
