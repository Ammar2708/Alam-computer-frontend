import { useEffect, useRef, useState } from "react";
import { Bot, ExternalLink, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllFilteredProducts } from "@/store/shop/product-slice";
import { storeContact } from "@/config/contact";
import { getApiUrl } from "@/config/api";

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I’m Alam Assistant. I can help you find products, compare options, or answer questions about ordering and delivery.",
};

const quickPrompts = ["Find a laptop", "Show printers", "Delivery help"];

const normalize = (value = "") => value.toLowerCase().trim();

function StoreAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);
  const [isReplying, setIsReplying] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList = [] } = useSelector((state) => state.shopProducts || {});

  useEffect(() => {
    if (!productList.length) dispatch(fetchAllFilteredProducts({}));
  }, [dispatch, productList.length]);

  useEffect(() => {
    const nudgeTimer = window.setTimeout(() => setShowNudge(true), 1800);
    return () => window.clearTimeout(nudgeTimer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findMatchingProducts = (query) => {
    const words = normalize(query)
      .split(/\s+/)
      .filter((word) => word.length > 2 && !["show", "find", "need", "want", "with", "best", "some"].includes(word));

    return productList
      .filter((product) => {
        const searchable = normalize(
          `${product?.title || ""} ${product?.brand || ""} ${product?.category || ""} ${product?.description || ""}`
        );
        return words.some((word) => searchable.includes(word));
      })
      .slice(0, 3);
  };

  const getReply = (query) => {
    const normalized = normalize(query);
    const matches = findMatchingProducts(query);

    if (matches.length) {
      return {
        text: `I found ${matches.length} good match${matches.length > 1 ? "es" : ""} for you:`,
        products: matches,
        action: { label: "View all results", path: `/shop/listing?search=${encodeURIComponent(query)}` },
      };
    }

    if (/deliver|shipping|courier|when.*arrive/.test(normalized)) {
      return {
        text: "Delivery timing depends on your location and item availability. For an exact estimate, contact our team and mention the product you need.",
        contact: true,
      };
    }

    if (/pay|payment|checkout|order|buy/.test(normalized)) {
      return {
        text: "Add your items to the cart, then open Checkout to confirm your details and place the order. I can also take you there now.",
        action: { label: "Go to checkout", path: "/shop/checkout" },
      };
    }

    if (/contact|phone|call|email|location|address|human|staff/.test(normalized)) {
      return {
        text: `Our team is in ${storeContact.shortAddress}. You can call ${storeContact.phoneDisplay} or email ${storeContact.email}.`,
        contact: true,
      };
    }

    if (/return|refund|warranty|guarantee/.test(normalized)) {
      return {
        text: "Return and warranty eligibility can vary by product. Please contact our team with the item name so we can confirm the exact terms.",
        contact: true,
      };
    }

    if (/hello|hi|hey|help/.test(normalized)) {
      return { text: "Hello! Tell me what product you’re looking for, your preferred brand, or what you need help with." };
    }

    return {
      text: "I couldn’t find an exact match yet. Try a product type or brand such as “HP laptop”, “Epson printer”, “ink”, or “network gear”.",
      action: { label: "Browse all products", path: "/shop/listing" },
    };
  };

  const sendMessage = async (value) => {
    const query = value.trim();
    if (!query || isReplying) return;

    messageIdRef.current += 1;
    const messageId = messageIdRef.current;
    const userMessage = { id: `user-${messageId}`, role: "user", text: query };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setInput("");
    setIsReplying(true);

    try {
      const response = await fetch(getApiUrl("/api/assistant/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map(({ role, text }) => ({ role, text })),
        }),
      });
      const data = await response.json();

      if (!response.ok || !data?.reply) throw new Error(data?.message || "Assistant unavailable");

      setMessages((current) => [
        ...current,
        { id: `assistant-${messageId}`, role: "assistant", text: data.reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: `assistant-${messageId}`, role: "assistant", ...getReply(query) },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6" style={{ zIndex: 9999 }}>
      {isOpen && (
        <section
          className="mb-3 flex h-[min(540px,72vh)] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)]"
          aria-label="Alam store assistant"
        >
          <header className="flex items-center justify-between bg-[linear-gradient(135deg,#dc2626,#991b1b)] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-black">Alam Assistant</h2>
                  <Sparkles className="h-3.5 w-3.5 text-red-200" />
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-red-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Online to help
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition hover:bg-black/20"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/80 p-3" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={message.role === "user" ? "ml-9" : "mr-5"}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-5 shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-md bg-red-600 text-white"
                      : "rounded-bl-md border border-slate-100 bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>

                {message.products?.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => {
                      navigate(`/shop/listing?search=${encodeURIComponent(product.title)}`);
                      setIsOpen(false);
                    }}
                    className="mt-2 flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 text-left transition hover:border-red-200"
                  >
                    <img src={product.image} alt={`${product.title || "Product"} thumbnail`} className="h-10 w-10 rounded-lg bg-slate-50 object-contain" loading="lazy" decoding="async" width="40" height="40" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold text-slate-800">{product.title}</span>
                      <span className="text-[11px] font-black text-red-600">AED {product.salePrice || product.price}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                ))}

                {message.action && (
                  <button
                    type="button"
                    onClick={() => {
                      navigate(message.action.path);
                      setIsOpen(false);
                    }}
                    className="mt-2 text-xs font-black text-red-600 hover:text-red-700"
                  >
                    {message.action.label} →
                  </button>
                )}

                {message.contact && (
                  <a href={storeContact.phoneHref} className="mt-2 inline-block text-xs font-black text-red-600">
                    Call {storeContact.phoneDisplay} →
                  </a>
                )}
              </div>
            ))}
            {isReplying && (
              <div className="mr-20 flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-100 bg-white px-3.5 py-3 text-xs font-semibold text-slate-500 shadow-sm">
                <LoaderCircle className="h-4 w-4 animate-spin text-red-600" /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="scrollbar-none flex gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="shrink-0 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[11px] font-bold text-red-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about a product..."
              className="h-10 min-w-0 flex-1 rounded-xl bg-slate-100 px-3 text-sm outline-none ring-red-200 transition focus:ring-2"
              aria-label="Message Alam Assistant"
            />
            <button
              type="submit"
              disabled={!input.trim() || isReplying}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      {!isOpen && showNudge && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setShowNudge(false);
          }}
          className="absolute bottom-2 right-16 w-48 rounded-2xl rounded-br-sm border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-bold leading-4 text-slate-700 shadow-xl"
        >
          <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-red-600">Need help?</span>
          Ask me about products or orders.
        </button>
      )}

      <div className="relative ml-auto h-14 w-14">
        {!isOpen && <span className="absolute inset-0 animate-ping rounded-full bg-red-500/35" />}
        <button
          type="button"
          onClick={() => {
            setIsOpen((current) => !current);
            setShowNudge(false);
          }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_10px_28px_rgba(220,38,38,0.48)] ring-4 ring-white transition hover:scale-105 hover:bg-red-700"
          aria-label={isOpen ? "Close store assistant" : "Open store assistant"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}

export default StoreAssistant;
