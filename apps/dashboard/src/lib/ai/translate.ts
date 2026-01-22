import { translate } from "@vitalets/google-translate-api";

export async function translateErrorMessage(message: string, locale: string) {
  if (locale === "en") return message;

  try {
    const translated = await translate(message, {
      from: "en",
      to: locale,
    });

    return translated.text;
  } catch (err) {
    console.error("Translation error:", err);
    return message;
  }
}
