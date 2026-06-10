import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, Clock, BadgeCheck, ArrowUpRight, Home, Layers, FolderOpen,
  User, Tag, Mail, Sun, Github, Twitter, Send, Linkedin, Youtube,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "avhi — full-stack solana engineer" },
      { name: "description", content: "Personal site of avhi, a full-stack solana engineer." },
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

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 rounded-md border border-border bg-muted text-[11px] text-foreground/80">
      {children}
    </kbd>
  );
}

function SectionTitle({ id, letter, children }: { id?: string; letter: string; children: React.ReactNode }) {
  return (
    <div id={id} className="flex items-center gap-2 text-[13px] tracking-widest uppercase text-foreground/80 mt-16 mb-6">
      <span>{children}</span>
      <Kbd>{letter}</Kbd>
    </div>
  );
}

function TechCircle({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-[11px] font-bold border border-border shadow-sm"
      style={{ background: bg, color: fg }}
      title={label}
    >
      {label}
    </div>
  );
}

function PRRow({ title, repo, num }: { title: string; repo: string; num: string }) {
  return (
    <a className="group flex items-start justify-between gap-4 py-4 border-t border-border first:border-t-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition" href="#">
      <div>
        <div className="text-foreground/90 group-hover:text-foreground">{title}</div>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">⑃ {repo}</span>
          <span>•</span>
          <span>{num}</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded-full bg-badge text-badge-foreground text-[10px] tracking-wider">MERGED</span>
        </div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-1" />
    </a>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <a href="#" className="flex flex-col gap-2 border border-border rounded-xl p-4 hover:bg-accent/40 transition">
      <div className="text-[12px] text-muted-foreground">{label}</div>
      <div className="text-2xl">{value}</div>
    </a>
  );
}

