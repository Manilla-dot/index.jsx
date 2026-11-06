import { Fragment, useEffect, useState, type ReactNode } from "react";

/* ───────────── Editable content (Manilla Chandrika) ───────────── */

const NAME = "Manilla Chandrika";
const EMAIL = "manillachandrika@gmail.com"; // Update if needed
const LINKEDIN = "https://linkedin.com/in/";

type Case = {
  slug: string;
  name: string;
  tags: string[];
  problem: string;
  role: string;
  highlights: string[];
  context: string;
};

const CASES: Case[] = [
  {
    slug: "super-app",
    name: "Alice Blue Super App Strategy",
    tags: ["Product Strategy", "Fintech", "Ecosystem Design"],
    problem: "Led product strategy to transform fragmented financial tools into a unified Super App connecting trading, investing, and wealth experiences.",
    role: "Associate PM · Vision to Roadmap",
    highlights: ["Unified product architecture", "Cross-product navigation flow", "Dependency-based sequencing"],
    context: "Alice Blue operated multiple standalone products (ANT, RISE) with separate account contexts and user mental models, causing friction between trading and investing journeys.",
  },
  {
    slug: "ekyc-activation",
    name: "From eKYC to First Investment",
    tags: ["Activation", "User Research", "Onboarding"],
    problem: "Optimized the account opening and verification funnel to reduce drop-offs and accelerate time-to-first-investment.",
    role: "Journey Owner · Discovery to Delivery",
    highlights: ["Funnel drop-off analysis", "Trust-led verification flows", "Increased activation rate"],
    context: "The onboarding journey requires identity verification, document upload, and regulatory checks. Users experienced high anxiety and drop-off before placing their first trade.",
  },
  {
    slug: "ask-ant-audit",
    name: "ASK ANT — Product Audit & AI UX",
    tags: ["Product Audit", "AI Integration", "Discovery"],
    problem: "Audited feature gaps and designed contextual AI touchpoints to help users interpret portfolio movements and order rejections instantly.",
    role: "Audit Lead · Framework & Recommendations",
    highlights: ["Contextual AI integration", "Problem identification", "Prioritisation framework"],
    context: "ASK ANT's feature set grew faster than user understanding. The goal was to embed AI contextually rather than keeping it as an isolated chat widget.",
  },
  {
    slug: "mutual-funds",
    name: "Mutual Fund & Wealth Experience",
    tags: ["Product Strategy", "UX", "Wealth Management"],
    problem: "Owned the mutual fund product journey spanning fund discovery, comparison, lump-sum/SIP investments, and portfolio tracking.",
    role: "Product Owner · End-to-End Journey",
    highlights: ["SIP discovery workflows", "Portfolio portfolio intelligence", "Redemption & switch servicing"],
    context: "Users needed a seamless way to transition capital from active trading balances into stable, long-term wealth instruments like mutual funds and baskets.",
  },
];

const PM_FLOW = ["Problem", "Research", "Insight", "Opportunity", "Hypothesis", "Solution", "Measurement", "Learning"];

/* ───────────── Routing (hash) ───────────── */

type Route = { name: "home" } | { name: "case"; i: number } | { name: "system" };
function parse(): Route {
  const h = window.location.hash;
  const c = h.match(/^#\/case\/([\w-]+)/);
  if (c) {
    const i = CASES.findIndex((x) => x.slug === c[1]);
    if (i >= 0) return { name: "case", i };
  }
  if (h.startsWith("#/system")) return { name: "system" };
  return { name: "home" };
}

function useReveal(dep: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ───────────── Primitives ───────────── */

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`size-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
const DownIcon = () => (
  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v9M4 7l4 4 4-4M3 14h10" /></svg>
);

function Btn({ variant = "primary", children, onClick, href, disabled, className = "" }: { variant?: "primary" | "secondary" | "ghost"; children: ReactNode; onClick?: () => void; href?: string; disabled?: boolean; className?: string }) {
  const base = "group inline-flex items-center gap-2 text-[14px] font-medium transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed";
  const v = {
    primary: "h-11 px-5 rounded-md bg-ink text-paper hover:bg-sage active:bg-[#173f37] active:scale-[.98] disabled:bg-line disabled:text-ink-3",
    secondary: "h-11 px-5 rounded-md border border-ink/20 text-ink hover:border-ink hover:bg-white active:bg-paper-2 disabled:border-line disabled:text-ink-3",
    ghost: "text-ink hover:text-sage underline-offset-4 decoration-1 hover:underline disabled:text-ink-3",
  }[variant];
  const cls = `${base} ${v} ${className}`;
  if (href) return <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>;
  return <button onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

const Tag = ({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "sage" | "outline" | "status" }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-[4px] px-2 py-[3px] font-mono text-[11px] uppercase tracking-[.06em] ${
    { neutral: "bg-paper-2 text-ink-2", sage: "bg-sage-soft text-sage", outline: "border border-line text-ink-3", status: "border border-sage/30 text-sage" }[tone]
  }`}>
    {tone === "status" && <span className="size-1.5 rounded-full bg-sage pulse" />}
    {children}
  </span>
);

const Eyebrow = ({ n, children }: { n?: string; children: ReactNode }) => (
  <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">
    {n && <span className="text-sage">{n}</span>}
    <span className="h-px w-6 bg-line" />
    {children}
  </div>
);

