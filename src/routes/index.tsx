import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, Clock, ArrowUpRight, Home, Layers, FolderOpen,
  User, Tag, Mail, Sun, Moon, Github, Twitter, Send, Linkedin, Youtube,
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
    <kbd className="font-mono inline-flex items-center justify-center min-w-5 h-5 px-1 rounded border border-border bg-muted text-[10px] text-foreground/80">
      {children}
    </kbd>
  );
}

function SectionTitle({ letter, children }: { letter: string; children: React.ReactNode }) {
  return (
    <div className="font-mono flex items-center gap-2 text-[11px] tracking-widest uppercase text-foreground/80 mt-12 mb-4">
      <span>{children}</span>
      <Kbd>{letter}</Kbd>
    </div>
  );
}

function TechCircle({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold border border-border shadow-sm"
      style={{ background: bg, color: fg }}
      title={label}
    >
      {label}
    </div>
  );
}

function PRRow({ title, repo, num }: { title: string; repo: string; num: string }) {
  return (
    <a className="group flex items-start justify-between gap-4 py-3 border-t border-border first:border-t-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition" href="#">
      <div>
        <div className="text-[13px] text-foreground/90 group-hover:text-foreground">{title}</div>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
          <span>{repo}</span>
          <span>•</span>
          <span>{num}</span>
          <span>•</span>
          <span className="px-1.5 py-0.5 rounded-full bg-badge text-badge-foreground text-[9px] tracking-wider">MERGED</span>
        </div>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0 mt-1" />
    </a>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <a href="#" className="flex flex-col gap-1.5 border border-border rounded-lg p-3 hover:bg-accent/40 transition">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-lg">{value}</div>
    </a>
  );
}

