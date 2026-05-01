import React from "react";
import {
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserCheck,
} from "lucide-react";
import { externalLinkProps, storeContact } from "@/config/contact";

const contactDetails = [
  {
    icon: <Phone className="h-5 w-5" />,
    label: "Phone",
    value: storeContact.phoneDisplay,
    href: storeContact.phoneHref,
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    value: storeContact.email,
    href: storeContact.emailHref,
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Store",
    value: storeContact.address,
    href: storeContact.directionsHref,
    external: true,
  },
];

const pageIntro = {
  terms: {
    eyebrow: "Customer terms",
    title: "Terms & Conditions",
    description:
      "Clear rules for ordering, buying, delivery, warranty support, and using Alam Computer's online store.",
    icon: FileText,
  },
  privacy: {
    eyebrow: "Privacy overview",
    title: "Privacy",
    description:
      "A simple overview of how we handle your contact, account, order, and support information.",
    icon: UserCheck,
  },
  privacyPolicy: {
    eyebrow: "Data policy",
    title: "Privacy Policy",
    description:
      "How Alam Computer collects, uses, stores, and protects information when you shop or contact us.",
    icon: ShieldCheck,
  },
  security: {
    eyebrow: "Safe shopping",
    title: "Security",
    description:
      "The steps we take to protect your account, checkout activity, and communication with our store.",
    icon: LockKeyhole,
  },
  faq: {
    eyebrow: "Quick answers",
    title: "FAQs",
    description:
      "Answers to common questions about products, delivery, warranty, payment, and support.",
    icon: HelpCircle,
  },
};

