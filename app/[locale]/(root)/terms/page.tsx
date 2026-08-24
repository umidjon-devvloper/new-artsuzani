import type { Metadata } from "next";
import LegalPage from "@/components/shared/legal-page";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: "Terms of Service",
    description: "The terms and conditions for using the Artsuzani website and buying our products.",
    alternates: { canonical: absoluteUrl(locale, "/terms") },
  };
}

/* DIQQAT: matn NAMUNA — huquqshunos ko'rigidan o'tgan haqiqiy matn bilan almashtiriladi. */
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Please read these terms carefully before using our website or placing an order."
      updated="Placeholder date"
      sections={[
        {
          heading: "Using our website",
          body: [
            "Placeholder text. By accessing this website you agree to these terms. If you do not agree, please do not use the site.",
          ],
        },
        {
          heading: "Products & pricing",
          body: [
            "Placeholder text. All products are handmade, so colours and patterns may vary slightly. Prices are shown in USD and may change without notice.",
          ],
        },
        {
          heading: "Orders",
          body: [
            "Placeholder text. Placing an order is an offer to buy. We reserve the right to accept or decline any order.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "Placeholder text. All content, images, and designs on this site belong to Artsuzani and may not be reproduced without permission.",
          ],
        },
      ]}
    />
  );
}
