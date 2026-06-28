"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  CircleDollarSign,
  Film,
  Globe2,
  MapPin,
  Megaphone,
  Radio,
  ShieldCheck,
  Target,
} from "lucide-react";

type Preference = "want" | "pass";

type Priority = {
  id: string;
  title: string;
  short: string;
  detail: string;
  icon: typeof Camera;
  proof: string;
  price: number;
};

type SignForm = {
  name: string;
  email: string;
  title: string;
  company: string;
  signature: string;
  notes: string;
};

type SendState = "idle" | "sending" | "sent" | "error";

const priorities: Priority[] = [
  {
    id: "photo",
    title: "Photography",
    short: "Jobsite, team, and before/after assets",
    detail: "Professional stills from active jobs, crews, finished roofs, homeowners, and brand moments.",
    icon: Camera,
    proof: "Reusable image library for ads, social, GBP, landing pages, and sales follow-up.",
    price: 1250,
  },
  {
    id: "video",
    title: "Videography",
    short: "Project stories and trust-building clips",
    detail: "Short-form and campaign-ready video around transformations, process, crew quality, and customer proof.",
    icon: Film,
    proof: "Edited video assets for Meta, YouTube, website embeds, and sales nurture.",
    price: 1750,
  },
  {
    id: "drone",
    title: "Drone Capture",
    short: "Premium aerial proof of roofing work",
    detail: "Aerial capture that shows scale, roof condition, craftsmanship, and finished property context.",
    icon: Radio,
    proof: "High-authority visuals that make Project One look bigger, sharper, and more trusted.",
    price: 1250,
  },
  {
    id: "local",
    title: "Local Search",
    short: "Google visibility and local authority",
    detail: "Lightweight Google Business Profile and local visibility support built from the field content already being produced.",
    icon: MapPin,
    proof: "An included visibility layer, not a standalone SEO retainer.",
    price: 150,
  },
  {
    id: "ads",
    title: "Paid Campaigns",
    short: "Ad spend carries the growth budget",
    detail: "Campaign management, creative testing, audience targeting, lead-quality optimization, and the media budget that drives reach.",
    icon: Target,
    proof: "A larger campaign allocation supported by original creative instead of generic ad content.",
    price: 3300,
  },
  {
    id: "social",
    title: "Social Distribution",
    short: "Turn field work into market presence",
    detail: "A practical publishing rhythm that keeps Project One visible without burdening the internal team.",
    icon: Megaphone,
    proof: "Consistent proof that the company is active, professional, and trusted locally.",
    price: 900,
  },
  {
    id: "reviews",
    title: "Reputation Proof",
    short: "Reviews, testimonials, and trust assets",
    detail: "Review growth, testimonial capture, customer proof, and credibility assets for sales and search.",
    icon: ShieldCheck,
    proof: "Better confidence before the first call and stronger support after estimates are sent.",
    price: 650,
  },
  {
    id: "geo",
    title: "AI Search Visibility",
    short: "GEO content for emerging search behavior",
    detail: "Included GEO support that structures selected project proof for AI search and answer engines.",
    icon: Globe2,
    proof: "A lower included add-on because GEO is already part of the broader content system.",
    price: 150,
  },
  {
    id: "reporting",
    title: "Reporting",
    short: "Monthly clarity for leadership",
    detail: "Simple reporting on content captured, campaign performance, visibility, calls, leads, and next moves.",
    icon: BarChart3,
    proof: "A clear view of what is working without turning marketing into another internal project.",
    price: 400,
  },
];

const defaultPreferences: Record<string, Preference> = {
  photo: "want",
  video: "want",
  drone: "want",
  local: "want",
  ads: "want",
  social: "want",
  reviews: "want",
  geo: "pass",
  reporting: "want",
};

const navItems = [
  ["Builder", "#builder"],
  ["Scope", "#scope"],
  ["90 Days", "#roadmap"],
  ["Investment", "#investment"],
];

