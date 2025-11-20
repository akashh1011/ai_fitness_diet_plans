
import { NextResponse } from "next/server";

type ImageType = "exercise" | "meal";

interface ImageRequestBody {
  label: string;
  type: ImageType;
}

export async function POST(req: Request) {
  const { label, type } = (await req.json()) as ImageRequestBody;

  const query = encodeURIComponent(`${type} ${label}`);
  const url = `https://source.unsplash.com/featured/512x512/?${query}`;

  return NextResponse.json({ url }, { status: 200 });
}
