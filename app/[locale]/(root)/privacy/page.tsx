import type { Metadata } from "next";
import LegalPage from "@/components/shared/legal-page";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: "Privacy Policy",
    description: "How Artsuzani collects, uses, and protects your personal data.",
    alternates: { canonical: absoluteUrl(locale, "/privacy") },
  };
}

/* DIQQAT: matn NAMUNA — huquqshunos ko'rigidan o'tgan haqiqiy matn bilan almashtiriladi. */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="We respect your privacy. This page explains what data we collect and why."
      updated="Placeholder date"
      sections={[
        {
          heading: "Information we collect",
          body: [
            "Placeholder text. We collect the information you provide when placing an order or contacting us — such as your name, delivery address, and email.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "Placeholder text. Your data is used only to process orders, deliver products, and respond to your enquiries. We do not sell your data to third parties.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "Placeholder text. We use essential cookies to keep the site working (for example, your cart and language preference).",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Placeholder text. You may request access to, correction of, or deletion of your personal data at any time by contacting us.",
          ],
        },
      ]}
    />
  );
}
