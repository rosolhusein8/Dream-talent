/*
 * Fil: app/api/cv/register/route.ts
 * Syfte: API för CV-registrering.
 * Vad koden gör: Tar emot formulärdata + CV-fil, validerar och sparar filen lokalt.
 * Lär dig: Jämför denna med /api/apply för att se två liknande uppladdningsflöden.
 * Felsökning: Börja med filuppladdning, formData-namn och mappen public/uploads/cv.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Städar filnamn så de blir säkrare att spara på disk.
function sanitizeFilename(name: string) {
  const ext = path.extname(name);
  const base = path.basename(name, ext).replace(/[^a-zA-Z0-9-_]/g, "-");
  return `${base || "cv"}${ext.toLowerCase()}`;
}

export async function POST(request: Request) {
  // Läs inkommande formulär från CV-modalen.
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ogiltig formulärdata." }, { status: 400 });
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const competence = String(formData.get("desiredRole") ?? "").trim();
  const cv = formData.get("cv");

  // Grundvalidering av obligatoriska fält och filen.
  if (!fullName || !email || !phone || !competence) {
    return NextResponse.json({ error: "Fyll i alla obligatoriska fält." }, { status: 400 });
  }
  if (!(cv instanceof File)) {
    return NextResponse.json({ error: "Ladda upp ditt CV." }, { status: 400 });
  }

  const allowedTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  if (!allowedTypes.has(cv.type)) {
    return NextResponse.json({ error: "CV måste vara PDF, DOC eller DOCX." }, { status: 400 });
  }
  if (cv.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "CV-filen är för stor. Max 5 MB." }, { status: 400 });
  }

  const safeName = sanitizeFilename(cv.name);
  const storedFileName = `${Date.now()}-${safeName}`;
  const relativeUploadDir = path.join("uploads", "cv");
  const absoluteUploadDir = path.join(process.cwd(), "public", relativeUploadDir);
  const absolutePath = path.join(absoluteUploadDir, storedFileName);

  // Själva filsparningen sker lokalt i public/uploads/cv.
  await mkdir(absoluteUploadDir, { recursive: true });
  await writeFile(absolutePath, Buffer.from(await cv.arrayBuffer()));

  const cvFilePath = `/${relativeUploadDir.replaceAll(path.sep, "/")}/${storedFileName}`;
  return NextResponse.json({ ok: true, cvFileName: storedFileName, cvFilePath });
}
