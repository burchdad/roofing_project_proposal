"use client";

import Image from "next/image";
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
};

const priorities: Priority[] = [
  {
    id: "photo",
    title: "Photography",
    short: "Jobsite, team, and before/after assets",
    detail: "Professional stills from active jobs, crews, finished roofs, homeowners, and brand moments.",
    icon: Camera,
    proof: "Reusable image library for ads, social, GBP, landing pages, and sales follow-up.",
  },
  {
    id: "video",
    title: "Videography",
    short: "Project stories and trust-building clips",
    detail: "Short-form and campaign-ready video around transformations, process, crew quality, and customer proof.",
    icon: Film,
    proof: "Edited video assets for Meta, YouTube, website embeds, and sales nurture.",
  },
  {
    id: "drone",
    title: "Drone Capture",
    short: "Premium aerial proof of roofing work",
    detail: "Aerial capture that shows scale, roof condition, craftsmanship, and finished property context.",
    icon: Radio,
    proof: "High-authority visuals that make Project One look bigger, sharper, and more trusted.",
  },
  {
    id: "local",
    title: "Local Search",
    short: "Google visibility and local authority",
    detail: "Google Business Profile, local pages, project posts, and search signals built from real field content.",
    icon: MapPin,
    proof: "More ways to appear when property owners search for roofing help nearby.",
  },
  {
    id: "ads",
    title: "Paid Campaigns",
    short: "Ad spend included in the partnership",
    detail: "Campaign management with creative testing, audience targeting, and lead-quality optimization.",
    icon: Target,
    proof: "A predictable paid channel supported by original creative instead of generic ad content.",
  },
  {
    id: "social",
    title: "Social Distribution",
    short: "Turn field work into market presence",
    detail: "A practical publishing rhythm that keeps Project One visible without burdening the internal team.",
    icon: Megaphone,
    proof: "Consistent proof that the company is active, professional, and trusted locally.",
  },
  {
    id: "reviews",
    title: "Reputation Proof",
    short: "Reviews, testimonials, and trust assets",
    detail: "Review growth, testimonial capture, customer proof, and credibility assets for sales and search.",
    icon: ShieldCheck,
    proof: "Better confidence before the first call and stronger support after estimates are sent.",
  },
  {
    id: "geo",
    title: "AI Search Visibility",
    short: "GEO content for emerging search behavior",
    detail: "Structured authority signals that help AI search engines understand Project One's work and relevance.",
    icon: Globe2,
    proof: "A stronger presence as customers shift from classic search to answer engines.",
  },
  {
    id: "reporting",
    title: "Reporting",
    short: "Monthly clarity for leadership",
    detail: "Simple reporting on content captured, campaign performance, visibility, calls, leads, and next moves.",
    icon: BarChart3,
    proof: "A clear view of what is working without turning marketing into another internal project.",
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
                  ["$9,500", "monthly investment"],
                  ["Ad spend", "included"],
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
                <p className="text-6xl font-semibold text-white">$9,500</p>
                <p className="pb-2 text-[#a9bdc0]">/ month</p>
              </div>
              <div className="mt-7 rounded-md border border-[#27f2df]/25 bg-[#27f2df]/10 p-4">
                <p className="font-medium text-white">Advertising spend included.</p>
                <p className="mt-2 text-sm leading-6 text-[#a9bdc0]">No separate media budget conversation. No hidden production fees.</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#27f2df]">Current Fit</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {wanted.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-4 py-3">
                    <Check size={16} className="text-[#27f2df]" />
                    <span className="text-sm text-[#d7e6e8]">{item.title}</span>
                  </div>
                ))}
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
            <a
              href="mailto:hello@ghostaisolutions.com?subject=Project%20One%20Roofing%20Partnership"
              className="mt-10 inline-flex h-14 items-center justify-center gap-3 rounded-md bg-white px-6 font-semibold text-[#061013] transition hover:bg-[#27f2df]"
            >
              Confirm Starting Scope
              <ArrowRight size={18} />
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
