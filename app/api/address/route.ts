import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query?.trim();

    if (!query || query.length < 3) {
      return NextResponse.json({ suggestions: [] });
    }

    const params = new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "5",
    });

    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        "User-Agent": "nomenclature-app/1.0",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Nominatim API error" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const suggestions = (
      data as { display_name: string; lat: string; lon: string }[]
    ).map((item) => ({
      value: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));

    return NextResponse.json({ suggestions });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
