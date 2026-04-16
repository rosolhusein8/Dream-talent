/*
 * Fil: app/api/apply/route.ts
 * Syfte: API för jobbansökningar.
 * Vad koden gör: Tar emot formulärdata, validerar CV-fil och sparar filen lokalt.
 * Lär dig: Bra exempel på multipart/form-data i Next.js.
 * Felsökning: Kontrollera formData-fält, filtyp/storlek och sökvägen till uploads.
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
  // Läs inkommande multipart-formulär från jobbsidan.
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ogiltig formulärdata." }, { status: 400 });
  }

  const jobSlug = String(formData.get("jobSlug") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const cv = formData.get("cv");

  // Grundvalidering av fält innan vi försöker spara filen.
  if (!jobSlug || !jobTitle || !name || !email || !phone) {
    return NextResponse.json({ error: "Fyll i alla obligatoriska fält." }, { status: 400 });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Ange en giltig e-postadress." }, { status: 400 });
  }

  if (!(cv instanceof File)) {
    return NextResponse.json({ error: "Ladda upp ett CV." }, { status: 400 });
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

  const buffer = Buffer.from(await cv.arrayBuffer());
  const safeName = sanitizeFilename(cv.name);
  const storedFileName = `${Date.now()}-${safeName}`;
  const relativeUploadDir = path.join("uploads", "cv");
  const absoluteUploadDir = path.join(process.cwd(), "public", relativeUploadDir);
  const absolutePath = path.join(absoluteUploadDir, storedFileName);

  // Själva filsparningen sker lokalt i public/uploads/cv.
  await mkdir(absoluteUploadDir, { recursive: true });
  await writeFile(absolutePath, buffer);

  const cvFilePath = `/${relativeUploadDir.replaceAll(path.sep, "/")}/${storedFileName}`;

  console.log("[apply]", {
    jobSlug,
    jobTitle,
    name,
    email,
    phone,
    message,
    cvFileName: storedFileName,
    cvFilePath,
    createdAt: new Date().toISOString(),
    status: "Ny",
  });

  return NextResponse.json({ ok: true, cvFileName: storedFileName, cvFilePath });
}