function ExperienceItem({
  date, role, org, body,
}: { date: string; role: string; org: string; body: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-2 md:gap-6 py-4 border-t border-border first:border-t-0">
      <div className="font-mono text-[11px] text-muted-foreground pt-0.5">{date}</div>
      <div>
        <h3 className="text-[13px] flex items-center gap-2 flex-wrap">
          <span>{role}</span>
          <span className="inline-flex items-center gap-1 text-foreground">
            <span className="w-4 h-4 rounded bg-foreground text-background flex items-center justify-center text-[9px]">◎</span>
            <span>{org}</span>
          </span>
        </h3>
        <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Dock({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const items = [
    { I: Home }, { I: Layers }, { I: FolderOpen }, { I: User }, { I: Tag }, { I: Mail },
  ];
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-full border border-border bg-background/80 backdrop-blur shadow-lg">
        {items.map(({ I }, i) => (
          <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition">
            <I className="w-3.5 h-3.5 text-foreground/80" />
          </button>
        ))}
        <button
          onClick={toggle}
          aria-label="toggle theme"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition"
        >
          {dark
            ? <Sun className="w-3.5 h-3.5 text-foreground/80" />
            : <Moon className="w-3.5 h-3.5 text-foreground/80" />}
        </button>
      </div>
    </div>
  );
}

function Index() {
  const time = useClock();
  const { dark, toggle } = useTheme();
  const [tab, setTab] = useState<"prs" | "projects">("prs");

  return (
    <div className="min-h-screen pb-28 text-[13px]">
      {/* top bar */}
      <header className="max-w-xl mx-auto px-5 pt-6 flex items-center justify-between font-mono text-[11px] text-muted-foreground tracking-wider">
        <div>EST. 2003</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{time || "00:00:00 GMT+00:00"}</span>
          </div>
          <button className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-border hover:bg-accent">
            <Search className="w-3 h-3" />
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 mt-10">
        {/* profile */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border">
          <div className="absolute inset-0 grid place-items-center text-2xl text-muted-foreground">s</div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
        </div>

        <h1 className="font-serif mt-4 text-3xl md:text-[34px] font-medium tracking-tight">
          Hi, I'm Syphax
        </h1>

        <p className="mt-2 text-[13px] text-muted-foreground">
          full-stack solana engineer // co-founder{" "}
          <a href="#" className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline">
            <span className="w-3 h-3 rounded-full bg-foreground inline-block" /> ordr.trade
          </a>
        </p>

        <p className="mt-4 text-[13px] leading-relaxed text-foreground/90">
          hey, i'm a full-stack{" "}
          <span className="inline-flex items-center align-middle px-1 py-0.5 rounded bg-gradient-to-br from-fuchsia-400 to-cyan-400 text-white text-[10px] mx-0.5">◎</span>
          solana engineer working close to the protocol. i contribute to solana's
          core infrastructure, including the protocol itself and low-level tooling.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-foreground/90">
          currently specializing in distributed systems and understanding solana's
          protocol internals. member at <span className="text-foreground underline underline-offset-4">superteam</span>,
          actively contributing to the ecosystem. i occasionally write about solana internals.
        </p>

        {/* skills */}
        <SectionTitle letter="S">skill / stack</SectionTitle>
        <div className="flex flex-wrap gap-2">
          <TechCircle label="rs" bg="#000" fg="#fff" />
          <TechCircle label="C" bg="#283593" fg="#fff" />
          <TechCircle label="TS" bg="#3178c6" fg="#fff" />
          <TechCircle label="SOL" bg="linear-gradient(135deg,#9945FF,#14F195)" fg="#000" />
          <TechCircle label="MET" bg="linear-gradient(135deg,#f59e0b,#ef4444)" fg="#fff" />
          <TechCircle label="GH" bg="#0d1117" fg="#fff" />
        </div>

        {/* featured work */}
        <SectionTitle letter="F">featured work</SectionTitle>
        <p className="text-[12px] text-muted-foreground">selected highlights from my contributions and projects</p>
        <div className="mt-3 inline-flex p-0.5 rounded-md border border-border bg-muted/60 text-[11.5px]">
          <button
            onClick={() => setTab("prs")}
            className={`px-2.5 py-1 rounded transition ${tab === "prs" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >pull requests</button>
          <button
            onClick={() => setTab("projects")}
            className={`px-2.5 py-1 rounded transition ${tab === "projects" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
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
        <SectionTitle letter="P">proof of work</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatCard label="projects" value="19" />
          <StatCard label="core contributions" value="48" />
          <StatCard label="community" value="4" />
          <StatCard label="hackathons" value="1" />
        </div>

        {/* experience */}
        <SectionTitle letter="E">experience</SectionTitle>
        <p className="text-[12px] text-muted-foreground">
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
        <SectionTitle letter="W">writings</SectionTitle>
        <div className="grid md:grid-cols-3 gap-2">
          {[
            { d: "29/11/25", t: "why agave moved to quic: not the 'best' protocol, ...", m: "2 m" },
            { d: "26/11/25", t: "understanding quic: the simple explanation", m: "4 m" },
            { d: "25/07/25", t: "pinocchio: the no-dependency framework for solana ...", m: "3 m" },
          ].map((w) => (
            <a key={w.t} href="#" className="border border-border rounded-lg p-3 hover:bg-accent/40 transition flex flex-col gap-2">
              <div className="font-mono text-[10px] text-muted-foreground">{w.d}</div>
              <div className="text-[12.5px] leading-snug">{w.t}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-auto">{w.m}</div>
            </a>
          ))}
        </div>

        {/* contact */}
        <SectionTitle letter="C">contact</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { I: Mail, label: "email", v: "hi@syphax.dev" },
            { I: Twitter, label: "x.com", v: "@syphax" },
            { I: Send, label: "telegram", v: "@syphax" },
            { I: Github, label: "github", v: "@syphax" },
            { I: Linkedin, label: "linkedin", v: "/in/syphax" },
            { I: Youtube, label: "youtube", v: "@syphax" },
          ].map(({ I, label, v }) => (
            <a key={label} href="#" className="flex items-center gap-2.5 border border-border rounded-lg p-2.5 hover:bg-accent/40 transition">
              <I className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">{label}</span>
                <span className="text-[12px]">{v}</span>
              </div>
            </a>
          ))}
        </div>

        <footer className="mt-16 flex flex-col items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
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

      <Dock dark={dark} toggle={toggle} />
    </div>
  );
}