function ExperienceItem({
  date, role, org, body,
}: { date: string; role: string; org: string; body: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3 md:gap-8 py-6 border-t border-border first:border-t-0">
      <div className="text-[12px] text-muted-foreground pt-1">{date}</div>
      <div>
        <h3 className="text-[15px] flex items-center gap-2 flex-wrap">
          <span>{role}</span>
          <span className="inline-flex items-center gap-1 text-foreground">
            <span className="w-5 h-5 rounded-md bg-foreground text-background flex items-center justify-center text-[10px]">◎</span>
            <span>{org}</span>
          </span>
        </h3>
        <p className="mt-2 text-[13.5px] text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function Heatmap() {
  const months = ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];
  const cols = 52, rows = 7;
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    const r = s - Math.floor(s);
    const v = r < 0.55 ? 0 : r < 0.78 ? 1 : r < 0.92 ? 2 : 3;
    return v;
  });
  const shades = ["bg-muted", "bg-foreground/20", "bg-foreground/50", "bg-foreground/80"];
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {cells.map((v, i) => (
              <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${shades[v]}`} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground tracking-wider">
            {months.map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 text-[11px] text-muted-foreground">
        {["2026","2025","2024","2023","2022"].map((y, i) => (
          <button key={y} className={`px-2 py-1 rounded-md border border-border ${i === 1 ? "bg-foreground text-background border-foreground" : "hover:bg-accent"}`}>{y}</button>
        ))}
      </div>
    </div>
  );
}

function Dock() {
  const items = [Home, Layers, FolderOpen, User, Tag, Mail, Sun];
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1 px-3 py-2 rounded-full border border-border bg-background/80 backdrop-blur shadow-lg">
        {items.map((Icon, i) => (
          <button key={i} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-accent transition">
            <Icon className="w-4 h-4 text-foreground/80" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Index() {
  const time = useClock();
  const [tab, setTab] = useState<"prs" | "projects">("prs");

  return (
    <div className="min-h-screen pb-32">
      {/* top bar */}
      <header className="max-w-2xl mx-auto px-5 pt-8 flex items-center justify-between text-[12px] text-muted-foreground tracking-wider">
        <div>EST. 2003</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{time || "00:00:00 GMT+00:00"}</span>
          </div>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border hover:bg-accent">
            <Search className="w-3.5 h-3.5" />
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 mt-14">
        {/* profile */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border">
          <div className="absolute inset-0 grid place-items-center text-3xl text-muted-foreground">a</div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
        </div>

        <h1 className="mt-5 text-4xl flex items-center gap-2 lowercase">
          avhi
          <BadgeCheck className="w-6 h-6 text-sky-500 fill-sky-500/15" />
        </h1>

        <p className="mt-3 text-[15px] text-muted-foreground">
          full-stack solana engineer // co-founder{" "}
          <a href="#" className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline">
            <span className="w-4 h-4 rounded-full bg-foreground inline-block" /> ordr.trade
          </a>
        </p>

        <p className="mt-6 text-[14.5px] leading-relaxed text-foreground/90">
          hey, i'm avhi a full-stack{" "}
          <span className="inline-flex items-center align-middle px-1.5 py-0.5 rounded-md bg-gradient-to-br from-fuchsia-400 to-cyan-400 text-white text-[11px] mx-0.5">◎</span>
          solana engineer working close to the protocol. i contribute to solana's
          core infrastructure, including the protocol itself and low-level tooling.
        </p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-foreground/90">
          currently specializing in distributed systems and understanding solana's
          protocol internals. member at <span className="text-foreground underline underline-offset-4">superteam</span>,
          actively contributing to the ecosystem. i occasionally write about solana internals.
        </p>

        {/* skills */}
        <SectionTitle letter="S">skill / stack</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <TechCircle label="rs" bg="#000" fg="#fff" />
          <TechCircle label="C" bg="#283593" fg="#fff" />
          <TechCircle label="TS" bg="#3178c6" fg="#fff" />
          <TechCircle label="SOL" bg="linear-gradient(135deg,#9945FF,#14F195)" fg="#000" />
          <TechCircle label="MET" bg="linear-gradient(135deg,#f59e0b,#ef4444)" fg="#fff" />
          <TechCircle label="GH" bg="#0d1117" fg="#fff" />
        </div>

        {/* featured work */}
        <SectionTitle letter="F">featured work</SectionTitle>
        <p className="text-[13.5px] text-muted-foreground">selected highlights from my contributions and projects</p>
        <div className="mt-4 inline-flex p-1 rounded-lg border border-border bg-muted/60 text-[13px]">
          <button
            onClick={() => setTab("prs")}
            className={`px-3 py-1.5 rounded-md transition ${tab === "prs" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >pull requests</button>
          <button
            onClick={() => setTab("projects")}
            className={`px-3 py-1.5 rounded-md transition ${tab === "projects" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >projects</button>
        </div>
        <div className="mt-4">
          {tab === "prs" ? (
            <>
              <PRRow title="remove deprecated udp tpu socket bindings" repo="anza-xyz/agave" num="#9291" />
              <PRRow title="feat: impl inner instructions tracking behind feature flag" repo="anza-xyz/mollusk" num="#184" />
              <PRRow title="feat: add default keypair option for keypair path input" repo="blueshift-gg/Scilla" num="#79" />
            </>
          ) : (
            <>
              <PRRow title="ordr.trade — fully onchain clob" repo="ordrtrade/core" num="v0.4" />
              <PRRow title="pinocchio playground" repo="avhimaz/pinocchio-pg" num="v0.1" />
              <PRRow title="solana protocol notes" repo="avhimaz/sol-notes" num="docs" />
            </>
          )}
        </div>

        {/* proof of work */}
        <SectionTitle letter="P">proof of work</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="projects" value="19" />
          <StatCard label="core contributions" value="48" />
          <StatCard label="community" value="4" />
          <StatCard label="hackathons" value="1" />
        </div>
        <Heatmap />

        {/* experience */}
        <SectionTitle letter="E">experience</SectionTitle>
        <p className="text-[13.5px] text-muted-foreground">
          throughout my career, i've worked on cool project/places in the solana ecosystem,
          from building scalable systems to low-level protocol work. here's a brief overview.
        </p>
        <div className="mt-4">
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
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { d: "29/11/25", t: "why agave moved to quic: not the 'best' protocol, ...", m: "2 m" },
            { d: "26/11/25", t: "understanding quic: the simple explanation", m: "4 m" },
            { d: "25/07/25", t: "pinocchio: the no-dependency framework for solana ...", m: "3 m" },
          ].map((w) => (
            <a key={w.t} href="#" className="border border-border rounded-xl p-4 hover:bg-accent/40 transition flex flex-col gap-3">
              <div className="text-[11px] text-muted-foreground">{w.d}</div>
              <div className="text-[13.5px] leading-snug">{w.t}</div>
              <div className="text-[11px] text-muted-foreground mt-auto">{w.m}</div>
            </a>
          ))}
        </div>

        {/* contact */}
        <SectionTitle letter="C">contact</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { I: Mail, label: "email", v: "dev@avhi.in" },
            { I: Twitter, label: "x.com", v: "@avhidotsol" },
            { I: Send, label: "telegram", v: "@avhidotsol" },
            { I: Github, label: "github", v: "@AvhiMaz" },
            { I: Linkedin, label: "linkedin", v: "/in/avhi-maz" },
            { I: Youtube, label: "youtube", v: "@avhimaz" },
          ].map(({ I, label, v }) => (
            <a key={label} href="#" className="flex items-center gap-3 border border-border rounded-xl p-3 hover:bg-accent/40 transition">
              <I className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground">{label}</span>
                <span className="text-[13px]">{v}</span>
              </div>
            </a>
          ))}
        </div>

        <footer className="mt-20 flex flex-col items-center gap-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-foreground">built with tanstack</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground">rss</a>
            <span>·</span>
            <a href="#" className="hover:text-foreground">sitemap</a>
          </div>
          <div>© 2026 avhi.sol</div>
          <div>25.9k visits</div>
        </footer>
      </main>

      <Dock />
    </div>
  );
}
