"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  Camera,
  Check,
  ChevronDown,
  CircleDollarSign,
  Crown,
  Film,
  Gauge,
  Globe2,
  LineChart,
  MapPin,
  Megaphone,
  MessageSquareText,
  MousePointer2,
  Radio,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from "lucide-react";

const navItems = [
  ["Summary", "#summary"],
  ["Strategy", "#strategy"],
  ["Roadmap", "#roadmap"],
  ["Investment", "#investment"],
  ["Partner", "#partner"],
];

const strategyCards = [
  { title: "Local SEO", icon: MapPin, body: "Own high-intent neighborhood searches before competitors enter the conversation." },
  { title: "Ghost Engine Optimization", icon: Globe2, body: "Structure authority so AI search surfaces Project One Roofing with confidence." },
  { title: "Google Business Profile", icon: Star, body: "Improve local proof, visibility, calls, and trust signals where buyers decide." },
  { title: "Project Storytelling", icon: MessageSquareText, body: "Turn crews, installs, transformations, and customer outcomes into marketable proof." },
  { title: "Photography", icon: Camera, body: "Capture jobsite quality, team professionalism, before-and-after detail, and brand trust." },
  { title: "Videography", icon: Film, body: "Create premium field content for ads, social, recruiting, reputation, and sales follow-up." },
  { title: "Drone Capture", icon: Radio, body: "Show roof scale, property context, craftsmanship, and finished results from a premium perspective." },
  { title: "Paid Advertising", icon: Target, body: "Deploy spend with clear lead economics, tight targeting, and weekly optimization." },
  { title: "Social Distribution", icon: Megaphone, body: "Turn every shoot into a steady stream of visible, credible local content." },
  { title: "Review Growth", icon: ShieldCheck, body: "Build reputation velocity with a disciplined customer proof engine." },
  { title: "Analytics", icon: BarChart3, body: "Connect activity to leads, calls, quotes, conversion rate, and revenue momentum." },
  { title: "Monthly Strategy", icon: Crown, body: "Give sales and leadership a clear content, campaign, and visibility plan." },
];

const captureTeam = [
  "Creative Director",
  "Photography",
  "Videography",
  "Drone Capture",
  "Project Stories",
  "Social Distribution",
  "Paid Campaigns",
  "SEO/GEO",
  "Reputation Assets",
];

const roadmap = [
  {
    month: "Month 1",
    title: "Capture Foundation",
    points: ["Brand asset audit", "Shoot calendar", "Drone capture plan", "SEO/GEO audit", "Campaign setup", "Google Business Profile"],
  },
  {
    month: "Month 2",
    title: "Field Content Engine",
    points: ["Jobsite photography", "Video production", "Drone footage", "Social distribution", "Review capture", "Sales enablement clips"],
  },
  {
    month: "Month 3",
    title: "Amplification",
    points: ["Scale campaigns", "Improve ROAS", "Refresh local pages", "Repurpose top content", "Conversion optimization", "Monthly reporting"],
  },
];

const kpis = [
  "Leads Generated",
  "Conversion Rate",
  "Website Traffic",
  "Google Rankings",
  "GBP Views",
  "Calls",
  "Quote Requests",
  "Project Assets Captured",
  "Cost Per Lead",
  "Return on Ad Spend",
  "Brand Visibility",
  "AI Visibility",
];

const includes = [
  "Paid Advertising Management",
  "Advertising Budget Included",
  "Professional Photography",
  "Video Production",
  "Drone Capture",
  "Jobsite Content Shoots",
  "Sales Enablement Assets",
  "Social Media Management",
  "SEO",
  "Ghost Engine Optimization",
  "Google Business Profile",
  "Review Growth",
  "Analytics",
  "Monthly Reporting",
  "Monthly Strategy Sessions",
];

