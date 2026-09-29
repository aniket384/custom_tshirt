/**
 * Policy page copy.
 *
 * IMPORTANT: The business has not yet confirmed shipping timelines, return
 * windows, refund methods or legal entity details. Sections marked
 * `placeholder: true` MUST be reviewed (ideally by a legal professional)
 * and replaced before launch. Nothing here invents specific commitments.
 */
import type { ContentSection } from "@/components/layout/ContentPage";

export const POLICY_LAST_UPDATED = "Draft — not yet published";

export const shippingPolicy: ContentSection[] = [
  { heading: "Where we deliver", paragraphs: ["We deliver across India. You can check delivery availability for your pincode on any product page."] },
  { heading: "Processing time", placeholder: true, paragraphs: ["Custom-printed items are made to order. Processing times for ready and custom items will be listed here once confirmed."] },
  { heading: "Delivery timelines & charges", placeholder: true, paragraphs: ["Delivery timelines and shipping charges depend on your location and will be shown at checkout once shipping partners are connected."] },
  { heading: "Tracking your order", paragraphs: ["Once your order ships, you can follow its progress on the Track Order page using your order ID and the phone number or email used at checkout."] },
];

export const returnsPolicy: ContentSection[] = [
  { heading: "Custom-printed products", placeholder: true, paragraphs: ["Custom items are printed specifically for you. The conditions under which custom items can be returned, replaced or refunded (for example printing defects or damage in transit) will be confirmed here."] },
  { heading: "Ready-to-wear products", placeholder: true, paragraphs: ["The return / exchange window and conditions for non-custom products will be confirmed here."] },
  { heading: "Damaged or incorrect items", placeholder: true, paragraphs: ["The process for reporting a damaged or incorrect item (what to share and how soon) will be listed here."] },
  { heading: "Refunds", placeholder: true, paragraphs: ["Refund methods and timelines will be confirmed once payments are live."] },
];

export const privacyPolicy: ContentSection[] = [
  { heading: "Overview", placeholder: true, paragraphs: ["This page will explain what personal information we collect, why, and how it is protected. Have it reviewed for compliance with applicable Indian law (including the Digital Personal Data Protection Act, 2023) before launch."] },
  { heading: "What this prototype stores", paragraphs: ["This prototype stores your cart, wishlist, recently viewed items, demo profile and demo orders only in your own browser (localStorage). Uploaded designs are previewed locally and are not sent to any server."] },
  { heading: "Information we will collect", placeholder: true, list: ["Contact details (name, email, phone) for orders and support", "Delivery addresses", "Design files you upload for printing", "Order history"] },
  { heading: "Payments", placeholder: true, paragraphs: ["Payments will be processed by a third-party payment provider. We will not store full card details."] },
  { heading: "Contact", placeholder: true, paragraphs: ["Contact details for privacy questions will be added here."] },
];

export const termsPolicy: ContentSection[] = [
  { heading: "About these terms", placeholder: true, paragraphs: ["These terms will govern use of the website and purchases. Replace this draft with reviewed terms before launch."] },
  { heading: "Your designs", placeholder: true, paragraphs: ["By uploading a design you confirm you have the right to use it. We may decline to print content that infringes someone else's rights or is unlawful or offensive."] },
  { heading: "Pricing", paragraphs: ["Prices shown in this prototype are demo prices and do not form an offer."] },
  { heading: "Colour & print accuracy", paragraphs: ["On-screen previews are a guide. Actual print colours and placement can vary slightly depending on your screen and the fabric."] },
];

export const cookiePolicy: ContentSection[] = [
  { heading: "Current use", paragraphs: ["This prototype does not set advertising or analytics cookies. It uses your browser's local storage to remember your cart, wishlist and preferences."] },
  { heading: "Future analytics", placeholder: true, paragraphs: ["If analytics or marketing tools are added, this page will list them, and consent will be requested where required."] },
];
