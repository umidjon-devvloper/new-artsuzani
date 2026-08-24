import type { Metadata } from "next";
import LegalPage from "@/components/shared/legal-page";
import { absoluteUrl } from "@/lib/site";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return {
    title: "Shipping Policy",
    description:
      "How Artsuzani ships handmade Suzani worldwide — delivery times, costs, and tracking.",
    alternates: { canonical: absoluteUrl(locale, "/shipping") },
  };
}

/* DIQQAT: matn NAMUNA — haqiqiy siyosat bilan almashtiriladi. */
export default function ShippingPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      description="We ship our handmade Suzani pieces worldwide, carefully packed with love from Bukhara."
      updated="Placeholder date"
      sections={[
        {
          heading: "Worldwide shipping",
          body: [
            "Placeholder text. We ship internationally to most countries. Every order is carefully packaged to protect the handmade embroidery during transit.",
          ],
        },
        {
          heading: "Delivery times",
          body: [
            "Placeholder text. Estimated delivery is typically 7–14 business days depending on your location. You will receive a tracking number once your order ships.",
          ],
        },
        {
          heading: "Shipping costs",
          body: [
            "Placeholder text. Shipping is free on all orders. Any customs duties or import taxes, where applicable, are the responsibility of the recipient.",
          ],
        },
        {
          heading: "Order tracking",
          body: [
            "Placeholder text. Once dispatched, you can track your parcel with the tracking number sent to you. For any questions, contact us on WhatsApp.",
          ],
        },
      ]}
    />
  );
}
