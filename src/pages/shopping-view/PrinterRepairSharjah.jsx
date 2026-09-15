import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import PageSeo from "@/components/seo/PageSeo";
import {
  externalLinkProps,
  storeContact,
} from "@/config/contact";

const PrinterRepairSharjah = () => {
  const siteUrl = (
    import.meta.env.VITE_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/printer-repair-sharjah#service`,
        name: "Printer Repair in Sharjah",
        serviceType: "Printer repair service",
        description:
          "Printer repair and troubleshooting services in Sharjah for major printer brands, including support for print quality issues, paper jams, connectivity problems, hardware faults, and general servicing.",
        url: `${siteUrl}/printer-repair-sharjah`,
        areaServed: {
          "@type": "City",
          name: "Sharjah",
        },
        provider: {
          "@type": "ComputerStore",
          name: "Alam Computer",
          url: siteUrl,
          telephone: "+971557112599",
          address: {
            "@type": "PostalAddress",
            streetAddress: "J&P Signal, Industrial Area 3",
            addressLocality: "Sharjah",
            addressRegion: "Sharjah",
            addressCountry: "AE",
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/printer-repair-sharjah#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Does Alam Computer repair printers in Sharjah?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Alam Computer provides printer repair and troubleshooting support in Sharjah for major printer brands. Customers can visit the store in Industrial Area 3 for inspection and repair enquiries.",
            },
          },
          {
            "@type": "Question",
            name: "Which printer brands does Alam Computer repair?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alam Computer provides repair support for all major printer brands, including HP, Canon, Epson, Brother, Samsung, Xerox, and other commonly used printer brands. Service availability can depend on the model, fault, and parts required.",
            },
          },
          {
            "@type": "Question",
            name: "What printer problems can be repaired?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Common printer problems include paper jams, poor print quality, connectivity issues, printer errors, hardware faults, ink or toner related problems, and general servicing needs. The exact repair depends on the printer model and diagnosis.",
            },
          },
          {
            "@type": "Question",
            name: "Where is Alam Computer located in Sharjah?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alam Computer is located near J&P Signal in Industrial Area 3, Sharjah, UAE.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/printer-repair-sharjah#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Printer Repair in Sharjah",
            item: `${siteUrl}/printer-repair-sharjah`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white">
      <PageSeo
        title="Printer Repair in Sharjah"
        description="Printer repair in Sharjah for major brands. Alam Computer provides troubleshooting, servicing and repair support from Industrial Area 3, Sharjah."
        canonical={`${siteUrl}/printer-repair-sharjah`}
        image={`${siteUrl}/logo1.webp`}
        structuredData={structuredData}
      />

      <section className="bg-[linear-gradient(135deg,#190707,#3a0b0b)] px-4 py-14 text-white md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
              Local Printer Service
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Printer Repair in Sharjah
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Alam Computer provides printer repair and troubleshooting in
              Sharjah for all major printer brands. Visit our Industrial Area 3
              store for help with printer faults, paper jams, poor print
              quality, connectivity problems, and general servicing.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={storeContact.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-black text-white transition hover:bg-red-500"
              >
                <Phone className="h-5 w-5" />
                Call for Printer Repair
              </a>

              <a
                href={storeContact.directionsHref}
                {...externalLinkProps}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-black text-white transition hover:bg-white/15"
              >
                <MapPin className="h-5 w-5" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
              Printer Repairs &amp; Troubleshooting
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Local Printer Repair Support in Sharjah
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Printer problems can interrupt work at home, in an office, or in
              a business. Alam Computer helps customers in Sharjah diagnose
              printer problems and determine whether a repair, replacement
              part, servicing, or another solution is appropriate.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Our team works with major printer brands and a wide range of
              printer models. Repair options depend on the condition of the
              machine, the fault identified, and the availability of required
              replacement parts.
            </p>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
            <Printer className="h-10 w-10 text-red-600" />

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Need Your Printer Checked?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Bring your printer to Alam Computer in Industrial Area 3,
              Sharjah, or call us first to discuss the problem.
            </p>

            <p className="mt-4 font-black text-red-600">
              {storeContact.phoneDisplay}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
              Common Printer Problems
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Printer Issues We Can Help Diagnose
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              "Paper jams and paper feeding problems",
              "Faded, streaked or poor print quality",
              "Printer not connecting to a computer or network",
              "Printer error messages and hardware faults",
              "Ink and toner related printing problems",
              "Slow printing or interrupted print jobs",
              "Printer not powering on correctly",
              "General printer servicing and maintenance",
              "Assessment of repair versus replacement",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="font-semibold leading-6 text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
                Major Printer Brands
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Printer Repair for Major Brands
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Alam Computer provides repair support for all major printer
                brands, including HP, Canon, Epson, Brother, Samsung, Xerox,
                and other commonly used printer manufacturers.
              </p>

              <p className="mt-4 leading-7 text-slate-600">
                The exact repair process depends on the printer model, the
                fault identified, and whether suitable replacement parts are
                available.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["HP", "Canon", "Epson", "Brother", "Samsung", "Xerox"].map(
                (brand) => (
                  <div
                    key={brand}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <ShieldCheck className="h-5 w-5 text-red-600" />
                    <span className="font-black text-slate-900">{brand}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-12 text-white md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Wrench className="h-9 w-9 text-red-400" />

              <h2 className="mt-4 text-3xl font-black">
                Repair or Replace Your Printer?
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Repair can make sense when the fault is limited, parts are
                available, and the printer still meets your needs. Replacement
                may be more practical when repair costs are high, the printer
                is very old, or recurring problems continue.
              </p>

              <p className="mt-4 leading-7 text-slate-300">
                Our team can inspect the issue and help you understand the
                available options before you decide.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="text-xl font-black">
                Looking for a Printer Instead?
              </h3>

              <p className="mt-3 leading-7 text-slate-300">
                Alam Computer also sells printers and related supplies in
                Sharjah.
              </p>

              <Link
                to="/printers"
                className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-500"
              >
                Browse Printers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
            Frequently Asked Questions
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Printer Repair FAQs
          </h2>

          <div className="mt-8 space-y-4">
            {[
              {
                question: "Does Alam Computer repair printers in Sharjah?",
                answer:
                  "Yes. Alam Computer provides printer repair and troubleshooting support from its store in Industrial Area 3, Sharjah.",
              },
              {
                question: "Which printer brands do you repair?",
                answer:
                  "We provide repair support for all major printer brands, including HP, Canon, Epson, Brother, Samsung, Xerox, and other commonly used brands.",
              },
              {
                question: "Can you repair a printer that is not printing properly?",
                answer:
                  "Yes. Problems such as poor print quality, paper feeding issues, error messages, connectivity faults, and other hardware-related problems can be inspected and diagnosed.",
              },
              {
                question: "How much does printer repair cost in Sharjah?",
                answer:
                  "Repair cost depends on the printer model, the fault, the work required, and whether replacement parts are needed. Contact Alam Computer or bring the printer to the store for assessment.",
              },
              {
                question: "Where can I bring my printer for repair?",
                answer: `You can visit Alam Computer at ${storeContact.address}.`,
              },
            ].map(({ question, answer }) => (
              <article
                key={question}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-black text-slate-950">
                  {question}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-600 px-4 py-12 text-white md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Need Printer Repair in Sharjah?
            </h2>

            <p className="mt-2 max-w-2xl text-white/85">
              Contact Alam Computer or visit our Industrial Area 3 store for
              printer repair and troubleshooting support.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={storeContact.phoneHref}
              className="rounded-xl bg-white px-5 py-3 text-center font-black text-red-600"
            >
              Call {storeContact.phoneDisplay}
            </a>

            <Link
              to="/shop/contact"
              className="rounded-xl border border-white/30 px-5 py-3 text-center font-black text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrinterRepairSharjah;