function Placeholder({ label = "[Fintech UI Preview]", ratio = "aspect-[16/10]", onOpen, dense }: { label?: string; ratio?: string; onOpen?: () => void; dense?: boolean }) {
  return (
    <button
      onClick={onOpen}
      className={`group relative w-full ${ratio} overflow-hidden rounded-md border border-line bg-paper-2 text-left ${onOpen ? "cursor-zoom-in" : "cursor-default"}`}
    >
      <div className="absolute inset-0 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      {!dense && (
        <div className="absolute inset-x-[10%] top-[16%] bottom-0 rounded-t-md border border-b-0 border-line bg-white/80 p-4 transition-transform duration-300 group-hover:-translate-y-1">
          <div className="mb-3 h-2 w-1/3 rounded-full bg-line" />
          <div className="mb-2 h-2 w-2/3 rounded-full bg-paper-2" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="h-10 rounded bg-paper-2" /><div className="h-10 rounded bg-sage-soft" /><div className="h-10 rounded bg-paper-2" />
          </div>
        </div>
      )}
      <span className="absolute left-3 top-3 rounded-[3px] bg-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper">Preview</span>
      <span className="absolute bottom-3 right-3 rounded-[3px] bg-white/90 px-2 py-1 font-mono text-[11px] text-ink-3">{label}</span>
    </button>
  );
}

function Lightbox({ label, onClose }: { label: string | null; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  if (!label) return null;
  return (
    <div onClick={onClose} className="page-enter fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 p-6 backdrop-blur-sm">
      <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex justify-between font-mono text-[12px] text-paper/70"><span>{label}</span><button onClick={onClose} className="hover:text-paper">Close · Esc</button></div>
        <Placeholder label={label} ratio="aspect-[16/9]" />
      </div>
    </div>
  );
}

/* ───────────── Navigation ───────────── */

const NAV = [
  ["Work", "work"], ["Approach", "approach"], ["Metrics", "metrics"], ["About", "about"], ["Resume", "resume"],
] as const;

function Header({ route, progress }: { route: Route; progress?: number }) {
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    setOpen(false);
    if (route.name !== "home") { window.location.hash = "#/"; setTimeout(() => scrollToId(id), 60); } else scrollToId(id);
  };
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6 lg:px-10">
        <a href="#/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-[5px] bg-ink font-mono text-[11px] text-paper">{NAME.split(" ").map((w) => w[0]).join("")}</span>
          {NAME}
          <span className="hidden font-normal text-ink-3 sm:inline">/ Associate PM</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map(([l, id]) => (
            <button key={id} onClick={() => go(id)} className="text-[14px] text-ink-2 transition-colors duration-200 hover:text-ink">{l}</button>
          ))}
          <a href="#/system" className={`text-[14px] transition-colors ${route.name === "system" ? "text-sage" : "text-ink-2 hover:text-ink"}`}>System</a>
          <Btn variant="primary" className="!h-9 !px-4 !text-[13px]" onClick={() => go("contact")}>Contact</Btn>
        </nav>
        <button aria-label="Menu" onClick={() => setOpen(!open)} className="relative grid size-10 place-items-center md:hidden">
          <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
          <span className={`absolute h-px w-5 bg-ink transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
        </button>
      </div>
      {progress !== undefined && (
        <div className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-transparent"><div className="h-full bg-sage transition-[width] duration-150" style={{ width: `${progress * 100}%` }} /></div>
      )}
      <div className={`fixed inset-x-0 top-16 bottom-0 bg-paper transition-all duration-300 md:hidden ${open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        <div className="flex flex-col px-6 pt-6">
          {[...NAV, ["Contact", "contact"] as const].map(([l, id], i) => (
            <button key={id} onClick={() => go(id)} className="flex items-baseline justify-between border-b border-line py-5 text-left text-[26px] tracking-tight">
              {l}<span className="font-mono text-[11px] text-ink-3">0{i + 1}</span>
            </button>
          ))}
          <a href="#/system" onClick={() => setOpen(false)} className="py-5 text-[26px] tracking-tight text-ink-3">Design system</a>
        </div>
      </div>
    </header>
  );
}

/* ───────────── Home: Hero + system diagram ───────────── */

const SYS = [
  { k: "Problem", d: "Users drop off after eKYC verification; accounts remain inactive.", q: "What is breaking in the funnel?" },
  { k: "Insight", d: "The drop is caused by uncertainty about regulatory steps and first trade execution.", q: "Why is it really happening?" },
  { k: "Strategy", d: "Sequence the onboarding journey around confidence and guided first trades.", q: "Where should we bet?" },
  { k: "Execution", d: "Collaborate with engineering & design to ship milestone slices and track drop-offs.", q: "How do we deliver?" },
  { k: "Impact", d: "Activation rate up by 18% · time-to-first-investment reduced.", q: "Did it move core metrics?" },
];

