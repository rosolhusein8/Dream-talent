/*
 * Fil: app/api/contact/route.ts
 * Syfte: API för kontakt- och företagsformulär.
 * Vad koden gör: Validerar inkommande data och returnerar svar till frontend.
 * Lär dig: Studera hur olika formulärtyper kan dela samma endpoint.
 * Felsökning: Kontrollera vilken validator som körs och vilket payload-format som skickas in.
 */
import { NextResponse } from "next/server";
import { validateCompanyContact } from "@/lib/companyContactValidation";
import { validateContactForm } from "@/lib/contactValidation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ogiltig data." }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;

  const formType = raw.formType === "company" ? "company" : "simple";

  if (formType === "company") {
    const companyName = typeof raw.companyName === "string" ? raw.companyName : "";
    const contactPerson = typeof raw.contactPerson === "string" ? raw.contactPerson : "";
    const email = typeof raw.email === "string" ? raw.email : "";
    const phone = typeof raw.phone === "string" ? raw.phone : "";
    const needs = typeof raw.needs === "string" ? raw.needs : "";
    const industry =
      typeof raw.industry === "string" && raw.industry.length > 0 ? raw.industry : undefined;

    const errors = validateCompanyContact(companyName, contactPerson, email, phone, needs);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validering misslyckades", errors }, { status: 400 });
    }

    console.log("[contact company]", {
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      email: email.trim(),
      phone: phone.trim(),
      industry,
      needs: needs.trim(),
    });
    return NextResponse.json({ ok: true });
  }

  const name = typeof raw.name === "string" ? raw.name : "";
  const email = typeof raw.email === "string" ? raw.email : "";
  const message = typeof raw.message === "string" ? raw.message : "";
  const errors = validateContactForm(name, email, message);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validering misslyckades", errors }, { status: 400 });
  }

  console.log("[contact]", { name: name.trim(), email: email.trim(), message: message.trim() });
  return NextResponse.json({ ok: true });
}
