import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = join(process.cwd(), "src/lib/default-preset.json");
    await writeFile(filePath, JSON.stringify(data, null, 2) + "\n");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