function Hero({ page }) {
  const Icon = page.icon;

  return (
    <section className="relative overflow-hidden bg-red-600 px-4 py-16 text-white md:px-16">
      <div className="absolute right-8 top-8 hidden opacity-10 md:block">
        <Icon size={220} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/15">
          <Icon className="h-8 w-8" />
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-red-100">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-tight md:text-6xl">
          {page.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-red-50 md:text-lg">
          {page.description}
        </p>
      </div>
    </section>
  );
}

function ContactBand() {
  return (
    <section className="bg-gray-900 px-4 py-12 text-white md:px-16">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
        {contactDetails.map((detail) => {
          const ContactItem = detail.href ? "a" : "div";

          return (
            <ContactItem
              key={detail.label}
              href={detail.href}
              className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-5 transition hover:-translate-y-0.5 hover:bg-white/10"
              aria-label={`${detail.label}: ${detail.value}`}
              {...(detail.external ? externalLinkProps : {})}
            >
              <div className="rounded-lg bg-red-600 p-3 text-white">{detail.icon}</div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                  {detail.label}
                </p>
                <p className="mt-1 font-semibold text-white">{detail.value}</p>
              </div>
            </ContactItem>
          );
        })}
      </div>
    </section>
  );
}

function SectionList({ sections }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {sections.map((section) => {
        const Icon = section.icon;

        return (
          <article
            key={section.title}
            className="rounded-lg border border-gray-100 bg-white p-6 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-red-50 p-3 text-red-600">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {section.description}
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

function PageShell({ page, children }) {
  return (
    <div className="bg-gray-50">
      <Hero page={page} />
      <main className="mx-auto max-w-7xl px-4 py-14 md:px-16">{children}</main>
      <ContactBand />
    </div>
  );
}

export function TermsPage() {
  const sections = [
    {
      title: "Website & Account Use",
      description:
        "Customers are expected to use the store honestly and keep their account details accurate.",
      icon: UserCheck,
      items: [
        "You are responsible for keeping your login details private.",
        "Order, billing, and delivery information should be complete and accurate.",
        "Alam Computer may contact you to verify important order or support details.",
      ],
    },
    {
      title: "Products & Pricing",
      description:
        "We work to keep product details current, but stock and pricing can change.",
      icon: ShoppingBag,
      items: [
        "Product images, titles, prices, and stock are shown as accurately as possible.",
        "Availability may change before an order is confirmed.",
        "If a listed detail needs correction, we will contact you before processing the order.",
      ],
    },
    {
      title: "Orders & Delivery",
      description:
        "Orders are processed after confirmation and may depend on product availability.",
      icon: Truck,
      items: [
        "Delivery timing can vary by location, product type, and order volume.",
        "Customers may be asked to confirm their address or phone number before dispatch.",
        "Store pickup or special delivery requests can be discussed with our team.",
      ],
    },
    {
      title: "Warranty & Support",
      description:
        "Warranty coverage depends on the product, manufacturer, and condition of the item.",
      icon: RefreshCcw,
      items: [
        "Keep your invoice or order record for warranty and support requests.",
        "Physical damage, misuse, or unauthorized repair may affect warranty eligibility.",
        "Contact us quickly if a product arrives damaged or different from your order.",
      ],
    },
  ];

  return (
    <PageShell page={pageIntro.terms}>
      <SectionList sections={sections} />
    </PageShell>
  );
}

export function PrivacyPage() {
  const sections = [
    {
      title: "Information We Need",
      description:
        "We only ask for details that help us handle orders, support, and store communication.",
      icon: UserCheck,
      items: [
        "Your name, phone number, email, address, and account details when provided.",
        "Order history, cart activity, and product support requests.",
        "Messages you send through our contact form or direct store communication.",
      ],
    },
    {
      title: "How We Use It",
      description:
        "Customer information is used to serve you, not to make shopping complicated.",
      icon: ShoppingBag,
      items: [
        "To confirm orders, arrange delivery, and provide after-sales support.",
        "To respond to questions about laptops, parts, repair, and bulk orders.",
        "To improve product availability, store service, and website experience.",
      ],
    },
    {
      title: "Your Choices",
      description:
        "You can contact us when your information needs to be corrected or removed from active support records.",
      icon: Mail,
      items: [
        "Ask us to update incorrect contact or order details.",
        "Contact the store if you no longer want non-essential messages.",
        "Keep your account password private and sign out on shared devices.",
      ],
    },
    {
      title: "Privacy Support",
      description:
        "Our team can help with privacy questions connected to your account or orders.",
      icon: ShieldCheck,
      items: [
        "Use the contact details below for account and data questions.",
        "We may ask for order details before sharing account-related information.",
        "Sensitive payment details should never be sent through normal messages.",
      ],
    },
  ];

  return (
    <PageShell page={pageIntro.privacy}>
      <SectionList sections={sections} />
    </PageShell>
  );
}

export function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Collection",
      description:
        "Information is collected when you create an account, place an order, send a message, or request support.",
      icon: FileText,
      items: [
        "Contact details such as name, phone number, email, and delivery address.",
        "Order details including selected products, quantity, price, and support notes.",
        "Basic technical information that helps the website work properly.",
      ],
    },
    {
      title: "Use & Storage",
      description:
        "We keep information only for store operations, customer service, and order records.",
      icon: Clock,
      items: [
        "Information supports order fulfillment, warranty help, returns, and customer care.",
        "Records may be kept where needed for business, accounting, or support purposes.",
        "Access is limited to people and service providers who need it to complete store work.",
      ],
    },
    {
      title: "Sharing",
      description:
        "We do not sell customer information. Limited sharing may happen only to complete requested services.",
      icon: Truck,
      items: [
        "Delivery partners may receive the details needed to ship an order.",
        "Technical service providers may help maintain the website or store systems.",
        "Legal or safety requests may require us to keep or provide specific records.",
      ],
    },
    {
      title: "Protection",
      description:
        "We use practical safeguards to reduce unauthorized access and protect store data.",
      icon: LockKeyhole,
      items: [
        "Account access should be protected with a private password.",
        "Staff access to customer records is limited to store needs.",
        "Suspicious messages or account activity should be reported to us immediately.",
      ],
    },
  ];

  return (
    <PageShell page={pageIntro.privacyPolicy}>
      <SectionList sections={sections} />
    </PageShell>
  );
}

export function SecurityPage() {
  const sections = [
    {
      title: "Account Protection",
      description:
        "Account access is protected through login checks and careful handling of customer information.",
      icon: UserCheck,
      items: [
        "Use a strong password and avoid sharing it with anyone.",
        "Sign out after using shared computers or public devices.",
        "Contact us if you notice unexpected account or cart activity.",
      ],
    },
    {
      title: "Checkout Safety",
      description:
        "Checkout and order steps are designed to keep customer details handled carefully.",
      icon: LockKeyhole,
      items: [
        "Only provide payment or delivery details through trusted store channels.",
        "Do not send card numbers or passwords through email, WhatsApp, or contact forms.",
        "We may verify details before dispatching high-value items.",
      ],
    },
    {
      title: "Store Communication",
      description:
        "Official support is available through our listed phone number, email, and store address.",
      icon: Phone,
      items: [
        "Check the sender before trusting payment requests or order updates.",
        "Report suspicious calls or messages claiming to be Alam Computer.",
        "Use the contact details below when you are unsure about a request.",
      ],
    },
    {
      title: "Product Confidence",
      description:
        "We help customers buy genuine products with support after purchase.",
      icon: ShieldCheck,
      items: [
        "Keep invoices and serial details for warranty and support checks.",
        "Inspect delivered items promptly and contact us if something looks incorrect.",
        "Our team can advise on safe setup for laptops, routers, storage, and accessories.",
      ],
    },
  ];

  return (
    <PageShell page={pageIntro.security}>
      <SectionList sections={sections} />
    </PageShell>
  );
}

export function FaqPage() {
  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "Browse products, add items to your cart, and continue to checkout. You can also contact the store for product guidance or bulk order support.",
    },
    {
      question: "Do you deliver across the UAE?",
      answer:
        "Delivery support is available for Sharjah and other UAE locations depending on the product and order details. Contact us to confirm timing for your area.",
    },
    {
      question: "Can I collect my order from the shop?",
      answer:
        "Yes. Store pickup can be arranged from our Sharjah location after your order is confirmed and the item is ready.",
    },
    {
      question: "Are the products original?",
      answer:
        "Alam Computer focuses on genuine laptops, components, accessories, and IT products from trusted sources.",
    },
    {
      question: "Do products include warranty?",
      answer:
        "Warranty depends on the product, manufacturer, and condition. Keep your invoice and contact us for warranty support details.",
    },
    {
      question: "Can I request a quotation for business or bulk purchases?",
      answer:
        "Yes. Share your requirements through the contact page, phone, or email and our team will help with availability and pricing.",
    },
    {
      question: "What should I do if an item arrives damaged or incorrect?",
      answer:
        "Contact us as soon as possible with your order details and clear photos so the team can review the issue quickly.",
    },
    {
      question: "How do I get technical support?",
      answer:
        "Reach out by phone, email, or visit the shop. Our team can help with product selection, setup questions, warranty guidance, and repair advice.",
    },
  ];

  return (
    <PageShell page={pageIntro.faq}>
      <div className="grid gap-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-lg border border-gray-100 bg-white p-5 shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
              <span className="text-base font-black text-gray-900">{faq.question}</span>
              <HelpCircle className="h-5 w-5 shrink-0 text-red-600 transition-transform group-open:rotate-45" />
            </summary>
            <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-600">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
