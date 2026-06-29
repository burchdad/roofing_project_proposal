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
  FileText,
  Film,
  Globe2,
  MapPin,
  Megaphone,
  Radio,
  ShieldCheck,
  Target,
} from "lucide-react";
import { proposalDocs } from "@/lib/proposalDocs";

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
    proof: "High-authority visuals that make your work look bigger, sharper, and more trusted.",
    price: 1250,
  },
  {
    id: "local",
    title: "Local Search",
    short: "Google visibility and local authority",
    detail: "Lightweight Google Business Profile and local visibility support built from the field content we capture for you.",
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
    detail: "A practical publishing rhythm that keeps you visible without burdening your internal team.",
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
    detail: "Included GEO support that structures your selected project proof for AI search and answer engines.",
    icon: Globe2,
    proof: "A lighter included layer because GEO support is already part of the broader content system.",
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

const recommendedPaidCampaignAmount = 3300;
const clientPortalBaseUrl =
  process.env.NEXT_PUBLIC_CLIENT_PORTAL_BASE_URL || "https://www.ghostai.solutions/client-portal";

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
  ["Docs", "#documents"],
];

const roadmapBase = [
  {
    label: "Month 1",
    title: "Decide The Scope",
    copy: "Confirm your priorities, build the shoot calendar, review existing assets, and set the first campaign lane.",
  },
  {
    label: "Month 2",
    title: "Capture The Proof",
    copy: "Produce field media, package project stories, publish priority content, and support your sales follow-up.",
  },
  {
    label: "Month 3",
    title: "Amplify What Works",
    copy: "Scale the strongest creative, improve local visibility, review lead quality, and plan the next month.",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
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
  const [paidCampaignAmount, setPaidCampaignAmount] = useState(String(recommendedPaidCampaignAmount));
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
  const [approvalId, setApprovalId] = useState("");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  const paidCampaignBudget = useMemo(() => {
    const parsed = Number(paidCampaignAmount);
    return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
  }, [paidCampaignAmount]);

  const pricedPriorities = useMemo(
    () =>
      priorities.map((priority) =>
        priority.id === "ads" ? { ...priority, price: paidCampaignBudget } : priority,
      ),
    [paidCampaignBudget],
  );

  const wanted = useMemo(
    () => pricedPriorities.filter((priority) => preferences[priority.id] === "want"),
    [preferences, pricedPriorities],
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

  const clientPortalCreateUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (approvalId) params.set("invite", approvalId);
    if (signForm.email.trim()) params.set("email", signForm.email.trim());
    const query = params.toString();
    return `${clientPortalBaseUrl.replace(/\/+$/, "")}/create-account${query ? `?${query}` : ""}`;
  }, [approvalId, signForm.email]);

  const clientPortalSignInUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (signForm.email.trim()) params.set("email", signForm.email.trim());
    const query = params.toString();
    return `${clientPortalBaseUrl.replace(/\/+$/, "")}/sign-in${query ? `?${query}` : ""}`;
  }, [signForm.email]);

  function setPreference(id: string, preference: Preference) {
    setPreferences((current) => ({ ...current, [id]: preference }));
  }

  function updateSignForm(field: keyof SignForm, value: string) {
    setSignForm((current) => ({ ...current, [field]: value }));
  }

  function openSigning() {
    setSendState("idle");
    setSendMessage("");
    setIsSigning(true);
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

      setApprovalId(result.approvalId || "");
      setSendState("sent");
      setSendMessage("");
    } catch (error) {
      setSendState("error");
      setSendMessage(error instanceof Error ? error.message : "Unable to send signed proposal.");
    }
  }

  return (
    <main className="proposal-shell">
      <motion.div className="fixed left-0 top-0 z-50 h-1 origin-left bg-[#27f2df]" style={{ scaleX: progress }} />

      <nav className="fixed left-0 right-0 top-0 z-40 px-3 py-3 sm:px-4 sm:py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#031010]/85 px-3 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-4">
          <a href="#top" className="flex items-center gap-3" aria-label="Ghost AI Solutions proposal top">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-[#27f2df]/45 bg-black sm:h-10 sm:w-10">
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
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-[#061013] transition hover:bg-[#27f2df] sm:px-4"
          >
            <span className="sm:hidden">Review</span>
            <span className="hidden sm:inline">Review Scope</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section id="top" className="relative px-4 pb-14 pt-24 sm:px-5 sm:pb-20 sm:pt-28 lg:min-h-screen">
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_50%_10%,rgba(39,242,223,0.2),transparent_44%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <Reveal>
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#27f2df]">
                Project One Roofing proposal
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.03] text-white sm:text-5xl md:text-7xl">
                Choose the growth support that matches your priorities.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-[#b8cacc] sm:text-lg sm:leading-8">
                Your sales team is already in place. Your tech team is already in place. Ghost fills the gap around
                premium field capture, trust-building proof, distribution, and campaign support.
              </p>
              <div className="mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
                {[
                  [formatCurrency(monthlyTotal), "monthly total"],
                  [wanted.some((item) => item.id === "ads") ? "Included" : "Optional", "ad spend"],
                  [`${wanted.length}`, "active priorities"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                    <p className="break-words font-mono text-lg text-white sm:text-2xl">{value}</p>
                    <p className="mt-1 text-xs leading-4 text-[#8aa1a4] sm:text-sm">{label}</p>
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
                  <h2 className="mt-2 text-2xl font-semibold text-white">Select your priorities</h2>
                </div>
                <div className="relative h-16 w-16 overflow-hidden rounded-md border border-[#27f2df]/30 bg-black">
                  <Image src="/ghost-ai-logo.png" alt="Ghost AI Solutions logo" fill sizes="64px" className="object-cover" priority />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="hidden grid-cols-[minmax(0,1fr)_82px_82px] gap-2 px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8aa1a4] sm:grid">
                  <span>Priority</span>
                  <span className="text-center">Want</span>
                  <span className="text-center">Not now</span>
                </div>
                {pricedPriorities.map((priority) => {
                  const Icon = priority.icon;
                  return (
                    <div
                      key={priority.id}
                      className="grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-black/18 p-3 transition hover:border-[#27f2df]/40 sm:grid-cols-[minmax(0,1fr)_82px_82px] sm:items-center sm:gap-2"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#27f2df]/10 text-[#27f2df]">
                          <Icon size={19} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{priority.title}</p>
                          <p className="mt-1 text-sm text-[#8aa1a4]">{priority.short}</p>
                          {priority.id === "ads" ? (
                            <div className="mt-3 grid gap-2 sm:grid-cols-[auto_132px] sm:items-center">
                              <p className="font-mono text-xs text-[#27f2df]">
                                Recommended {formatCurrency(recommendedPaidCampaignAmount)}/mo
                              </p>
                              <label className="flex h-9 items-center rounded-md border border-[#27f2df]/25 bg-black/30 px-2 focus-within:border-[#27f2df]">
                                <span className="font-mono text-xs text-[#8aa1a4]">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="50"
                                  value={paidCampaignAmount}
                                  onChange={(event) => setPaidCampaignAmount(event.target.value)}
                                  className="h-full min-w-0 flex-1 bg-transparent pl-1 font-mono text-xs text-white outline-none"
                                  aria-label="Custom paid campaigns monthly amount"
                                />
                                <span className="font-mono text-xs text-[#8aa1a4]">/mo</span>
                              </label>
                            </div>
                          ) : (
                            <p className="mt-2 font-mono text-xs text-[#27f2df]">{formatCurrency(priority.price)}/mo</p>
                          )}
                        </div>
                      </div>
                      {(["want", "pass"] as Preference[]).map((preference) => (
                        <label
                          key={preference}
                          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.03] transition hover:border-[#27f2df]/50 sm:grid sm:place-items-center"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#27f2df]"
                            checked={preferences[priority.id] === preference}
                            onChange={() => setPreference(priority.id, preference)}
                            aria-label={`${priority.title} ${preference === "want" ? "wanted" : "not now"}`}
                          />
                          <span className="text-xs font-semibold text-[#d7e6e8] sm:hidden">
                            {preference === "want" ? "Want" : "Not now"}
                          </span>
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
          eyebrow="Your Selected Scope"
          title={planMode}
          body="Start with the services that matter most now. Add or remove items to shape the first phase around your priorities."
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
            <aside className="rounded-lg border border-[#27f2df]/25 bg-[#061314] p-5 shadow-[0_0_80px_rgba(39,242,223,0.1)] sm:p-6 lg:sticky lg:top-28">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Why This Works</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Built around proof, not tools you already have.
              </h3>
              <div className="mt-7 grid gap-4">
                {wanted.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4">
                    <Check className="mt-1 shrink-0 text-[#27f2df]" size={18} />
                    <p className="text-sm leading-6 text-[#cfe0e2]">{item.proof}</p>
                  </div>
                ))}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <SectionHeading
          eyebrow="How Ghost Fits"
          title="Ghost supports the teams you already have."
          body="Your internal teams stay focused on sales, operations, and systems. We support your team with better assets, better visibility, and better proof in market."
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            ["Sales team", "Receives project proof, credibility clips, testimonials, and follow-up assets."],
            ["Tech team", "Keeps ownership of internal systems while Ghost supports the market-facing layer."],
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
          title="A focused first phase with room to grow."
          body="The first 90 days are built to prove value through real assets in market, not a huge abstract marketing plan."
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
          body="The number stays simple. Your scope can flex around the services you want to prioritize first."
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
              <div className="mt-8 flex flex-wrap items-end gap-2 sm:mt-10 sm:gap-3">
                <p className="text-5xl font-semibold text-white sm:text-6xl">{formatCurrency(monthlyTotal)}</p>
                <p className="pb-2 text-[#a9bdc0]">/ month</p>
              </div>
              <button
                type="button"
                onClick={openSigning}
                className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-md bg-white px-4 font-semibold text-[#061013] transition hover:bg-[#27f2df]"
              >
                Approve Proposal
              </button>
              <p className="mt-4 text-sm leading-6 text-[#8aa1a4]">
                Approval saves your selected scope and sends a copy to you and Ghost. Billing, payment, and onboarding
                move into your client portal after acceptance. Supporting proposal documents are linked below and included
                with the signed email copy.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Selected Scope</p>
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

        <div id="documents" className="mx-auto mt-8 max-w-6xl scroll-mt-24 rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Proposal Documents</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Review the supporting terms before approval.</h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#a9bdc0]">
              These pages clarify scope, billing, responsibilities, change requests, and service terms. A copy of each is
              sent after signature.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {proposalDocs.map((doc) => (
              <a
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="group rounded-lg border border-white/10 bg-black/20 p-4 transition hover:border-[#27f2df]/50 hover:bg-[#27f2df]/10"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-[#27f2df]/10 text-[#27f2df]">
                  <FileText size={18} />
                </span>
                <p className="mt-4 font-semibold text-white group-hover:text-[#27f2df]">{doc.shortTitle}</p>
                <p className="mt-2 text-sm leading-6 text-[#8aa1a4]">{doc.summary}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {isSigning ? (
        <div className="fixed inset-0 z-50 grid items-end bg-black/75 px-3 pb-3 pt-16 backdrop-blur-md sm:place-items-center sm:p-4">
          {sendState === "sent" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#27f2df]/25 bg-[#071214] p-5 text-center shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:p-8"
            >
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#27f2df] text-[#041010]">
                <Check size={30} />
              </span>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-[#27f2df]">Proposal Approved</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">Thank you. Your scope is confirmed.</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#a9bdc0]">
                A signed copy has been emailed to you and Ghost AI Solutions. Your invoice will be sent out soon, and
                you can create or access your client portal for onboarding, billing, and project next steps.
              </p>
              <div className="mt-7 rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-[#a9bdc0]">Approved monthly scope</p>
                <p className="mt-2 break-words font-mono text-3xl text-white sm:text-4xl">{formatCurrency(monthlyTotal)}</p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <a
                  href={clientPortalCreateUrl}
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-md bg-white px-4 font-semibold text-[#061013] transition hover:bg-[#27f2df]"
                >
                  Create Account
                  <ArrowRight size={18} />
                </a>
                <a
                  href={clientPortalSignInUrl}
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/15 px-4 font-semibold text-white transition hover:border-[#27f2df]/60 hover:text-[#27f2df]"
                >
                  Sign In
                </a>
              </div>
              <button
                type="button"
                onClick={() => setIsSigning(false)}
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-md border border-white/15 px-4 font-semibold text-white transition hover:border-[#27f2df]/60 hover:text-[#27f2df]"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onSubmit={sendSignedProposal}
              className="max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#27f2df]/25 bg-[#071214] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:max-h-[92vh] sm:p-6"
            >
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Digital Approval</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Confirm selected scope</h2>
                  <p className="mt-2 text-sm leading-6 text-[#a9bdc0]">
                    This saves your signed proposal and emails a copy to you and Ghost. Billing and payment happen later
                    inside your client portal. Your approval includes the linked proposal documents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSigning(false)}
                  className="w-fit rounded-md border border-white/10 px-3 py-2 text-sm text-[#a9bdc0] transition hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#a9bdc0]">Monthly total</span>
                  <span className="font-mono text-xl text-white sm:text-2xl">{formatCurrency(monthlyTotal)}</span>
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

              <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4 text-sm leading-6 text-[#a9bdc0]">
                By approving, I confirm I am authorized to approve this selected scope and I have had access to the
                supporting proposal documents:{" "}
                {proposalDocs.map((doc, index) => (
                  <span key={doc.slug}>
                    <a className="font-semibold text-[#27f2df] underline-offset-4 hover:underline" href={`/docs/${doc.slug}`}>
                      {doc.shortTitle}
                    </a>
                    {index < proposalDocs.length - 1 ? ", " : "."}
                  </span>
                ))}
              </div>

              <label className="mt-4 grid gap-2">
                <span className="text-sm font-medium text-white">Notes or requested adjustments</span>
                <textarea
                  value={signForm.notes}
                  onChange={(event) => updateSignForm("notes", event.target.value)}
                  rows={3}
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-3 text-white outline-none transition focus:border-[#27f2df]"
                />
              </label>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={sendState === "sending"}
                  className="h-12 w-full rounded-md bg-[#27f2df] px-4 font-semibold text-[#041010] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendState === "sending" ? "Sending..." : "Approve Selected Scope"}
                </button>
              </div>
              {sendMessage ? (
                <div className="mt-4 rounded-md border border-red-400/35 bg-red-500/10 p-4 text-sm text-red-100">
                  {sendMessage}
                </div>
              ) : null}
            </motion.form>
          )}
        </div>
      ) : null}
    </main>
  );
}
