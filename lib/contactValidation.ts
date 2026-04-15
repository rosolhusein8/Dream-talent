export type ContactFormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function validateContactForm(name: string, email: string, message: string): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  if (trimmedName.length < 2) {
    errors.name = "Namn måste vara minst 2 tecken.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    errors.email = "Ange en giltig e-postadress.";
  }

  if (trimmedMessage.length < 10) {
    errors.message = "Meddelandet måste vara minst 10 tecken.";
  }

  return errors;
}