const traditional = ["Website", "Ads", "Posts"];
const ghost = [
  "Executive Strategy",
  "Field Capture",
  "Sales Team Support",
  "SEO",
  "GEO",
  "Photography",
  "Videography",
  "Drone Capture",
  "Analytics",
  "Brand Authority",
  "Reputation Proof",
  "Campaign Amplification",
  "Monthly Planning",
  "Long-term Partnership",
];

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <p className="font-mono text-xs uppercase text-[#27f2df]">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-[#adc0c3]">{body}</p>
    </motion.div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.72, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [activeDept, setActiveDept] = useState("Creative Director");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });
  const heroY = useTransform(scrollYProgress, [0, 0.22], [0, 140]);

  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(
      heroRef.current.querySelectorAll("[data-hero-item]"),
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" },
    );
  }, []);

  return (
    <main className="proposal-shell">
      <motion.div className="fixed left-0 top-0 z-50 h-1 origin-left bg-[#27f2df]" style={{ scaleX: progress }} />

      <nav className="fixed left-0 right-0 top-0 z-40 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#031010]/70 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-3" aria-label="Ghost AI Solutions proposal top">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[#27f2df]/45 bg-black">
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
            href="#partner"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#061013] transition hover:bg-[#27f2df]"
          >
            <span>Discuss</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>

      <section id="top" ref={heroRef} className="relative flex min-h-screen items-center px-5 pb-20 pt-28">
        <div className="light-sweep absolute inset-y-0 left-0 w-2/3" />
        <motion.div style={{ y: heroY }} className="absolute inset-x-4 top-28 mx-auto h-80 max-w-5xl rounded-full bg-[#27f2df]/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="relative">
            <p data-hero-item className="font-mono text-xs uppercase text-[#27f2df] opacity-0">
              Project One Roofing x Ghost AI Solutions
            </p>
            <h1 data-hero-item className="mt-7 max-w-5xl text-5xl font-semibold leading-[1.02] text-white opacity-0 md:text-7xl lg:text-8xl">
              Your Sales And Tech Teams Are Already In Place.
              <span className="aqua-text block">Now Let&apos;s Give Them The Content Engine To Win The Market.</span>
            </h1>
            <p data-hero-item className="mt-8 max-w-2xl text-xl leading-9 text-[#bdd0d2] opacity-0">
              Ghost AI Solutions becomes the creative capture and marketing amplification partner behind Project One
              Roofing: photography, videography, drone content, local visibility, and reputation proof.
            </p>
            <div data-hero-item className="mt-10 flex flex-col gap-4 opacity-0 sm:flex-row">
              <a
                href="#strategy"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#27f2df] px-7 font-semibold text-[#041010] shadow-[0_0_50px_rgba(39,242,223,0.24)] transition hover:bg-white"
              >
                View Growth Strategy
                <ChevronDown size={19} />
              </a>
              <a
                href="#investment"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/15 px-7 font-semibold text-white transition hover:border-[#27f2df]/70 hover:text-[#27f2df]"
              >
                See Investment
              </a>
            </div>
          </div>

          <div data-hero-item className="glass-line relative min-h-[520px] overflow-hidden rounded-[2rem] p-6 opacity-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(39,242,223,0.22),transparent_48%)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase text-[#8aa1a4]">Growth Operating System</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Capture Engine Activated</h2>
                </div>
                <Gauge className="text-[#27f2df]" />
              </div>
              <div className="mx-auto my-4 grid h-44 w-44 place-items-center overflow-hidden rounded-full border border-[#27f2df]/30 bg-black shadow-[0_0_70px_rgba(39,242,223,0.2)]">
                <Image src="/ghost-ai-logo.png" alt="Ghost AI Solutions logo" width={176} height={176} className="h-full w-full object-cover" priority />
              </div>
              <div className="grid gap-4">
                {["Field Content", "Authority", "Lead Flow", "Reputation"].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-white">{label}</span>
                      <span className="font-mono text-[#27f2df]">{82 + index * 4}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: "18%" }}
                        animate={{ width: `${82 + index * 4}%` }}
                        transition={{ duration: 1.4, delay: 0.4 + index * 0.14, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#00a99d] to-[#5cc8ff]"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["SEO", "GEO", "ROAS"].map((label) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
                    <p className="font-mono text-2xl text-white">{label}</p>
                    <p className="mt-1 text-xs text-[#8aa1a4]">tracked weekly</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="summary" className="section-pad">
        <SectionHeader
          eyebrow="Executive Summary"
          title="The Teams Are In Place. The Market Proof Is The Next Move."
          body="Project One Roofing already has sales capability and technical capability. The opportunity now is to surround those teams with premium field content, local authority, and consistent campaign execution."
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-4">
          {[
            ["Capture", "Document the work with photography, video, drone footage, and project stories."],
            ["Trust", "Turn finished roofs, crew professionalism, and reviews into buyer confidence."],
            ["Consistency", "Transform jobsite activity into a steady content and campaign cadence."],
            ["Enablement", "Give the sales team better proof for follow-up, referrals, and close support."],
          ].map(([title, body], index) => (
            <Reveal key={title} delay={index * 0.07}>
              <div className="h-full border-l border-white/14 py-4 pl-5">
                <p className="text-2xl font-semibold text-white">{title}</p>
                <p className="mt-4 leading-7 text-[#adc0c3]">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-black/20">
        <SectionHeader
          eyebrow="Why This Partnership"
          title="Sales And Technology Still Need Market Proof."
          body="Their team can sell. Their tech stack can support operations. Ghost fills the gap between great work in the field and the premium proof buyers need to see before they choose a roofer."
        />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="sticky top-28">
              <p className="text-3xl font-semibold leading-tight text-white md:text-5xl">
                We are not replacing their sales team or tech team. We are giving both teams better assets.
              </p>
              <p className="mt-6 text-lg leading-8 text-[#adc0c3]">
                Ghost AI Solutions captures the work, packages the proof, distributes the story, manages the visibility
                layer, and reports on which creative and campaigns move qualified roofing opportunities.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {["Qualified roofing leads", "Drone-backed project proof", "Google visibility", "AI search visibility", "Sales enablement assets", "Customer trust"].map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <div className="glass-line rounded-3xl p-6">
                  <Check className="mb-8 text-[#27f2df]" />
                  <p className="text-xl font-semibold text-white">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="strategy" className="section-pad">
        <SectionHeader
          eyebrow="Growth Strategy"
          title="A Field Content System Built For Roofing Growth."
          body="Every shoot becomes more than a post. It becomes ad creative, sales proof, review fuel, local SEO material, AI-search authority, and a stronger reason to trust Project One Roofing."
        />
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {strategyCards.map(({ title, icon: Icon, body }, index) => (
            <Reveal key={title} delay={index * 0.035}>
              <article className="glass-line h-full rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:border-[#27f2df]/45">
                <Icon className="text-[#27f2df]" size={24} />
                <h3 className="mt-8 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#9eb2b5]">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-[#020606]/70">
        <SectionHeader
          eyebrow="Creative Capture Team"
          title="Project One Roofing Gains A Premium Field Media Department."
          body="One accountable partner plans, captures, edits, distributes, and measures the project proof that supports their existing sales and technology teams."
        />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="glass-line rounded-[2rem] p-7">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#27f2df] text-[#041010]">
                  <Camera />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-[#8aa1a4]">Capture Lead</p>
                  <h3 className="text-2xl font-semibold text-white">Ghost AI Solutions</h3>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {captureTeam.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveDept(item)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      activeDept === item
                        ? "border-[#27f2df]/70 bg-[#27f2df]/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-[#adc0c3] hover:border-white/25"
                    }`}
                  >
                    <span>{item}</span>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(39,242,223,0.13),rgba(255,255,255,0.035),rgba(92,200,255,0.09))] p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(39,242,223,0.18),transparent_30%)]" />
              <div className="relative grid h-full place-items-center">
                <div className="relative h-[500px] w-full max-w-[560px]">
                  <div className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#27f2df]/50 bg-[#031010]/90 text-center shadow-[0_0_70px_rgba(39,242,223,0.22)]">
                    <Sparkles className="mx-auto mb-2 text-[#27f2df]" />
                    <p className="text-sm font-semibold text-white">Field Proof Engine</p>
                    <p className="mt-1 font-mono text-xs text-[#8aa1a4]">Project One</p>
                  </div>
                  {captureTeam.map((item, index) => {
                    const angle = (index / captureTeam.length) * Math.PI * 2 - Math.PI / 2;
                    const radius = 205;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setActiveDept(item)}
                        className={`absolute left-1/2 top-1/2 min-h-16 w-32 -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-3 text-center text-sm transition ${
                          activeDept === item
                            ? "border-[#27f2df] bg-[#27f2df] text-[#041010]"
                            : "border-white/12 bg-[#031010]/80 text-white hover:border-[#27f2df]/60"
                        }`}
                        style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
                <p className="max-w-xl text-center text-lg leading-8 text-[#d8e8e9]">
                  Active focus: <span className="font-semibold text-[#27f2df]">{activeDept}</span>. Every function
                  rolls up to one outcome: better proof in market and more qualified opportunities for Project One Roofing.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="roadmap" className="section-pad">
        <SectionHeader
          eyebrow="90 Day Execution Plan"
          title="Capture Foundation, Field Content, Amplification."
          body="The first 90 days build a repeatable capture rhythm, turn active roofing work into premium assets, then amplify what performs across search, social, ads, and sales follow-up."
        />
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {roadmap.map((phase, index) => (
            <Reveal key={phase.month} delay={index * 0.1}>
              <article className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
                <div className="absolute right-6 top-6 font-mono text-7xl text-white/[0.04]">0{index + 1}</div>
                <p className="font-mono text-xs uppercase text-[#27f2df]">{phase.month}</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">{phase.title}</h3>
                <div className="mt-9 grid gap-3">
                  {phase.points.map((point) => (
                    <div key={point} className="flex items-center gap-3 text-[#c4d6d8]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#27f2df]" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-black/20">
        <SectionHeader
          eyebrow="Performance Metrics"
          title="Measured Like A Growth Support Function."
          body="Reporting connects creative production to the signals leadership cares about: visibility, proof assets, calls, quote requests, lead quality, and campaign efficiency."
        />
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((metric, index) => (
            <Reveal key={metric} delay={index * 0.025}>
              <div className="rounded-3xl border border-white/10 bg-[#061013]/70 p-5">
                <LineChart className="text-[#5cc8ff]" size={22} />
                <p className="mt-8 text-lg font-semibold text-white">{metric}</p>
                <p className="mt-2 font-mono text-sm text-[#27f2df]">tracked monthly</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="investment" className="section-pad">
        <SectionHeader
          eyebrow="Investment"
          title="One Predictable Monthly Partnership."
          body="No hidden fees. No separate ad budget. Everything needed for creative capture, content production, campaign support, and growth visibility is included."
        />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="glass-line rounded-[2rem] p-8">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#061013]">
                  <CircleDollarSign />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase text-[#8aa1a4]">Creative Marketing Department</p>
                  <h3 className="text-2xl font-semibold text-white">Everything Included</h3>
                </div>
              </div>
              <div className="mt-10 flex items-end gap-3">
                <p className="text-7xl font-semibold text-white">$9,500</p>
                <p className="pb-3 text-[#adc0c3]">per month</p>
              </div>
              <div className="mt-8 rounded-3xl border border-[#27f2df]/30 bg-[#27f2df]/10 p-5">
                <p className="font-semibold text-white">Advertising spend included.</p>
                <p className="mt-2 leading-7 text-[#adc0c3]">Project One receives one predictable monthly investment.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {includes.map((item) => (
                <div key={item} className="flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4">
                  <Check size={17} className="shrink-0 text-[#27f2df]" />
                  <span className="text-sm text-[#d7e6e8]">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-[#020606]/80">
        <SectionHeader
          eyebrow="Why Ghost AI Solutions"
          title="A Different Category Of Partner."
          body="Traditional agencies often sell disconnected deliverables. Ghost operates as the capture, proof, and amplification layer around the team Project One already has."
        />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
              <p className="mb-8 flex items-center gap-3 text-2xl font-semibold text-white">
                <MousePointer2 className="text-[#8aa1a4]" /> Traditional Agency
              </p>
              <div className="grid gap-3">
                {traditional.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 px-4 py-4 text-[#9eb2b5]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-[#27f2df]/30 bg-[#27f2df]/8 p-7 shadow-[0_0_80px_rgba(39,242,223,0.12)]">
              <p className="mb-8 flex items-center gap-3 text-2xl font-semibold text-white">
                <BadgeDollarSign className="text-[#27f2df]" /> Ghost AI Solutions
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {ghost.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#27f2df]/20 bg-black/20 px-4 py-4 text-[#e7f6f7]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="partner" className="relative flex min-h-screen items-center px-5 py-24">
        <div className="absolute inset-x-0 top-1/3 h-80 bg-[#27f2df]/10 blur-3xl" />
        <Reveal>
          <div className="relative mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs uppercase text-[#27f2df]">Final Partnership Page</p>
            <h2 className="mt-6 text-5xl font-semibold leading-tight text-white md:text-8xl">
              We&apos;re Not Looking For Another Client.
              <span className="aqua-text block">We&apos;re Looking For A Long-Term Growth Partner.</span>
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-[#bdd0d2]">
              Ghost AI Solutions is ready to become the creative capture and marketing amplification partner behind
              Project One Roofing&apos;s sales team, tech team, and field work.
            </p>
            <a
              href="mailto:hello@ghostaisolutions.com?subject=Project%20One%20Roofing%20Partnership"
              className="mt-10 inline-flex h-16 items-center justify-center gap-3 rounded-full bg-white px-8 text-lg font-semibold text-[#061013] transition hover:bg-[#27f2df]"
            >
              Let&apos;s Build Something Incredible
              <ArrowRight />
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