function SystemDiagram() {
  const [a, setA] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setA((x) => (x + 1) % SYS.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative rounded-xl border border-line bg-white p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">PM Framework · Alice Blue</span>
        <Tag tone="status">Active model</Tag>
      </div>
      <div className="relative">
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-line" />
        <div className="absolute left-[11px] top-3 w-px bg-sage transition-all duration-500" style={{ height: `calc(${(a / (SYS.length - 1)) * 100}% - 24px * ${a / (SYS.length - 1)})` }} />
        {SYS.map((s, i) => (
          <button key={s.k} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} className="relative flex w-full gap-5 py-3 text-left">
            <span className={`relative z-10 mt-0.5 grid size-[23px] shrink-0 place-items-center rounded-full border bg-white transition-colors duration-300 ${i <= a ? "border-sage" : "border-line"}`}>
              <span className={`size-[7px] rounded-full transition-all duration-300 ${i === a ? "bg-sage scale-125" : i < a ? "bg-sage/60" : "bg-line"}`} />
            </span>
            <span className="flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className={`text-[17px] font-medium tracking-tight transition-colors ${i === a ? "text-ink" : "text-ink-3"}`}>{s.k}</span>
                <span className="font-mono text-[11px] text-ink-3">0{i + 1}</span>
              </span>
              <span className={`grid transition-all duration-300 ${i === a ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <span className="overflow-hidden">
                  <span className="block pt-1 font-serif text-[15px] italic text-sage">{s.q}</span>
                  <span className="block pt-1 text-[14px] leading-relaxed text-ink-2">{s.d}</span>
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-ink-3">Example: eKYC activation journey optimization</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-[1240px] gap-14 px-6 pt-16 pb-24 lg:grid-cols-[1.25fr_1fr] lg:gap-20 lg:px-10 lg:pt-24 lg:pb-32">
      <div className="reveal">
        <div className="mb-10 flex flex-wrap items-center gap-3">
          <h1 className="text-[15px] font-semibold">{NAME}</h1>
          <span className="h-4 w-px bg-line" />
          <span className="text-[15px] text-ink-3">Associate Product Manager @ Alice Blue</span>
        </div>
        <h2 className="text-[40px] font-medium leading-[1.04] tracking-[-.03em] text-balance sm:text-[56px] lg:text-[66px]">
          Building fintech ecosystems by understanding the <span className="font-serif font-normal italic text-sage">problem</span> before shipping features.
        </h2>
        <p className="mt-8 max-w-[560px] text-[17px] leading-[1.65] text-ink-2">
          Currently driving product strategy and user activation at Alice Blue in Bangalore. I combine a design background from IIT Hyderabad with rigorous product management to turn complex trading and wealth journeys into simple, high-impact experiences.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Btn onClick={() => scrollToId("work")}>View Case Studies <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" /></Btn>
          <Btn variant="secondary" href="#/resume"><DownIcon /> View Resume</Btn>
          <span className="ml-2"><Btn variant="ghost" onClick={() => scrollToId("contact")}>Let's connect <Arrow /></Btn></span>
        </div>
        <dl className="mt-16 grid max-w-[560px] grid-cols-3 border-t border-line pt-6">
          {[["Domain", "Fintech · Trading & Wealth"], ["Location", "Bangalore, India"], ["Status", "Open to PM Roles"]].map(([k, v]) => (
            <div key={k}><dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{k}</dt><dd className="mt-1.5 text-[14px]">{v}</dd></div>
          ))}
        </dl>
      </div>
      <div className="reveal lg:pt-10"><SystemDiagram /></div>
    </section>
  );
}

/* ───────────── Section wrapper ───────────── */

function Section({ id, n, eyebrow, title, sub, children, tone }: { id: string; n: string; eyebrow: string; title: ReactNode; sub?: string; children: ReactNode; tone?: "alt" | "dark" }) {
  return (
    <section id={id} className={`scroll-mt-16 ${tone === "alt" ? "bg-white border-y border-line" : tone === "dark" ? "bg-ink text-paper" : ""}`}>
      <div className="mx-auto max-w-[1240px] px-6 py-24 lg:px-10 lg:py-32">
        <div className="reveal mb-14 grid gap-6 lg:mb-20 lg:grid-cols-[1fr_2fr]">
          <Eyebrow n={n}>{eyebrow}</Eyebrow>
          <div>
            <h2 className="max-w-[760px] text-[32px] font-medium leading-[1.1] tracking-[-.025em] text-balance sm:text-[44px]">{title}</h2>
            {sub && <p className={`mt-5 max-w-[620px] text-[17px] leading-relaxed ${tone === "dark" ? "text-paper/65" : "text-ink-2"}`}>{sub}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function FlowChain({ steps, dark }: { steps: string[]; dark?: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center">
          <span className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-200 ${dark ? "border-paper/20 hover:border-paper hover:bg-paper hover:text-ink" : "border-line bg-white hover:border-sage hover:text-sage"}`}>
            <span className={`mr-2 font-mono text-[10px] ${dark ? "text-paper/40" : "text-ink-3"}`}>{String(i + 1).padStart(2, "0")}</span>{s}
          </span>
          {i < steps.length - 1 && <span className={`mx-1.5 h-px w-5 ${dark ? "bg-paper/25" : "bg-line"}`} />}
        </li>
      ))}
    </ol>
  );
}

/* ───────────── Home sections ───────────── */

const CAPS = [
  ["Product Discovery & Strategy", "User research at labor chowks and trading desks, problem framing, opportunity trees, and roadmap sequencing."],
  ["Fintech & Trading Systems", "Experience design across option chains, eKYC onboarding journeys, mutual funds, and wealth portfolios."],
  ["Data-Driven Decision Making", "Funnel analytics, cohort tracking, drop-off reduction, and structured A/B testing models."],
  ["Cross-Functional Leadership", "Aligning engineering, design, and business stakeholders to ship high-impact products reliably."],
];

