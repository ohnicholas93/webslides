import { randomUUID } from "node:crypto";
import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import {
  createDefaultMetadata,
  normalizeMetadata,
  type PresentationMetadata,
} from "@/lib/presentation-metadata";

const notesFilePath = path.join(process.cwd(), "public", "notes.json");

async function readNotesFile() {
  const fallback = createDefaultMetadata();

  try {
    const raw = await readFile(notesFilePath, "utf8");
    return normalizeMetadata(JSON.parse(raw), fallback);
  } catch {
    return fallback;
  }
}

async function writeNotesFile(metadata: PresentationMetadata) {
  const next = normalizeMetadata(metadata);
  const tempFilePath = `${notesFilePath}.${randomUUID()}.tmp`;

  try {
    await writeFile(tempFilePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    await rename(tempFilePath, notesFilePath);
  } finally {
    await unlink(tempFilePath).catch(() => {});
  }

  return next;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const metadata = await readNotesFile();
  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const metadata = normalizeMetadata(body);
    const saved = await writeNotesFile(metadata);

    return NextResponse.json(saved, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to save presenter notes." },
      { status: 400 }
    );
  }
}
