import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Cpu,
  HardDrive,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import PageSeo from "@/components/seo/PageSeo";
import {
  externalLinkProps,
  storeContact,
} from "@/config/contact";

const ComputerRepairSharjah = () => {
  const siteUrl = (
    import.meta.env.VITE_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/computer-repair-sharjah#service`,
        name: "Computer Repair in Sharjah",
        serviceType: "Computer repair service",
        description:
          "Computer repair and troubleshooting in Sharjah for desktop computers, office PCs, hardware faults, performance problems, upgrades, storage issues, power faults, and other common computer problems.",
        url: `${siteUrl}/computer-repair-sharjah`,
        areaServed: {
          "@type": "City",
          name: "Sharjah",
        },
        provider: {
          "@type": "ComputerStore",
          "@id": `${siteUrl}/#business`,
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
        "@id": `${siteUrl}/computer-repair-sharjah#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Does Alam Computer provide computer repair in Sharjah?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Alam Computer provides computer repair and troubleshooting in Sharjah for desktop computers and PCs from major brands. Customers can visit the Industrial Area 3 store for diagnosis and repair enquiries.",
            },
          },
          {
            "@type": "Question",
            name: "What computer problems can Alam Computer repair?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Common computer problems include systems that do not start, slow performance, storage failures, RAM problems, overheating, power issues, hardware faults, upgrade requirements, and other desktop computer problems. The exact repair depends on diagnosis and parts availability.",
            },
          },
          {
            "@type": "Question",
            name: "Which computer brands do you repair?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alam Computer provides repair support for all major computer brands, including HP, Dell, Lenovo, Acer, Asus, Apple, and other commonly used computer brands. Service availability depends on the model, fault, and parts required.",
            },
          },
          {
            "@type": "Question",
            name: "Can you upgrade a slow computer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Depending on the computer, upgrades such as additional RAM, SSD storage, replacement drives, or other compatible hardware may improve performance. The computer should first be checked to determine the most suitable upgrade.",
            },
          },
          {
            "@type": "Question",
            name: "How much does computer repair cost in Sharjah?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Computer repair cost depends on the fault, computer model, work required, and whether replacement parts are needed. Contact Alam Computer or bring the computer to the store for assessment.",
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
        "@id": `${siteUrl}/computer-repair-sharjah#breadcrumb`,
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
            name: "Computer Repair in Sharjah",
            item: `${siteUrl}/computer-repair-sharjah`,
          },
        ],
      },
    ],
  };

  const repairIssues = [
    "Computer not turning on or starting correctly",
    "Slow computer performance and freezing",
    "Hard drive or SSD problems",
    "RAM and memory-related faults",
    "Computer overheating or shutting down",
    "Power supply and startup problems",
    "Desktop hardware faults",
    "Storage upgrades and SSD installation",
    "RAM upgrades and compatible replacements",
    "General computer servicing and troubleshooting",
    "Assessment of repair versus replacement",
    "Office and business computer problems",
  ];

  const brands = [
    "HP",
    "Dell",
    "Lenovo",
    "Acer",
    "Asus",
    "Apple",
    "Microsoft",
    "Other Major Brands",
  ];

  const faqs = [
    {
      question: "Does Alam Computer provide computer repair in Sharjah?",
      answer:
        "Yes. Alam Computer provides computer repair and troubleshooting from its store in Industrial Area 3, Sharjah. We can inspect desktop computers and PCs with hardware, performance, storage, power, and other common faults.",
    },
    {
      question: "What computer problems can you repair?",
      answer:
        "We can help diagnose computers that do not turn on, run slowly, freeze, overheat, experience storage or memory faults, have hardware problems, or need compatible upgrades. The exact repair depends on the diagnosis.",
    },
    {
      question: "Which computer brands do you repair?",
      answer:
        "We provide repair support for all major computer brands, including HP, Dell, Lenovo, Acer, Asus, Apple, Microsoft, and other commonly used brands. Repair options depend on the model and parts availability.",
    },
    {
      question: "Can you make a slow computer faster?",
      answer:
        "In many cases, yes. A slow computer may benefit from troubleshooting, an SSD upgrade, additional RAM, storage cleanup, or replacement of faulty hardware. The computer should first be inspected to identify the cause of the problem.",
    },
    {
      question: "Can you replace a faulty hard drive or SSD?",
      answer:
        "Yes, where compatible parts are available. A faulty or slow storage drive may be replaced with a suitable HDD or SSD after the computer has been inspected.",
    },
    {
      question: "How much does computer repair cost in Sharjah?",
      answer:
        "The cost depends on the computer, fault, required work, and any replacement parts needed. Contact Alam Computer or bring the computer to the store for assessment before deciding on the repair.",
    },
    {
      question: "Where can I bring my computer for repair?",
      answer: `You can visit Alam Computer at ${storeContact.address}.`,
    },
  ];

  return (
    <div className="bg-white">
      <PageSeo
        title="Computer Repair in Sharjah"
        description="Computer repair in Sharjah for desktops and PCs from major brands. Alam Computer provides diagnostics, hardware repair, upgrades and troubleshooting from Industrial Area 3."
        canonical={`${siteUrl}/computer-repair-sharjah`}
        image={`${siteUrl}/logo1.webp`}
        structuredData={structuredData}
      />

      <section className="bg-[linear-gradient(135deg,#190707,#3a0b0b)] px-4 py-14 text-white md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
              Local Computer Repair Service
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Computer Repair in Sharjah
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Alam Computer provides computer repair and troubleshooting in
              Sharjah for desktop PCs and computers from all major brands.
              Visit our Industrial Area 3 store for help with startup problems,
              slow performance, storage faults, hardware issues, upgrades, and
              general computer servicing.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={storeContact.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-black text-white transition hover:bg-red-500"
              >
                <Phone className="h-5 w-5" />
                Call for Computer Repair
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
              Quick Answer
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Where Can I Get a Computer Repaired in Sharjah?
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Alam Computer provides computer repair in Industrial Area 3,
              Sharjah for desktop computers and PCs from major brands. The team
              can inspect hardware faults, startup problems, slow performance,
              storage issues, RAM problems, overheating, power faults, and
              compatible upgrade requirements.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Repair options depend on the computer model, diagnosis, condition
              of the machine, and availability of suitable replacement parts.
              Customers can call before visiting or bring the computer directly
              to the store for an inspection.
            </p>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
            <Cpu className="h-10 w-10 text-red-600" />

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Need Your Computer Checked?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Bring your computer to Alam Computer in Industrial Area 3,
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
              Computer Problems
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Computer Issues We Can Help Diagnose
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Computer faults can come from storage, memory, power, cooling,
              internal components, or general system performance. An inspection
              helps determine whether servicing, repair, an upgrade, or
              replacement is the most practical option.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {repairIssues.map((item) => (
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
                Major Computer Brands
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Computer Repair for Major Brands
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Alam Computer provides repair support for all major computer
                brands, including HP, Dell, Lenovo, Acer, Asus, Apple,
                Microsoft, and other commonly used desktop and PC brands.
              </p>

              <p className="mt-4 leading-7 text-slate-600">
                Repair availability depends on the computer model, type of
                fault, compatible components, and availability of suitable
                replacement parts.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <ShieldCheck className="h-5 w-5 text-red-600" />

                  <span className="font-black text-slate-900">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-12 text-white md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <HardDrive className="h-9 w-9 text-red-400" />

              <h2 className="mt-4 text-3xl font-black">
                Can a Slow Computer Be Upgraded?
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Sometimes a computer does not need to be replaced. Depending on
                its hardware and condition, an SSD upgrade, additional RAM,
                replacement storage, or another compatible component may
                improve its performance.
              </p>

              <p className="mt-4 leading-7 text-slate-300">
                The best option depends on the age of the computer, its existing
                specifications, the problem being experienced, and the cost of
                upgrading compared with replacement.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <Wrench className="h-8 w-8 text-red-400" />

              <h3 className="mt-4 text-xl font-black">
                Repair or Replace Your Computer?
              </h3>

              <p className="mt-3 leading-7 text-slate-300">
                Repair can be practical when the computer is still suitable for
                your needs and the fault can be resolved economically.
                Replacement may make more sense when several components are
                failing, the computer is very old, or repair costs are high.
              </p>

              <Link
                to="/shop/contact"
                className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-500"
              >
                Ask Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
              Related Repair Services
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              More Repair Services in Sharjah
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Alam Computer also provides support for laptops and printers in
              Sharjah. Choose the service that matches your device.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link
              to="/laptop-repair-sharjah"
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Laptop Service
              </p>

              <h3 className="mt-3 text-2xl font-black text-slate-950">
                Laptop Repair in Sharjah
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Get help with laptop hardware faults, charging problems,
                screens, keyboards, overheating, storage, performance, and
                other common laptop issues.
              </p>

              <span className="mt-5 inline-flex font-black text-red-600 group-hover:underline">
                View Laptop Repair Service
              </span>
            </Link>

            <Link
              to="/printer-repair-sharjah"
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Printer Service
              </p>

              <h3 className="mt-3 text-2xl font-black text-slate-950">
                Printer Repair in Sharjah
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Get help with paper jams, poor print quality, connectivity
                faults, printer errors, hardware problems, and general printer
                servicing.
              </p>

              <span className="mt-5 inline-flex font-black text-red-600 group-hover:underline">
                View Printer Repair Service
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
            Frequently Asked Questions
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Computer Repair FAQs
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Quick answers to common questions about computer repair,
            troubleshooting, upgrades, brands, pricing, and visiting Alam
            Computer in Sharjah.
          </p>

          <div className="mt-8 space-y-4">
            {faqs.map(({ question, answer }) => (
              <article
                key={question}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-black text-slate-950">
                  {question}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-600 px-4 py-12 text-white md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Need Computer Repair in Sharjah?
            </h2>

            <p className="mt-2 max-w-2xl text-white/85">
              Contact Alam Computer or visit our Industrial Area 3 store for
              computer diagnostics, troubleshooting, repairs, and compatible
              upgrade enquiries.
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

export default ComputerRepairSharjah;
