import { NextResponse } from 'next/server';

const COUNTIES_URL = 'https://api.openadmindata.org/api/v1/ke/county.json';

export async function GET() {
  const res = await fetch(COUNTIES_URL, { next: { revalidate: 86400 } }).catch(
    () => null,
  );
  if (!res?.ok) {
    return NextResponse.json(
      { error: 'Could not load counties.' },
      { status: 502 },
    );
  }
  const body = (await res.json().catch(() => null)) as {
    entities?: { name_en?: string }[];
  } | null;
  const counties = (body?.entities ?? [])
    .map((county) => county.name_en?.trim())
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b));
  if (counties.length !== 47) {
    return NextResponse.json(
      { error: 'Could not load counties.' },
      { status: 502 },
    );
  }
  return NextResponse.json({ counties });
}
