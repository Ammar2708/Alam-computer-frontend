import React, { useState } from "react";
import axios from "axios";
import { Phone, Mail, MapPin, Clock, Send, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";
import { externalLinkProps, storeContact } from "@/config/contact";
import { getApiUrl } from "@/config/api";

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-red-600" />,
      title: "Call Us",
      details: storeContact.phoneDisplay,
      subtext: "Tap to dial",
      href: storeContact.phoneHref,
    },
    {
      icon: <Mail className="w-6 h-6 text-red-600" />,
      title: "Email Us",
      details: storeContact.email,
      subtext: "Tap to open email",
      href: storeContact.emailHref,
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      title: "Visit Shop",
      details: "J&P Signal, Industrial Area 3",
      subtext: "Open Google Maps directions",
      href: storeContact.directionsHref,
      external: true,
    },
    {
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: "Business Hours",
      details: "9:00 AM - 11:00 PM",
      subtext: "Friday Closed",
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all contact form fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(getApiUrl("/api/contact"), formData);

      toast.success(response?.data?.message || "Message sent successfully");
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 px-4 py-12 md:px-16 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            GET IN <span className="text-red-600">TOUCH</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question about a specific laptop, component, or warranty? Our
            technical team is ready to assist you with expert advice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {contactInfo.map((info, index) => {
              const ContactCard = info.href ? "a" : "div";

              return (
                <ContactCard
                  key={index}
                  href={info.href}
                  className={`flex min-w-0 items-start rounded-lg border-l-4 border-red-600 bg-white p-4 shadow-md transition-shadow hover:shadow-lg ${
                    info.href ? "cursor-pointer hover:-translate-y-0.5" : ""
                  }`}
                  aria-label={info.href ? `${info.title}: ${info.details}` : undefined}
                  {...(info.external ? externalLinkProps : {})}
                >
                  <div className="mr-4 shrink-0 rounded-lg bg-red-50 p-3">{info.icon}</div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800">{info.title}</h4>
                    <p className="break-words font-medium text-red-600">{info.details}</p>
                    <p className="text-sm text-gray-500">{info.subtext}</p>
                  </div>
                </ContactCard>
              );
            })}
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-xl sm:p-8 lg:col-span-2">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase">Subject (e.g., Laptop Repair, Bulk Order)</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the tech you're looking for..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 w-full md:w-max px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95 transition-all shadow-lg shadow-red-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      SEND MESSAGE
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="relative mt-12 h-80 w-full overflow-hidden rounded-xl border-2 border-white bg-gray-200 shadow-lg">
          <iframe
            title="Alam Computer Location"
            src={storeContact.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="pointer-events-none grayscale hover:grayscale-0 transition-all duration-500"
          />

          <a
            href={storeContact.directionsHref}
            className="absolute inset-0 z-10"
            aria-label="Open Google Maps directions to Alam Computer"
            {...externalLinkProps}
          >
            <span className="sr-only">Get directions to Alam Computer</span>
          </a>

          <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 rounded-lg border-l-4 border-red-600 bg-white/90 px-4 py-2 shadow-md backdrop-blur-sm sm:right-auto">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Our Location</p>
            <p className="text-sm text-gray-600">{storeContact.shortAddress}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600">
              <Navigation className="h-3.5 w-3.5" />
              Get Directions
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
