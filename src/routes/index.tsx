import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, Clock, ArrowUpRight,
  Mail, Sun, Moon, Github, Twitter, Send, Linkedin, Youtube,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Syphax — full-stack engineer" },
      { name: "description", content: "Personal site of Syphax." },
    ],
  }),
  component: Index,
});

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const offMin = -d.getTimezoneOffset();
      const sign = offMin >= 0 ? "+" : "-";
      const oh = pad(Math.floor(Math.abs(offMin) / 60));
      const om = pad(Math.abs(offMin) % 60);
      setT(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} GMT${sign}${oh}:${om}`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="font-mono inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded border border-border bg-muted text-[11px] text-foreground/80">
      {children}
    </kbd>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono flex items-center gap-2 text-[12px] tracking-widest uppercase text-foreground/80 mt-14 mb-5">
      <span>{children}</span>
    </div>
  );
}

function TechCircle({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <div
      className="w-11 h-11 rounded-lg flex items-center justify-center text-[11px] font-bold border border-border shadow-sm"
      style={{ background: bg, color: fg }}
      title={label}
    >
      {label}
    </div>
  );
}

function PRRow({ title, repo, num }: { title: string; repo: string; num: string }) {
  return (
    <a className="group flex items-start justify-between gap-4 py-3.5 border-t border-border first:border-t-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition" href="#">
      <div>
        <div className="text-[14px] text-foreground/90 group-hover:text-foreground">{title}</div>
        <div className="mt-1.5 flex items-center gap-2 text-[12px] text-muted-foreground font-mono">
          <span>{repo}</span>
          <span>•</span>
          <span>{num}</span>
          <span>•</span>
          <span className="px-1.5 py-0.5 rounded-full bg-badge text-badge-foreground text-[10px] tracking-wider">MERGED</span>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-1" />
    </a>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <a href="#" className="flex flex-col gap-1.5 border border-border rounded-lg p-4 hover:bg-accent/40 transition">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="text-xl">{value}</div>
    </a>
  );
}

function ExperienceItem({
  date, role, org, body,
}: { date: string; role: string; org: string; body: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-6 py-5 border-t border-border first:border-t-0">
      <div className="font-mono text-[12px] text-muted-foreground pt-0.5">{date}</div>
      <div>
        <h3 className="text-[14px] flex items-center gap-2 flex-wrap">
          <span>{role}</span>
          <span className="inline-flex items-center gap-1 text-foreground">
            <span className="w-4 h-4 rounded bg-foreground text-background flex items-center justify-center text-[10px]">◎</span>
            <span>{org}</span>
          </span>
        </h3>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Index() {
  const time = useClock();
  const { dark, toggle } = useTheme();
  const [tab, setTab] = useState<"prs" | "projects">("prs");

  return (
    <div className="min-h-screen pb-16 text-[14px]">
      {/* top bar */}
      <header className="max-w-2xl mx-auto px-6 pt-8 flex items-center justify-between font-mono text-[12px] text-muted-foreground tracking-wider">
        <div>EST. 2023</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{time || "00:00:00 GMT+00:00"}</span>
          </div>
          <button className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-border hover:bg-accent">
            <Search className="w-3.5 h-3.5" />
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-12">
        {/* profile */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted border border-border">
          <div className="absolute inset-0 grid place-items-center text-4xl text-muted-foreground">s</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-4xl md:text-[42px] font-medium tracking-tight">
            Hi, I'm Syphax
          </h1>
          <button
            onClick={toggle}
            aria-label="toggle theme"
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent transition"
          >
            {dark
              ? <Sun className="w-4 h-4 text-foreground/80" />
              : <Moon className="w-4 h-4 text-foreground/80" />}
          </button>
        </div>

        <p className="mt-2 text-[14px] text-muted-foreground">
          AI/ML engineer // Student{" "}
          <a href="#" className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline">
            <span className="w-3 h-3 rounded-full bg-foreground inline-block" /> ordr.trade
          </a>
        </p>

        <p className="mt-5 text-[14px] leading-relaxed text-foreground/90">
          I'm a Student with a keen interest in AI/Ml engineering and research. I wish to contribute to
          core infrastructure, including new designs for language models.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
          currently diving into deep learning and transformer models.
        </p>

        {/* skills */}
        <SectionTitle>skill / stack</SectionTitle>
        <div className="flex flex-wrap gap-2.5">
          <TechCircle label="PY" bg="#3776AB" fg="#fff" />
          <TechCircle label="SK" bg="#F7931E" fg="#fff" />
          <TechCircle label="TF" bg="#FF6F00" fg="#fff" />
          <TechCircle label="PT" bg="#EE4C2C" fg="#fff" />
          <TechCircle label="HF" bg="#FFD21E" fg="#000" />
          <TechCircle label="VC" bg="#000000" fg="#fff" />
        </div>

        {/* featured work */}
        <SectionTitle>featured work</SectionTitle>
        <p className="text-[13px] text-muted-foreground">selected highlights from my contributions and projects</p>
        <div className="mt-3 inline-flex p-0.5 rounded-md border border-border bg-muted/60 text-[12.5px]">
          <button
            onClick={() => setTab("prs")}
            className={`px-3 py-1 rounded transition ${tab === "prs" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >pull requests</button>
          <button
            onClick={() => setTab("projects")}
            className={`px-3 py-1 rounded transition ${tab === "projects" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >projects</button>
        </div>
        <div className="mt-3">
          {tab === "prs" ? (
            <>
              <PRRow title="remove deprecated udp tpu socket bindings" repo="anza-xyz/agave" num="#9291" />
              <PRRow title="feat: impl inner instructions tracking behind feature flag" repo="anza-xyz/mollusk" num="#184" />
              <PRRow title="feat: add default keypair option for keypair path input" repo="blueshift-gg/Scilla" num="#79" />
            </>
          ) : (
            <>
              <PRRow title="ordr.trade — fully onchain clob" repo="ordrtrade/core" num="v0.4" />
              <PRRow title="pinocchio playground" repo="syphax/pinocchio-pg" num="v0.1" />
              <PRRow title="solana protocol notes" repo="syphax/sol-notes" num="docs" />
            </>
          )}
        </div>

        {/* proof of work */}
        <SectionTitle>proof of work</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <StatCard label="projects" value="19" />
          <StatCard label="core contributions" value="48" />
          <StatCard label="community" value="4" />
          <StatCard label="hackathons" value="1" />
        </div>

        {/* experience */}
        <SectionTitle>experience</SectionTitle>
        <p className="text-[13px] text-muted-foreground">
          throughout my career, i've worked on cool project/places in the solana ecosystem,
          from building scalable systems to low-level protocol work. here's a brief overview.
        </p>
        <div className="mt-3">
          <ExperienceItem
            date="mar 2026 — now"
            role="co-founder"
            org="ordr.trade"
            body="fully onchain clob on solana. drove a create_market refactor moving 6 cpis client side (~82% cu reduction). rewrote hotpaths in sbf assembly."
          />
          <ExperienceItem
            date="feb 2026 — mar 2026"
            role="security bootcamp student"
            org="rektoff"
            body="selected as one of 125 students for the solana rust security bootcamp. covered exploit patterns, fuzzing, and audit methodology."
          />
          <ExperienceItem
            date="feb 2025 — now"
            role="member / 3x grant recipient"
            org="superteam"
            body="active member of superteam, contributing to the solana ecosystem through projects, collaborations, and community initiatives."
          />
          <ExperienceItem
            date="aug 2024 — now"
            role="brand ambassador"
            org="project athena"
            body="brand ambassador for project athena. representing the community and driving growth."
          />
          <ExperienceItem
            date="may 2025 — nov 2025"
            role="full stack solana engineer"
            org="piratecrew.fun"
            body="led meteora infra integrations, built complex backend systems, and shipped end-to-end mainnet smart contract integrations."
          />
          <ExperienceItem
            date="various dates"
            role="cohort student"
            org="solana turbin3"
            body="part of builder, advanced svm, accel cohorts. explored solana's architecture deeply, understanding the runtime, sealevel parallelization, and low-level mechanics of the chain."
          />
        </div>

        {/* writings */}
        <SectionTitle>writings</SectionTitle>
        <div className="grid md:grid-cols-3 gap-2.5">
          {[
            { d: "29/11/25", t: "why agave moved to quic: not the 'best' protocol, ...", m: "2 m" },
            { d: "26/11/25", t: "understanding quic: the simple explanation", m: "4 m" },
            { d: "25/07/25", t: "pinocchio: the no-dependency framework for solana ...", m: "3 m" },
          ].map((w) => (
            <a key={w.t} href="#" className="border border-border rounded-lg p-3.5 hover:bg-accent/40 transition flex flex-col gap-2">
              <div className="font-mono text-[11px] text-muted-foreground">{w.d}</div>
              <div className="text-[13.5px] leading-snug">{w.t}</div>
              <div className="font-mono text-[11px] text-muted-foreground mt-auto">{w.m}</div>
            </a>
          ))}
        </div>

        {/* contact */}
        <SectionTitle>contact</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {[
            { I: Mail, label: "email", v: "hi@syphax.dev" },
            { I: Twitter, label: "x.com", v: "@syphax" },
            { I: Send, label: "telegram", v: "@syphax" },
            { I: Github, label: "github", v: "@syphax" },
            { I: Linkedin, label: "linkedin", v: "/in/syphax" },
            { I: Youtube, label: "youtube", v: "@syphax" },
          ].map(({ I, label, v }) => (
            <a key={label} href="#" className="flex items-center gap-2.5 border border-border rounded-lg p-3 hover:bg-accent/40 transition">
              <I className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground">{label}</span>
                <span className="text-[13px]">{v}</span>
              </div>
            </a>
          ))}
        </div>

        <footer className="mt-20 flex flex-col items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-foreground">built with tanstack</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground">rss</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground">sitemap</a>
          </div>
          <div>© 2026 syphax</div>
        </footer>
      </main>
    </div>
  );
}
