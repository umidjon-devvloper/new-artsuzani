import type { Metadata } from "next";
import LegalPage from "@/components/shared/legal-page";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: "Returns & Exchanges",
    description:
      "Artsuzani returns and exchanges policy for handmade Suzani embroidery.",
    alternates: { canonical: absoluteUrl(locale, "/returns") },
  };
}

/* DIQQAT: matn NAMUNA — haqiqiy siyosat bilan almashtiriladi. */
export default function ReturnsPage() {
  return (
    <LegalPage
      title="Returns & Exchanges"
      description="Your satisfaction matters to us. Here is how returns and exchanges work."
      updated="Placeholder date"
      sections={[
        {
          heading: "Our promise",
          body: [
            "Placeholder text. Each Suzani is handmade, so slight variations are part of its charm. If something is not right, we are here to help.",
          ],
        },
        {
          heading: "Return window",
          body: [
            "Placeholder text. You may request a return or exchange within 14 days of receiving your order, provided the item is unused and in its original condition.",
          ],
        },
        {
          heading: "How to start a return",
          body: [
            "Placeholder text. Contact us on WhatsApp with your order number and reason. We will guide you through the next steps.",
          ],
        },
        {
          heading: "Refunds",
          body: [
            "Placeholder text. Once your returned item is received and inspected, we will process your refund. Return shipping costs may apply.",
          ],
        },
      ]}
    />
  );
}
