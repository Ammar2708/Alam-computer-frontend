import React from "react";
import { Link } from "react-router-dom";
import {
  BatteryCharging,
  CheckCircle2,
  Laptop,
  MapPin,
  Phone,
  ShieldCheck,
  Thermometer,
  Wrench,
} from "lucide-react";
import PageSeo from "@/components/seo/PageSeo";
import {
  externalLinkProps,
  storeContact,
} from "@/config/contact";

const LaptopRepairSharjah = () => {
  const siteUrl = (
    import.meta.env.VITE_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/laptop-repair-sharjah#service`,
        name: "Laptop Repair in Sharjah",
        serviceType: "Laptop repair service",
        description:
          "Laptop repair and troubleshooting in Sharjah for major laptop brands, including support for charging problems, screen faults, keyboard issues, overheating, storage faults, slow performance, battery problems, and general laptop servicing.",
        url: `${siteUrl}/laptop-repair-sharjah`,
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
        "@id": `${siteUrl}/laptop-repair-sharjah#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Does Alam Computer repair laptops in Sharjah?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Alam Computer provides laptop repair and troubleshooting in Sharjah for major laptop brands. Customers can visit the Industrial Area 3 store for inspection and repair enquiries.",
            },
          },
          {
            "@type": "Question",
            name: "What laptop problems can Alam Computer repair?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Common laptop problems include charging faults, battery issues, broken or faulty screens, keyboard problems, overheating, slow performance, storage faults, startup problems, and other hardware-related issues. The exact repair depends on diagnosis and parts availability.",
            },
          },
          {
            "@type": "Question",
            name: "Which laptop brands do you repair?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Alam Computer provides repair support for all major laptop brands, including HP, Dell, Lenovo, Acer, Asus, Apple, Toshiba, Microsoft, and other commonly used laptop brands. Service availability depends on the model, fault, and parts required.",
            },
          },
          {
            "@type": "Question",
            name: "Can you repair a laptop that is not charging?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Charging problems can be caused by the charger, battery, charging port, power circuit, or another internal fault. The laptop should be inspected to identify the cause before repair.",
            },
          },
          {
            "@type": "Question",
            name: "Can you replace or repair a laptop screen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Laptop screen faults can often be diagnosed and, where compatible parts are available, the screen may be replaced. The repair depends on the laptop model and the type of display fault.",
            },
          },
          {
            "@type": "Question",
            name: "How much does laptop repair cost in Sharjah?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Laptop repair cost depends on the laptop model, the fault, the work required, and whether replacement parts are needed. Contact Alam Computer or bring the laptop to the store for assessment.",
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
        "@id": `${siteUrl}/laptop-repair-sharjah#breadcrumb`,
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
            name: "Laptop Repair in Sharjah",
            item: `${siteUrl}/laptop-repair-sharjah`,
          },
        ],
      },
    ],
  };

  const repairIssues = [
    "Laptop not turning on or starting correctly",
    "Battery not charging or draining quickly",
    "Charging port and power problems",
    "Broken, damaged or faulty laptop screens",
    "Keyboard keys not working correctly",
    "Touchpad and input problems",
    "Laptop overheating or shutting down",
    "Slow performance and freezing",
    "Hard drive or SSD problems",
    "RAM and memory-related faults",
    "Storage and SSD upgrades",
    "General laptop servicing and troubleshooting",
  ];

  const brands = [
    "HP",
    "Dell",
    "Lenovo",
    "Acer",
    "Asus",
    "Apple",
    "Toshiba",
    "Microsoft",
  ];

  const faqs = [
    {
      question: "Does Alam Computer repair laptops in Sharjah?",
      answer:
        "Yes. Alam Computer provides laptop repair and troubleshooting from its store in Industrial Area 3, Sharjah. We can inspect laptops with charging, screen, keyboard, performance, storage, overheating, and other hardware-related problems.",
    },
    {
      question: "Which laptop brands do you repair?",
      answer:
        "We provide repair support for all major laptop brands, including HP, Dell, Lenovo, Acer, Asus, Apple, Toshiba, Microsoft, and other commonly used brands. Repair availability depends on the model, fault, and required parts.",
    },
    {
      question: "Can you repair a laptop that does not turn on?",
      answer:
        "Yes. A laptop that does not turn on may have a charging, battery, power, motherboard, storage, or other internal fault. The laptop needs to be inspected to identify the cause.",
    },
    {
      question: "Can you repair a laptop that is not charging?",
      answer:
        "Yes. Charging problems may come from the charger, battery, charging port, power circuit, or another internal component. Diagnosis is required before deciding on the repair.",
    },
    {
      question: "Can you replace a broken laptop screen?",
      answer:
        "In many cases, yes. If a compatible replacement display is available, a damaged or faulty laptop screen can be replaced. Availability depends on the laptop model and screen specification.",
    },
    {
      question: "Can you fix a laptop that is overheating?",
      answer:
        "Overheating can be caused by blocked airflow, dust, fan problems, thermal issues, or other hardware faults. The laptop can be inspected to determine whether cleaning, servicing, or another repair is required.",
    },
    {
      question: "Can you upgrade a slow laptop?",
      answer:
        "Depending on the laptop, performance may be improved with compatible RAM, SSD storage, or other suitable upgrades. The existing hardware should first be checked to determine what upgrades are supported.",
    },
    {
      question: "How much does laptop repair cost in Sharjah?",
      answer:
        "The repair cost depends on the laptop model, the problem, work required, and any replacement parts needed. Contact Alam Computer or bring the laptop to the store for assessment.",
    },
    {
      question: "Where can I bring my laptop for repair?",
      answer: `You can visit Alam Computer at ${storeContact.address}.`,
    },
  ];

  return (
    <div className="bg-white">
      <PageSeo
        title="Laptop Repair in Sharjah"
        description="Laptop repair in Sharjah for major brands. Alam Computer provides help with charging, screens, batteries, keyboards, overheating, storage and laptop hardware faults."
        canonical={`${siteUrl}/laptop-repair-sharjah`}
        image={`${siteUrl}/logo1.webp`}
        structuredData={structuredData}
      />

      <section className="bg-[linear-gradient(135deg,#190707,#3a0b0b)] px-4 py-14 text-white md:px-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
              Local Laptop Repair Service
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Laptop Repair in Sharjah
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
              Alam Computer provides laptop repair and troubleshooting in
              Sharjah for all major laptop brands. Visit our Industrial Area 3
              store for help with charging faults, broken screens, battery
              problems, keyboards, overheating, storage issues, slow
              performance, and general laptop servicing.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={storeContact.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-black text-white transition hover:bg-red-500"
              >
                <Phone className="h-5 w-5" />
                Call for Laptop Repair
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
              Where Can I Get My Laptop Repaired in Sharjah?
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Alam Computer provides laptop repair in Industrial Area 3,
              Sharjah for major laptop brands. The team can inspect charging
              problems, broken or faulty screens, battery issues, keyboard
              faults, overheating, storage problems, slow performance, and
              other common laptop hardware problems.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Repair options depend on the laptop model, the fault identified,
              its overall condition, and availability of compatible replacement
              parts. Customers can call before visiting or bring the laptop
              directly to the store for inspection.
            </p>
          </div>

          <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
            <Laptop className="h-10 w-10 text-red-600" />

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Need Your Laptop Checked?
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Bring your laptop to Alam Computer in Industrial Area 3,
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
              Common Laptop Problems
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Laptop Issues We Can Help Diagnose
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Laptop faults may involve the display, battery, charging system,
              keyboard, cooling system, storage, memory, or other internal
              hardware. Diagnosis helps identify whether servicing, repair,
              replacement parts, or an upgrade is appropriate.
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
                Major Laptop Brands
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Laptop Repair for Major Brands
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                Alam Computer provides repair support for all major laptop
                brands, including HP, Dell, Lenovo, Acer, Asus, Apple, Toshiba,
                Microsoft, and other commonly used laptop manufacturers.
              </p>

              <p className="mt-4 leading-7 text-slate-600">
                The exact repair depends on the laptop model, type of fault,
                compatible components, and availability of replacement parts.
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
              <BatteryCharging className="h-9 w-9 text-red-400" />

              <h2 className="mt-4 text-3xl font-black">
                Why Is My Laptop Not Charging?
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                A laptop may stop charging because of a faulty charger, worn
                battery, damaged charging port, internal power circuit problem,
                or another hardware fault.
              </p>

              <p className="mt-4 leading-7 text-slate-300">
                Testing the laptop helps identify whether the issue comes from
                the charger, battery, charging socket, or internal hardware
                before replacement parts are ordered.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6">
              <Thermometer className="h-8 w-8 text-red-400" />

              <h3 className="mt-4 text-xl font-black">
                Is Your Laptop Overheating?
              </h3>

              <p className="mt-3 leading-7 text-slate-300">
                Overheating may be related to blocked airflow, dust buildup,
                cooling fan problems, thermal issues, or another hardware fault.
                Continued overheating can affect performance and may cause the
                laptop to shut down unexpectedly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <Wrench className="h-9 w-9 text-red-600" />

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                Repair or Replace Your Laptop?
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Repair may be practical when the laptop is still suitable for
                your needs, replacement parts are available, and the repair cost
                is reasonable compared with buying another laptop.
              </p>

              <p className="mt-4 leading-7 text-slate-600">
                Replacement may make more sense when the laptop is very old,
                several major components have problems, or the repair cost is
                high compared with the value of the machine.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-xl font-black text-slate-950">
                Looking for a Laptop Instead?
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Alam Computer also sells laptops in Sharjah for home, office,
                business, and everyday use.
              </p>

              <Link
                to="/laptops"
                className="mt-5 inline-flex rounded-xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-500"
              >
                Browse Laptops
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
              Related Repair Services
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              More Repair Services in Sharjah
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Link
              to="/computer-repair-sharjah"
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-red-600">
                Computer Service
              </p>

              <h3 className="mt-3 text-2xl font-black text-slate-950">
                Computer Repair in Sharjah
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Get help with desktop computer hardware faults, startup
                problems, storage, RAM, overheating, slow performance, and
                compatible upgrades.
              </p>

              <span className="mt-5 inline-flex font-black text-red-600 group-hover:underline">
                View Computer Repair Service
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
                problems, printer errors, hardware faults, and general printer
                servicing.
              </p>

              <span className="mt-5 inline-flex font-black text-red-600 group-hover:underline">
                View Printer Repair Service
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-16 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
            Frequently Asked Questions
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Laptop Repair FAQs
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Quick answers about laptop repair, charging problems, broken
            screens, overheating, brands, upgrades, pricing, and visiting Alam
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
              Need Laptop Repair in Sharjah?
            </h2>

            <p className="mt-2 max-w-2xl text-white/85">
              Contact Alam Computer or visit our Industrial Area 3 store for
              laptop diagnostics, troubleshooting, repair, servicing, and
              compatible upgrade enquiries.
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

export default LaptopRepairSharjah;
