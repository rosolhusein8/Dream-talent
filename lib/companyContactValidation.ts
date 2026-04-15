export type CompanyContactErrors = {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  needs?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Kräver minst 8 siffror (ignorerar mellanslag och vanliga avgränsare). */
function phoneHasEnoughDigits(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 8;
}

export function validateCompanyContact(
  companyName: string,
  contactPerson: string,
  email: string,
  phone: string,
  needs: string
): CompanyContactErrors {
  const errors: CompanyContactErrors = {};

  if (companyName.trim().length < 2) {
    errors.companyName = "Ange företagsnamn.";
  }

  if (contactPerson.trim().length < 2) {
    errors.contactPerson = "Ange kontaktperson.";
  }

  if (!emailPattern.test(email.trim())) {
    errors.email = "Ange en giltig e-postadress.";
  }

  if (!phoneHasEnoughDigits(phone)) {
    errors.phone = "Ange ett giltigt telefonnummer.";
  }

  if (needs.trim().length < 10) {
    errors.needs = "Beskriv era behov (minst 10 tecken).";
  }

  return errors;
}