const roadmapBase = [
  {
    label: "Month 1",
    title: "Decide The Scope",
    copy: "Confirm priorities, build the shoot calendar, audit existing assets, and set the first campaign lane.",
  },
  {
    label: "Month 2",
    title: "Capture The Proof",
    copy: "Produce field media, package project stories, publish priority content, and support sales follow-up.",
  },
  {
    label: "Month 3",
    title: "Amplify What Works",
    copy: "Scale the strongest creative, improve local visibility, review lead quality, and refine the next month.",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Reveal>
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#27f2df]">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
        <p className="mt-5 text-base leading-8 text-[#a9bdc0] md:text-lg">{body}</p>
      </div>
    </Reveal>
  );
}

export default function Home() {
  const [preferences, setPreferences] = useState<Record<string, Preference>>(defaultPreferences);
  const [isSigning, setIsSigning] = useState(false);
  const [signForm, setSignForm] = useState<SignForm>({
    name: "",
    email: "",
    title: "",
    company: "Project One Roofing",
    signature: "",
    notes: "",
  });
  const [sendState, setSendState] = useState<SendState>("idle");
  const [sendMessage, setSendMessage] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  const wanted = useMemo(
    () => priorities.filter((priority) => preferences[priority.id] === "want"),
    [preferences],
  );

  const passed = useMemo(
    () => priorities.filter((priority) => preferences[priority.id] === "pass"),
    [preferences],
  );

  const monthlyTotal = useMemo(
    () => wanted.reduce((total, priority) => total + priority.price, 0),
    [wanted],
  );

  const captureCount = wanted.filter((item) => ["photo", "video", "drone"].includes(item.id)).length;
  const planMode =
    captureCount >= 3
      ? "Capture-heavy growth plan"
      : wanted.some((item) => item.id === "ads")
        ? "Campaign support plan"
        : "Visibility and proof plan";

  function setPreference(id: string, preference: Preference) {
    setPreferences((current) => ({ ...current, [id]: preference }));
  }

  function createInvoiceHtml() {
    const invoiceDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const rows = wanted
      .map(
        (item) => `
          <tr>
            <td>
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.short)}</span>
            </td>
            <td>${formatCurrency(item.price)}</td>
          </tr>
        `,
      )
      .join("");

    return `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Project One Roofing Invoice</title>
          <style>
            body { margin: 0; padding: 48px; background: #f5f7f7; color: #071214; font-family: Arial, sans-serif; }
            .invoice { max-width: 860px; margin: 0 auto; background: white; border: 1px solid #d8e2e2; padding: 44px; }
            header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 2px solid #071214; padding-bottom: 28px; }
            h1 { margin: 0; font-size: 38px; letter-spacing: -0.02em; }
            h2 { margin: 0 0 8px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.14em; color: #087f78; }
            p { margin: 4px 0; color: #4d5c60; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-top: 36px; }
            th { text-align: left; border-bottom: 1px solid #cbd8d8; padding: 12px 0; color: #59686b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; }
            th:last-child, td:last-child { text-align: right; }
            td { border-bottom: 1px solid #e7eeee; padding: 18px 0; vertical-align: top; }
            td span { display: block; margin-top: 6px; color: #667679; font-size: 13px; }
            .total { margin-top: 32px; display: flex; justify-content: flex-end; }
            .total div { min-width: 320px; background: #071214; color: white; padding: 24px; }
            .total p { color: #a9bdc0; }
            .total strong { display: block; margin-top: 8px; font-size: 42px; }
            .note { margin-top: 28px; padding: 18px; background: #e9fbf8; border: 1px solid #abe9df; }
            .actions { margin: 28px auto 0; max-width: 860px; text-align: right; }
            button { background: #071214; color: white; border: 0; padding: 12px 18px; cursor: pointer; }
            @media print { body { background: white; padding: 0; } .invoice { border: 0; } .actions { display: none; } }
          </style>
        </head>
        <body>
          <main class="invoice">
            <header>
              <div>
                <h2>Ghost AI Solutions</h2>
                <h1>Monthly Partnership Invoice</h1>
                <p>Creative capture and marketing amplification for Project One Roofing.</p>
              </div>
              <div>
                <p><strong>Invoice date</strong></p>
                <p>${invoiceDate}</p>
                <p><strong>Client</strong></p>
                <p>Project One Roofing</p>
              </div>
            </header>
            <table>
              <thead>
                <tr><th>Selected scope</th><th>Monthly amount</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <section class="total">
              <div>
                <p>Monthly total</p>
                <strong>${formatCurrency(monthlyTotal)}</strong>
              </div>
            </section>
            <section class="note">
              <p><strong>Advertising spend is included when Paid Campaigns is selected.</strong></p>
              <p>This invoice is generated from the live proposal scope selected on the Project One Roofing proposal page.</p>
            </section>
          </main>
          <div class="actions"><button onclick="window.print()">Print or Save PDF</button></div>
        </body>
      </html>`;
  }

  function produceInvoice() {
    if (wanted.length === 0) {
      window.alert("Select at least one service before producing an invoice.");
      return;
    }

    const invoiceWindow = window.open("", "_blank", "width=980,height=1100");
    if (!invoiceWindow) {
      window.alert("Please allow popups to produce the invoice.");
      return;
    }

    invoiceWindow.document.open();
    invoiceWindow.document.write(createInvoiceHtml());
    invoiceWindow.document.close();
    invoiceWindow.focus();
  }

  function updateSignForm(field: keyof SignForm, value: string) {
    setSignForm((current) => ({ ...current, [field]: value }));
  }

  async function sendSignedProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSendState("idle");
    setSendMessage("");

    if (wanted.length === 0) {
      window.alert("Select at least one service before confirming the scope.");
      return;
    }

    if (!signForm.name.trim() || !signForm.email.trim() || !signForm.signature.trim()) {
      window.alert("Name, email, and typed signature are required.");
      return;
    }

    setSendState("sending");

    try {
      const response = await fetch("/api/proposal-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signer: signForm,
          selectedServices: wanted.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
          })),
        }),
      });
      const result = (await response.json()) as { error?: string; id?: string; approvalId?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to send signed proposal.");
      }

      setSendState("sent");
      setSendMessage(
        `Signed proposal saved and sent. Approval ID: ${result.approvalId || "created"}. Resend ID: ${result.id || "created"}.`,
      );
    } catch (error) {
      setSendState("error");
      setSendMessage(error instanceof Error ? error.message : "Unable to send signed proposal.");
    }
  }

  return (
    <main className="proposal-shell">
      <motion.div className="fixed left-0 top-0 z-50 h-1 origin-left bg-[#27f2df]" style={{ scaleX: progress }} />

      <nav className="fixed left-0 right-0 top-0 z-40 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-lg border border-white/10 bg-[#031010]/75 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-3" aria-label="Ghost AI Solutions proposal top">
            <span className="relative h-10 w-10 overflow-hidden rounded-md border border-[#27f2df]/45 bg-black">
              <Image src="/ghost-ai-logo.png" alt="" fill sizes="40px" className="object-cover" />
            </span>
            <span className="hidden text-sm font-medium text-white sm:inline">Ghost AI Solutions</span>
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="text-sm text-[#adc0c3] transition hover:text-white">
                {label}
              </a>
            ))}
          </div>
          <a
            href="#investment"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-[#061013] transition hover:bg-[#27f2df]"
          >
            Review Fit
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section id="top" className="relative min-h-screen px-5 pb-20 pt-28">
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_50%_10%,rgba(39,242,223,0.2),transparent_44%)]" />
        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#27f2df]">
                Project One Roofing proposal
              </p>
              <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[1.03] text-white md:text-7xl">
                Build the growth support plan around what Project One actually wants.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#b8cacc]">
                Their sales team exists. Their tech team exists. Ghost should fill the gap around premium field
                capture, proof, distribution, and campaign support.
              </p>
              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  [formatCurrency(monthlyTotal), "monthly total"],
                  [wanted.some((item) => item.id === "ads") ? "Included" : "Optional", "ad spend"],
                  [`${wanted.length}`, "active priorities"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <p className="font-mono text-2xl text-white">{value}</p>
                    <p className="mt-1 text-sm text-[#8aa1a4]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <section
              id="builder"
              className="relative overflow-hidden rounded-lg border border-white/10 bg-[#071214]/88 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27f2df] to-transparent" />
              <div className="flex flex-col gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Partnership Builder</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Priority fit</h2>
                </div>
                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-[#27f2df]/30 bg-black">
                  <Image src="/ghost-ai-logo.png" alt="Ghost AI Solutions logo" fill sizes="64px" className="object-cover" priority />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="grid grid-cols-[1fr_82px_82px] gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8aa1a4]">
                  <span>Priority</span>
                  <span className="text-center">Want</span>
                  <span className="text-center">Not now</span>
                </div>
                {priorities.map((priority) => {
                  const Icon = priority.icon;
                  return (
                    <div
                      key={priority.id}
                      className="grid grid-cols-[1fr_82px_82px] items-center gap-2 rounded-lg border border-white/10 bg-black/18 p-3 transition hover:border-[#27f2df]/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#27f2df]/10 text-[#27f2df]">
                          <Icon size={19} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{priority.title}</p>
                          <p className="mt-1 text-sm text-[#8aa1a4]">{priority.short}</p>
                          <p className="mt-2 font-mono text-xs text-[#27f2df]">{formatCurrency(priority.price)}/mo</p>
                        </div>
                      </div>
                      {(["want", "pass"] as Preference[]).map((preference) => (
                        <label
                          key={preference}
                          className="grid h-11 cursor-pointer place-items-center rounded-md border border-white/10 bg-white/[0.03] transition hover:border-[#27f2df]/50"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#27f2df]"
                            checked={preferences[priority.id] === preference}
                            onChange={() => setPreference(priority.id, preference)}
                            aria-label={`${priority.title} ${preference === "want" ? "wanted" : "not now"}`}
                          />
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>
          </Reveal>
        </div>
      </section>

      <section id="scope" className="section-pad bg-black/20">
        <SectionHeading
          eyebrow="Recommended Scope"
          title={planMode}
          body="The proposal should feel selected, not dumped on them. These are the pieces currently marked as useful for Project One."
        />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="grid gap-3">
              {wanted.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.id} className="rounded-lg border border-white/10 bg-[#071214]/75 p-5">
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#27f2df] text-[#041010]">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="font-mono text-xs text-[#27f2df]">0{index + 1}</p>
                        <h3 className="mt-1 text-xl font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 leading-7 text-[#a9bdc0]">{item.detail}</p>
                        <p className="mt-3 font-mono text-sm text-[#27f2df]">{formatCurrency(item.price)} per month</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="sticky top-28 rounded-lg border border-[#27f2df]/25 bg-[#061314] p-6 shadow-[0_0_80px_rgba(39,242,223,0.1)]">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Proposal Logic</p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight text-white">
                Build around proof. Do not sell them tools they already have.
              </h3>
              <div className="mt-7 grid gap-4">
                {wanted.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4">
                    <Check className="mt-1 shrink-0 text-[#27f2df]" size={18} />
                    <p className="text-sm leading-6 text-[#cfe0e2]">{item.proof}</p>
                  </div>
                ))}
              </div>
              {passed.length > 0 ? (
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-sm font-medium text-white">Not emphasized right now</p>
                  <p className="mt-2 text-sm leading-6 text-[#8aa1a4]">
                    {passed.map((item) => item.title).join(", ")}
                  </p>
                </div>
              ) : null}
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <SectionHeading
          eyebrow="Operating Model"
          title="Ghost supports the teams Project One already has."
          body="This should not read like a generic agency takeover. The pitch is to supply better assets, better visibility, and better proof for the people already selling and operating the business."
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            ["Sales team", "Gets project proof, credibility clips, testimonials, and follow-up assets."],
            ["Tech team", "Keeps owning internal systems while Ghost feeds the market-facing layer."],
            ["Leadership", "Gets one clean monthly investment, reporting, and a practical growth rhythm."],
          ].map(([title, copy], index) => (
            <Reveal key={title} delay={index * 0.06}>
              <div className="h-full rounded-lg border border-white/10 bg-white/[0.035] p-6">
                <p className="text-2xl font-semibold text-white">{title}</p>
                <p className="mt-4 leading-7 text-[#a9bdc0]">{copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="roadmap" className="section-pad bg-[#020606]/80">
        <SectionHeading
          eyebrow="90 Day Path"
          title="Small enough to approve. Strong enough to matter."
          body="The first phase should prove value through actual assets in market, not a huge abstract marketing plan."
        />
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          {roadmapBase.map((phase, index) => (
            <Reveal key={phase.label} delay={index * 0.08}>
              <article className="h-full rounded-lg border border-white/10 bg-[#071214]/75 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">{phase.label}</p>
                <h3 className="mt-4 text-3xl font-semibold text-white">{phase.title}</h3>
                <p className="mt-4 leading-7 text-[#a9bdc0]">{phase.copy}</p>
                <div className="mt-7 space-y-3">
                  {wanted.slice(index * 3, index * 3 + 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm text-[#d7e6e8]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#27f2df]" />
                      {item.title}
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="investment" className="section-pad">
        <SectionHeading
          eyebrow="Investment"
          title="One partnership, one monthly number, selected scope."
          body="The number stays simple. The scope can flex around what Project One wants to prioritize first."
        />
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="rounded-lg border border-[#27f2df]/30 bg-[#071214] p-7 shadow-[0_0_80px_rgba(39,242,223,0.12)]">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-white text-[#061013]">
                  <CircleDollarSign />
                </span>
                <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8aa1a4]">Monthly Partnership</p>
                  <p className="text-xl font-semibold text-white">Creative capture + amplification</p>
                </div>
              </div>
              <div className="mt-10 flex items-end gap-3">
                <p className="text-6xl font-semibold text-white">{formatCurrency(monthlyTotal)}</p>
                <p className="pb-2 text-[#a9bdc0]">/ month</p>
              </div>
              <div className="mt-7 rounded-md border border-[#27f2df]/25 bg-[#27f2df]/10 p-4">
                <p className="font-medium text-white">
                  {wanted.some((item) => item.id === "ads") ? "Advertising spend included." : "Paid campaigns are not selected."}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#a9bdc0]">
                  The total updates as services are added or removed from the starting scope.
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={produceInvoice}
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 px-4 font-semibold text-white transition hover:border-[#27f2df]/60 hover:text-[#27f2df]"
                >
                  Produce Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setIsSigning(true)}
                  className="inline-flex h-12 items-center justify-center rounded-md bg-white px-4 font-semibold text-[#061013] transition hover:bg-[#27f2df]"
                >
                  Digitally Sign
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Current Fit</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {wanted.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/20 px-4 py-3">
                    <span className="flex items-center gap-3">
                      <Check size={16} className="text-[#27f2df]" />
                      <span className="text-sm text-[#d7e6e8]">{item.title}</span>
                    </span>
                    <span className="font-mono text-xs text-[#27f2df]">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-sm text-[#a9bdc0]">Selected monthly total</span>
                <span className="font-mono text-2xl text-white">{formatCurrency(monthlyTotal)}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative flex min-h-[76vh] items-center px-5 py-24">
        <div className="absolute inset-x-0 top-1/4 h-72 bg-[#27f2df]/10 blur-3xl" />
        <Reveal>
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#27f2df]">Next Step</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-7xl">
              Start with the priorities they choose, then earn the right to expand.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#b8cacc]">
              That feels more honest for Project One Roofing and more valuable for Ghost AI Solutions.
            </p>
            <button
              type="button"
              onClick={() => setIsSigning(true)}
              className="mt-10 inline-flex h-14 items-center justify-center gap-3 rounded-md bg-white px-6 font-semibold text-[#061013] transition hover:bg-[#27f2df]"
            >
              Confirm Starting Scope
              <ArrowRight size={18} />
            </button>
          </div>
        </Reveal>
      </section>

      {isSigning ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-md">
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onSubmit={sendSignedProposal}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#27f2df]/25 bg-[#071214] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Digital Approval</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Confirm selected scope</h2>
                <p className="mt-2 text-sm leading-6 text-[#a9bdc0]">
                  This creates a signed approval email with the selected services and monthly total.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSigning(false)}
                className="rounded-md border border-white/10 px-3 py-2 text-sm text-[#a9bdc0] transition hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#a9bdc0]">Monthly total</span>
                <span className="font-mono text-2xl text-white">{formatCurrency(monthlyTotal)}</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {wanted.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 rounded-md bg-white/[0.035] px-3 py-2 text-sm">
                    <span className="text-[#d7e6e8]">{item.title}</span>
                    <span className="font-mono text-[#27f2df]">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-white">Signer name</span>
                <input
                  value={signForm.name}
                  onChange={(event) => updateSignForm("name", event.target.value)}
                  className="h-11 rounded-md border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#27f2df]"
                  required
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-white">Signer email</span>
                <input
                  type="email"
                  value={signForm.email}
                  onChange={(event) => updateSignForm("email", event.target.value)}
                  className="h-11 rounded-md border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#27f2df]"
                  required
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-white">Title</span>
                <input
                  value={signForm.title}
                  onChange={(event) => updateSignForm("title", event.target.value)}
                  className="h-11 rounded-md border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#27f2df]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-white">Company</span>
                <input
                  value={signForm.company}
                  onChange={(event) => updateSignForm("company", event.target.value)}
                  className="h-11 rounded-md border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#27f2df]"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2">
              <span className="text-sm font-medium text-white">Typed signature</span>
              <input
                value={signForm.signature}
                onChange={(event) => updateSignForm("signature", event.target.value)}
                placeholder="Type full legal name"
                className="h-12 rounded-md border border-white/10 bg-black/30 px-3 text-white outline-none transition focus:border-[#27f2df]"
                required
              />
            </label>

            <label className="mt-4 grid gap-2">
              <span className="text-sm font-medium text-white">Notes or requested adjustments</span>
              <textarea
                value={signForm.notes}
                onChange={(event) => updateSignForm("notes", event.target.value)}
                rows={3}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-3 text-white outline-none transition focus:border-[#27f2df]"
              />
            </label>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={produceInvoice}
                disabled={sendState === "sending"}
                className="h-12 rounded-md border border-white/15 px-4 font-semibold text-white transition hover:border-[#27f2df]/60 hover:text-[#27f2df]"
              >
                Produce Invoice
              </button>
              <button
                type="submit"
                disabled={sendState === "sending"}
                className="h-12 rounded-md bg-[#27f2df] px-4 font-semibold text-[#041010] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendState === "sending" ? "Sending..." : "Send Signed Approval"}
              </button>
            </div>
            {sendMessage ? (
              <div
                className={`mt-4 rounded-md border p-4 text-sm ${
                  sendState === "sent"
                    ? "border-[#27f2df]/35 bg-[#27f2df]/10 text-[#d7fffb]"
                    : "border-red-400/35 bg-red-500/10 text-red-100"
                }`}
              >
                {sendMessage}
              </div>
            ) : null}
          </motion.form>
        </div>
      ) : null}
    </main>
  );
}