function CapabilityCard({ i, t, d }: { i: number; t: string; d: string }) {
  return (
    <div className="reveal group relative flex min-h-[260px] flex-col border-line bg-paper p-7 transition-colors duration-300 hover:bg-white">
      <span className="font-mono text-[12px] text-sage">0{i + 1}</span>
      <h3 className="mt-auto text-[21px] font-medium leading-tight tracking-tight">{t}</h3>
      <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{d}</p>
      <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-sage transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
}

function Value() {
  return (
    <Section id="value" n="01" eyebrow="Expertise" title={<>I don't just ship features. <span className="text-ink-3">I solve product problems.</span></>} tone="alt">
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {CAPS.map(([t, d], i) => <CapabilityCard key={t} i={i} t={t} d={d} />)}
      </div>
      <div className="reveal mt-16 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <p className="font-serif text-[22px] italic leading-snug text-ink-2">My product development loop:</p>
        <FlowChain steps={PM_FLOW} />
      </div>
    </Section>
  );
}

function CaseCard({ c, i }: { c: Case; i: number }) {
  return (
    <a href={`#/case/${c.slug}`} className="reveal group flex flex-col rounded-lg border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_18px_40px_-20px_rgba(18,22,20,.25)] sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="font-mono text-[12px] text-ink-3">Case {String(i + 1).padStart(2, "0")}</span>
        <span className="text-right font-mono text-[11px] text-ink-3">{c.role}</span>
      </div>
      <h3 className="text-[26px] font-semibold leading-tight tracking-[-.02em]">{c.name}</h3>
      <p className="mt-2 text-[13px] text-sage">{c.tags.join(" · ")}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{c.problem}</p>
      <div className="my-7"><Placeholder label={`Alice Blue · ${c.name}`} /></div>
      <ul className="space-y-2 border-t border-line pt-5">
        {c.highlights.map((h) => (
          <li key={h} className="flex items-center gap-3 text-[14px]"><span className="size-1 rounded-full bg-sage" />{h}</li>
        ))}
      </ul>
      <span className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium">View Case Study <Arrow className="transition-transform duration-200 group-hover:translate-x-1" /></span>
    </a>
  );
}

function Work() {
  return (
    <Section id="work" n="02" eyebrow="Selected work" title="Fintech Product Case Studies" sub="Core product problems owned and executed at Alice Blue across onboarding, trading interfaces, mutual funds, and AI assistance.">
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {CASES.map((c, i) => <CaseCard key={c.slug} c={c} i={i} />)}
      </div>
    </Section>
  );
}

const THINK = [
  ["Problem Framing", "What core problem are we solving for users and the business?", ["Separate symptoms from root causes", "Write the problem statement before any solution", "Name who loses — the user, the business, or both"]],
  ["User Understanding", "What are users actually trying to accomplish?", ["Field research with traders and unorganized labor", "Observe behaviour, not stated preference", "Segment by intent, not demographics"]],
  ["Friction Analysis", "Where is the experience breaking or causing drop-offs?", ["Map the onboarding and trading funnel step by step", "Pair drop-off data with session evidence", "Quantify the cost of each break"]],
  ["Opportunity Mapping", "Where can product decisions create measurable value?", ["Opportunity-solution trees", "Size by reach × impact × confidence", "Check strategic fit before effort"]],
  ["Prioritisation & Hypothesis", "What should we build first and what outcome do we expect?", ["Write falsifiable hypotheses", "Smallest slice that tests the bet", "Agree success criteria with engineering & business up front"]],
  ["Measurement & Learning", "How do we know it worked and what does it tell us?", ["Define a primary metric and guardrails", "Read results honestly — including null results", "Feed learning back into the roadmap"]],
] as const;

function ThinkingCard({ i, t, q, pts }: { i: number; t: string; q: string; pts: readonly string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`reveal rounded-lg border bg-white transition-all duration-300 ${open ? "border-sage/40 shadow-[0_10px_30px_-18px_rgba(31,90,78,.35)]" : "border-line hover:border-ink/20"}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-start gap-5 p-6 text-left">
        <span className="pt-1 font-mono text-[12px] text-sage">0{i + 1}</span>
        <span className="flex-1">
          <span className="block text-[19px] font-medium tracking-tight">{t}</span>
          <span className="mt-1.5 block font-serif text-[16.5px] italic leading-snug text-ink-2">{q}</span>
        </span>
        <span className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 ${open ? "rotate-45 bg-ink text-paper" : ""}`}>
          <svg viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.5"><path d="M6 1v10M1 6h10" /></svg>
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <ul className="mx-6 mb-6 space-y-2.5 border-t border-line pt-5 pl-[34px]">
            {pts.map((p) => <li key={p} className="text-[14.5px] text-ink-2 before:mr-3 before:text-sage before:content-['—']">{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <Section id="approach" n="03" eyebrow="Approach" title="How I Approach Product Problems" tone="alt">
      <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {THINK.map(([t, q, pts], i) => <ThinkingCard key={t} i={i} t={t} q={q} pts={pts} />)}
      </div>
      <div className="reveal mt-14 rounded-lg border border-dashed border-line p-6 sm:p-8">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">The PM loop</p>
        <FlowChain steps={["User Problem", "Research", "Insight", "Opportunity", "Hypothesis", "Solution", "Metric", "Learning"]} />
      </div>
    </Section>
  );
}

const KPI = [
  ["Onboarding Drop-off", "Funnel analytics", "Completion rate", "< 70%", "Identify friction points and simplify KYC steps", "Break down drop-offs by device and document type; pair with session recordings."],
  ["Feature Adoption", "Product analytics", "Usage %", "< 15%", "Improve discoverability and contextual nudges", "Test whether users can't find the feature or don't understand its value."],
  ["Portfolio Engagement", "Cohort analysis", "DAU/MAU", "Declining", "Introduce Portfolio Intelligence and Ask ANT insights", "Compare cohort retention before and after feature releases."],
  ["Order Execution Success", "Trading logs", "Success rate", "< 98%", "Refine order placement UI and error handling", "Analyze rejection codes and streamline error recovery paths."],
];

function Metrics() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section id="metrics" n="04" eyebrow="Metrics" title="I measure success through user and business outcomes." sub="Fintech KPI framework for tracking activation, retention, and engagement.">
      <div className="reveal overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[11px] uppercase tracking-[.1em] text-ink-3">
              {["Signal", "Data Source", "Metric", "Threshold", "Product Action", ""].map((h) => <th key={h} className="px-6 py-4 font-normal">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {KPI.map((r, i) => (
              <Fragment key={r[0]}>
                <tr onClick={() => setOpen(open === i ? null : i)} className={`group cursor-pointer border-b border-line/70 text-[14.5px] transition-colors duration-200 hover:bg-sage-soft/50 ${open === i ? "bg-sage-soft/50" : ""}`}>
                  <td className="px-6 py-5 font-medium">{r[0]}</td>
                  <td className="px-6 py-5 text-ink-2">{r[1]}</td>
                  <td className="px-6 py-5 text-ink-2">{r[2]}</td>
                  <td className="px-6 py-5"><span className="rounded bg-paper-2 px-2 py-1 font-mono text-[12.5px] group-hover:bg-white">{r[3]}</span></td>
                  <td className="px-6 py-5">{r[4]}</td>
                  <td className="px-6 py-5 text-right text-ink-3"><span className={`inline-block transition-transform duration-300 ${open === i ? "rotate-90" : ""}`}><Arrow /></span></td>
                </tr>
                {open === i && (
                  <tr key={r[0] + "x"} className="border-b border-line/70 bg-sage-soft/30">
                    <td colSpan={6} className="page-enter px-6 pb-6 pt-1"><p className="max-w-[640px] pl-0 text-[14px] text-ink-2"><span className="mr-2 font-mono text-[11px] uppercase text-sage">How I'd investigate</span>{r[5]}</p></td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 font-mono text-[11px] text-ink-3">Fintech KPI framework · click any row to view investigation playbook.</p>
    </Section>
  );
}

const STAGES = [
  ["Design & Visuals", "Design & Visual Communication · IIT Hyderabad", "2023"],
  ["Fintech UX", "User research, product design & prototyping", "2023-2024"],
  ["Associate PM", "Alice Blue · Bangalore", "2024 — Present"],
];
const AREAS = ["Fintech", "Trading Systems", "Mutual Funds", "Onboarding", "Activation", "Product Strategy", "User Research", "Figma", "Jira", "SQL", "AI Tools"];

function Timeline() {
  return (
    <Section id="progression" n="05" eyebrow="Progression" title="Career Progression & Background" tone="dark">
      <div className="reveal relative grid gap-10 md:grid-cols-3 md:gap-0">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-paper/15 md:left-0 md:right-0 md:top-[7px] md:bottom-auto md:h-px md:w-auto" />
        <div className="absolute left-[7px] top-2 h-full w-px bg-gradient-to-b from-transparent to-sage-2 md:left-0 md:top-[7px] md:h-px md:w-full md:bg-gradient-to-r" />
        {STAGES.map(([t, d, y], i) => (
          <div key={t} className="relative pl-10 md:pl-0 md:pr-8">
            <span className={`absolute left-0 top-0 grid size-[15px] place-items-center rounded-full border md:relative ${i === 2 ? "border-sage-2 bg-sage-2" : "border-paper/40 bg-ink"}`}>
              {i === 2 && <span className="size-[5px] rounded-full bg-paper pulse" />}
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[.12em] text-paper/45 md:mt-7">{String(i + 1).padStart(2, "0")} · {y}</p>
            <h3 className={`mt-2 text-[24px] font-medium tracking-tight ${i === 2 ? "text-paper" : "text-paper/75"}`}>{t}</h3>
            <p className="mt-1 text-[14px] text-paper/55">{d}</p>
          </div>
        ))}
      </div>
      <div className="reveal mt-20 border-t border-paper/10 pt-10">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[.14em] text-paper/45">Core Skills & Domain Experience</p>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => <span key={a} className="rounded-full border border-paper/15 px-3.5 py-1.5 text-[13.5px] text-paper/80 transition-colors duration-200 hover:border-paper/50 hover:text-paper">{a}</span>)}
        </div>
      </div>
    </Section>
  );
}

function About() {
  return (
    <Section id="about" n="06" eyebrow="About" title="A product manager with a strong foundation in design and user research.">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <div className="reveal"><Placeholder label="Manilla Chandrika" ratio="aspect-[4/5]" dense /></div>
        <div className="reveal max-w-[640px] space-y-6 text-[18px] leading-[1.7] text-ink-2">
          <p>I completed my studies in Design and Visual Communication at the <span className="font-medium text-ink">Indian Institute of Technology Hyderabad (IIT Hyderabad)</span> in 2023. That background taught me how to observe user friction deeply before writing a single requirement.</p>
          <p>Transitioning into product management at <span className="font-medium text-ink">Alice Blue</span> allowed me to own fintech products end-to-end — balancing user needs, regulatory compliance, engineering velocity, and business growth.</p>
          <p className="text-ink">Today I combine:</p>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {["User Research", "Product Strategy", "Design Thinking", "Fintech Execution"].map((x, i) => (
              <div key={x} className="bg-white p-4"><span className="font-mono text-[11px] text-sage">{i < 3 ? "+" : "="}</span><p className="mt-6 text-[15px] font-medium leading-tight text-ink">{x}</p></div>
            ))}
          </div>
          <p>…to build products that users love and businesses scale.</p>
        </div>
      </div>
    </Section>
  );
}

const RESUME_DATA: [string, string[]][] = [
  ["Summary", ["Associate Product Manager at Alice Blue with a design background from IIT Hyderabad. Specialized in fintech onboarding, trading UI, and wealth ecosystems."]],
  ["Experience", ["Associate Product Manager · Alice Blue, Bangalore · Apr 2024 – Present", "Owned discovery, requirements, and execution for trading interfaces, mutual funds, and activation funnels."]],
  ["Education", ["Design and Visual Communication · IIT Hyderabad · 2023", "Bachelor of Commerce · TamilNadu Open University · 2014 – 2017"]],
  ["Product Skills", ["Discovery", "Roadmapping", "Prioritisation", "PRDs", "Funnel Optimisation"]],
  ["Tools & Stack", ["Figma", "Jira", "Google Sheets", "Prototyping Tools", "AI Prompting"]],
  ["Languages", ["English", "Hindi", "Tamil", "Telugu"]],
];

function Resume() {
  return (
    <Section id="resume" n="07" eyebrow="Resume" title="Professional Resume" tone="alt">
      <div className="reveal rounded-lg border border-line bg-paper p-2">
        <div className="rounded-md border border-line bg-white p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
            <div><p className="text-[24px] font-semibold tracking-tight">{NAME}</p><p className="text-ink-3">Associate Product Manager · {EMAIL} · Bangalore</p></div>
            <Tag tone="status">Ready for HR Review</Tag>
          </div>
          <div className="grid gap-x-12 gap-y-8 pt-8 md:grid-cols-2">
            {RESUME_DATA.map(([h, items]) => (
              <div key={h} className="grid grid-cols-[140px_1fr] gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[.1em] text-ink-3">{h}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[14px] text-ink-2">
                  {items.map((it) => <span key={it} className="w-full">{it}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Btn href={`mailto:${EMAIL}`}>Email Manilla <Arrow /></Btn>
        <Btn variant="secondary" href={LINKEDIN}>LinkedIn Profile <Arrow /></Btn>
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-16">
      <div className="mx-auto max-w-[1240px] px-6 py-28 lg:px-10 lg:py-40">
        <div className="reveal">
          <Eyebrow n="08">Contact</Eyebrow>
          <h2 className="mt-8 max-w-[900px] text-[44px] font-medium leading-[1.02] tracking-[-.035em] text-balance sm:text-[72px]">
            Ready to drive impact <span className="font-serif font-normal italic text-sage">on your PM team?</span>
          </h2>
          <p className="mt-8 max-w-[560px] text-[17px] leading-relaxed text-ink-2">I am looking for Product Management roles where I can combine rigorous user research, fintech ecosystem strategy, and cross-functional execution.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Btn href={`mailto:${EMAIL}`}>Email Manilla <Arrow /></Btn>
            <Btn variant="secondary" href={LINKEDIN}>LinkedIn</Btn>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-4 px-6 py-8 font-mono text-[11px] text-ink-3 lg:px-10">
      <span>© {new Date().getFullYear()} {NAME} · Associate PM @ Alice Blue</span>
      <span>Problem → Evidence → Decision → Execution → Impact</span>
      <a href="#/system" className="hover:text-ink">Design system ↗</a>
    </div>
  </footer>
);

function Home() {
  return <><Hero /><Value /><Work /><Thinking /><Metrics /><Timeline /><About /><Resume /><Contact /></>;
}

/* ───────────── Case study template ───────────── */

const CS_SECTIONS = ["Context", "Problem", "Why It Matters", "Research", "Key Insights", "Opportunity", "Product Thinking", "Solution", "Collaboration", "Measurement", "Outcome", "Learnings"];

function CSBlock({ i, children, lead }: { i: number; children: ReactNode; lead?: string }) {
  return (
    <section id={`s${i}`} className="reveal scroll-mt-24 border-t border-line py-16 first:border-t-0 first:pt-0">
      <p className="font-mono text-[12px] text-sage">{String(i + 1).padStart(2, "0")} —</p>
      <h2 className="mt-2 text-[30px] font-medium tracking-[-.02em] sm:text-[36px]">{CS_SECTIONS[i]}</h2>
      {lead && <p className="mt-4 max-w-[640px] font-serif text-[20px] italic leading-snug text-ink-2">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

const P = ({ children }: { children: ReactNode }) => <p className="max-w-[680px] text-[17px] leading-[1.7] text-ink-2">{children}</p>;
const Ph = ({ children }: { children: ReactNode }) => <span className="rounded bg-sage-soft px-1.5 py-0.5 font-mono text-[13px] text-sage">{children}</span>;

function CaseStudy({ i, onProgress }: { i: number; onProgress: (p: number) => void }) {
  const c = CASES[i];
  const [active, setActive] = useState(0);
  const [lb, setLb] = useState<string | null>(null);

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      onProgress(Math.min(1, h.scrollTop / (h.scrollHeight - h.clientHeight || 1)));
      let cur = 0;
      CS_SECTIONS.forEach((_, k) => {
        const el = document.getElementById(`s${k}`);
        if (el && el.getBoundingClientRect().top < 160) cur = k;
      });
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); onProgress(0); };
  }, [i, onProgress]);

  const next = CASES[(i + 1) % CASES.length];

  return (
    <div className="page-enter">
      <div className="mx-auto max-w-[1240px] px-6 pt-10 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[12px] text-ink-3">
          <a href="#/" className="hover:text-ink">Home</a><span>/</span>
          <button onClick={() => { window.location.hash = "#/"; setTimeout(() => scrollToId("work"), 60); }} className="hover:text-ink">Work</button><span>/</span>
          <span className="text-ink">{c.name}</span>
        </nav>
        <div className="grid gap-10 pt-14 pb-16 lg:grid-cols-[2fr_1fr] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">{c.tags.map((t) => <Tag key={t} tone="sage">{t}</Tag>)}</div>
            <h1 className="text-[42px] font-semibold leading-[1.02] tracking-[-.035em] sm:text-[64px]">{c.name}</h1>
            <p className="mt-6 max-w-[640px] text-[18px] leading-relaxed text-ink-2">{c.problem}</p>
          </div>
          <dl className="grid grid-cols-2 gap-5 border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            {[["Role", c.role], ["Company", "Alice Blue"], ["Team", "Product & Engineering"], ["Platform", "Mobile · Web"]].map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[11px] uppercase tracking-[.12em] text-ink-3">{k}</dt><dd className="mt-1 text-[14px]">{v}</dd></div>
            ))}
          </dl>
        </div>
        <Placeholder label={`Alice Blue · ${c.name} Architecture`} ratio="aspect-[21/9]" onOpen={() => setLb(`${c.name} — Overview`)} />
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-12 px-6 pt-20 pb-10 lg:grid-cols-[220px_1fr] lg:gap-20 lg:px-10">
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">On this page</p>
            <ol className="space-y-0.5 border-l border-line">
              {CS_SECTIONS.map((s, k) => (
                <li key={s}>
                  <button onClick={() => scrollToId(`s${k}`)} className={`-ml-px flex w-full gap-3 border-l py-1.5 pl-4 text-left text-[13.5px] transition-colors duration-200 ${active === k ? "border-sage text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>
                    <span className="font-mono text-[11px] pt-px">{String(k + 1).padStart(2, "0")}</span>{s}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <div className="sticky top-16 z-30 -mx-6 -mt-12 border-b border-line bg-paper/90 px-6 py-3 backdrop-blur lg:hidden">
          <select value={active} onChange={(e) => scrollToId(`s${e.target.value}`)} className="w-full bg-transparent font-mono text-[12px]">
            {CS_SECTIONS.map((s, k) => <option key={s} value={k}>{String(k + 1).padStart(2, "0")} — {s}</option>)}
          </select>
        </div>

        <article className="min-w-0">
          <CSBlock i={0}>
            <div className="grid gap-8 md:grid-cols-[1fr_200px]">
              <div className="space-y-5"><P>{c.context}</P><P>At Alice Blue, this initiative required aligning engineering squads around a shared architecture to eliminate fragmentation and improve long-term user retention.</P></div>
              <Placeholder label="Alice Blue Ecosystem" ratio="aspect-square" dense />
            </div>
          </CSBlock>

          <CSBlock i={1} lead="Framed as a product problem — balancing user friction and business drop-off.">
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
              {[["User problem", "Traders and investors faced fragmented navigation, multiple account contexts, and high friction during critical tasks."], ["Business problem", "Increased customer acquisition cost (CAC) due to drop-offs in activation and lower cross-product adoption."]].map(([h, d]) => (
                <div key={h} className="bg-white p-6"><p className="font-mono text-[11px] uppercase tracking-[.12em] text-sage">{h}</p><p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{d}</p></div>
              ))}
            </div>
            <blockquote className="mt-8 border-l-2 border-sage pl-6 font-serif text-[22px] leading-snug">"How might we unify the Alice Blue experience so users transition effortlessly from trading to investing?"</blockquote>
          </CSBlock>

          <CSBlock i={2}>
            <div className="grid gap-4 md:grid-cols-3">
              {[["Business impact", <Ph>Higher activation & cross-adoption</Ph>], ["User impact", "Reduced cognitive load & faster time to first trade"], ["Strategic importance", "Transitioning from a broker tool into a connected financial ecosystem"]].map(([h, d], k) => (
                <div key={k} className="rounded-lg border border-line bg-white p-6"><p className="text-[15px] font-medium">{h}</p><div className="mt-6 text-[15px] text-ink-2">{d}</div></div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={3} lead="Evidence before opinions.">
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {[["User research & interviews", "Conducted field sessions and analyzed user drop-off points."], ["Product & market analysis", "Benchmarked top fintech super apps across Indian markets."], ["Competitive landscape", "Evaluated navigation depth and portfolio visibility."], ["Data analysis & funnel metrics", "Mapped drop-offs across eKYC and order execution funnels."], ["Stakeholder feedback", "Aligned with engineering and leadership on technical constraints."], ["Key observations & synthesis", "Identified that users needed clarity and speed over decorative UI."]].map(([h, d], k) => (
                <div key={h} className="grid gap-2 p-6 md:grid-cols-[40px_1fr_1.3fr]">
                  <span className="font-mono text-[11px] text-ink-3">4.{k + 1}</span>
                  <p className="text-[15px] font-medium">{h}</p>
                  <p><Ph>{d}</Ph></p>
                </div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={4}>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="group rounded-lg border border-line bg-white p-6 transition-colors duration-300 hover:border-sage/40">
                  <span className="font-serif text-[44px] leading-none text-sage/30 transition-colors group-hover:text-sage">{n}.</span>
                  <p className="mt-4 text-[16px] font-medium">Key Finding {n}:</p>
                  <p className="mt-1 text-[15px] text-ink-2">Users abandon journeys when data is delayed or when navigation requires excessive taps.</p>
                </div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={5} lead="From insight → to actionable product opportunity.">
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="grid items-center gap-3 rounded-lg border border-line bg-white p-5 md:grid-cols-[1fr_32px_1fr]">
                  <p className="text-[15px] text-ink-2"><span className="mr-2 font-mono text-[11px] text-ink-3">INSIGHT {n}</span>Users want unified asset visibility without sacrificing trading execution speed.</p>
                  <Arrow className="hidden text-sage md:block" />
                  <p className="text-[15px] font-medium"><span className="mr-2 font-mono text-[11px] font-normal text-sage">OPPORTUNITY</span>Build a modular dashboard with instant deep-linking into execution screens.</p>
                </div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={6}>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
              {[["Problem", "Fragmented user journeys and high navigation friction."], ["Hypothesis", "If we consolidate navigation and portfolio views, activation and engagement will increase."], ["Product solution", "A unified IA and streamlined dashboard architecture."]].map(([h, d], k) => (
                <div key={h} className={`p-6 ${k === 2 ? "bg-ink text-paper" : "bg-white"}`}>
                  <p className={`font-mono text-[11px] uppercase tracking-[.12em] ${k === 2 ? "text-paper/50" : "text-ink-3"}`}>{String(k + 1).padStart(2, "0")} · {h}</p>
                  <p className="mt-6 text-[16px] leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={7}>
            <Placeholder label="Alice Blue · Product Flow Diagram" ratio="aspect-[16/7]" onOpen={() => setLb("Product flow")} />
            <div className="mt-4 grid grid-cols-3 gap-4">
              {["Dashboard", "Unified Portfolio", "Execution"].map((s) => <Placeholder key={s} label={s} ratio="aspect-[9/16]" dense onOpen={() => setLb(s)} />)}
            </div>
            <div className="mt-8"><P>Every product decision was prioritized based on reducing user taps and ensuring instantaneous state updates during high-volatility trading hours.</P></div>
          </CSBlock>

          <CSBlock i={8}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[["Product team", "Owned PRDs, discovery, and roadmap sequencing."], ["Engineering", "Collaborated closely on backend data pipelines and low-latency rendering."], ["Design", "Partnered with design from IIT Hyderabad background to maintain UI elegance."], ["Business stakeholders", "Aligned metrics with activation and revenue targets."]].map(([r, q]) => (
                <div key={r} className="rounded-lg border border-line bg-white p-6">
                  <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-sage-soft font-mono text-[11px] text-sage">{r.split(" ").map((w) => w[0]).join("")}</span><p className="text-[16px] font-medium">{r}</p></div>
                  <p className="mt-4 font-serif text-[15.5px] italic text-ink-3">{q}</p>
                  <p className="mt-2"><Ph>Cross-functional execution</Ph></p>
                </div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={9}>
            <div className="rounded-lg bg-ink p-8 text-paper">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-paper/50">North Star Metric</p>
              <p className="mt-3 text-[28px] font-medium tracking-tight">Activation & First-Value Completion Rate</p>
            </div>
            <div className="mt-px grid divide-y divide-line rounded-b-lg border border-t-0 border-line bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {["Navigation Drop-off", "Search-to-Action", "Cross-Product Adoption"].map((k, n) => (
                <div key={n} className="p-6"><p className="font-mono text-[11px] uppercase text-ink-3">{k}</p><p className="mt-3 text-[20px] font-medium">Optimized</p><p className="mt-1 text-[13px] text-ink-3">Baseline → Target achieved</p></div>
              ))}
            </div>
            <p className="mt-6 text-[15px] text-ink-2"><span className="font-medium text-ink">Success criteria:</span> Seamless user migration without loss in daily active trading volume.</p>
          </CSBlock>

          <CSBlock i={10}>
            <div className="space-y-4">
              {[["Expected impact", "Reduced drop-off across onboarding and portfolio tracking."], ["Success criteria", "Higher user engagement and faster time to first trade."], ["What changed after this shipped?", "Users spent less time searching for features and more time executing informed trades and investments."]].map(([h, d]) => (
                <div key={h} className="grid gap-2 border-b border-line pb-4 md:grid-cols-[260px_1fr]"><p className="text-[15px] font-medium">{h}</p><p className="text-[15px] text-ink-2">{d}</p></div>
              ))}
            </div>
          </CSBlock>

          <CSBlock i={11}>
            <div className="rounded-lg border border-sage/30 bg-sage-soft p-8">
              <p className="font-mono text-[11px] uppercase tracking-[.14em] text-sage">What I learned as an Associate PM</p>
              <p className="mt-4 font-serif text-[23px] leading-snug">In fintech, architectural dependencies dictate roadmap sequencing. Building beautiful UI is worthless if the underlying data pipelines cannot deliver real-time accuracy during high-volume market hours.</p>
            </div>
          </CSBlock>

          <a href={`#/case/${next.slug}`} className="group mt-10 flex items-center justify-between rounded-lg border border-line bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(18,22,20,.3)]">
            <div><p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">Next case study</p><p className="mt-2 text-[24px] font-semibold tracking-tight">{next.name}</p></div>
            <span className="grid size-11 place-items-center rounded-full border border-line transition-colors group-hover:bg-ink group-hover:text-paper"><Arrow /></span>
          </a>
        </article>
      </div>
      <Footer />
      <Lightbox label={lb} onClose={() => setLb(null)} />
    </div>
  );
}

/* ───────────── Design system ───────────── */

function DSRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 border-t border-line py-10 lg:grid-cols-[200px_1fr]">
      <p className="font-mono text-[11px] uppercase tracking-[.14em] text-ink-3">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function System() {
  const swatches = [
    ["Ink", "#121614", "Text primary · 17.9:1"], ["Ink 2", "#3C4440", "Text secondary · 9.8:1"], ["Ink 3", "#6B736F", "Labels · 4.8:1"],
    ["Line", "#E3E4DF", "Hairlines"], ["Paper 2", "#F2F2EE", "Muted surface"], ["Paper", "#FAFAF8", "Page ground"],
    ["Sage", "#1F5A4E", "Accent · 7.6:1"], ["Sage 2", "#2F7565", "Accent hover"], ["Sage soft", "#E6EFEB", "Accent surface"],
  ];
  return (
    <div className="page-enter mx-auto max-w-[1240px] px-6 pt-14 pb-24 lg:px-10">
      <Eyebrow n="08">Components & design system</Eyebrow>
      <h1 className="mt-6 text-[44px] font-semibold tracking-[-.035em] sm:text-[60px]">System reference</h1>
      <p className="mt-4 max-w-[560px] text-[17px] text-ink-2">Design system built on a 4px base unit, clean typography, and a deliberate sage accent.</p>

      <div className="mt-16">
        <DSRow label="Color">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {swatches.map(([n, h, u]) => (
              <div key={n} className="overflow-hidden rounded-lg border border-line bg-white">
                <div className="h-20" style={{ background: h }} />
                <div className="p-4"><p className="text-[14px] font-medium">{n}</p><p className="font-mono text-[12px] text-ink-3">{h} · {u}</p></div>
              </div>
            ))}
          </div>
        </DSRow>

        <DSRow label="Typography">
          <div className="space-y-6">
            {[["H1 · 66/1.04 · 500 · −3%", "text-[66px] font-medium leading-[1.04] tracking-[-.03em]"], ["H2 · 44/1.1 · 500 · −2.5%", "text-[44px] font-medium leading-[1.1] tracking-[-.025em]"], ["H3 · 26/1.2 · 600 · −2%", "text-[26px] font-semibold tracking-[-.02em]"]].map(([m, c]) => (
              <div key={m} className="flex flex-col gap-1 border-b border-line pb-5"><span className="font-mono text-[11px] text-ink-3">{m}</span><span className={`${c} truncate`}>Problem before solution</span></div>
            ))}
          </div>
        </DSRow>

        <DSRow label="Buttons">
          <div className="space-y-5">
            {(["primary", "secondary"] as const).map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-3">
                <span className="w-24 font-mono text-[11px] text-ink-3">{v}</span>
                <Btn variant={v}>Default</Btn>
              </div>
            ))}
          </div>
        </DSRow>
      </div>
    </div>
  );
}

/* ───────────── App ───────────── */

export default function App() {
  const [route, setRoute] = useState<Route>(parse);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const on = () => { setRoute(parse()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const key = route.name === "case" ? `c${route.i}` : route.name;
  useReveal(key);

  return (
    <div className="min-h-screen">
      <Header route={route} progress={route.name === "case" ? progress : undefined} />
      <main key={key} className="page-enter">
        {route.name === "home" && <Home />}
        {route.name === "case" && <CaseStudy i={route.i} onProgress={setProgress} />}
        {route.name === "system" && <><System /><Footer /></>}
      </main>
    </div>
  );
}
