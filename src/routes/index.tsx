import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, Clock, ArrowUpRight,
  Mail, Sun, Moon, Github, Twitter, BookOpen
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Syphax — AI/ML Engineer" },
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

function ProjectRow({ title, repo, url, desc }: { title: string; repo: string; url: string; desc: string }) {
  return (
    <a className="group flex flex-col gap-1.5 py-4 border-t border-border first:border-t-0 hover:bg-accent/50 -mx-2 px-2 rounded-md transition" href={url} target="_blank" rel="noreferrer">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[14px] font-medium text-foreground/90 group-hover:text-foreground">{title}</div>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-muted-foreground font-mono">
            <span>{repo}</span>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 mt-1" />
      </div>
      <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">{desc}</p>
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

  return (
    <div className="min-h-screen pb-16 text-[14px]">
      {/* top bar */}
      <header className="max-w-2xl mx-auto px-6 pt-8 flex items-center justify-between font-mono text-[12px] text-muted-foreground tracking-wider">
        <div>EST. 2026</div>
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
        {/* profile header */}
        <BlurFade delay={0.1} inView>
          {/* Dynamic Twitter PFP with Hover Effect */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted border border-border group cursor-pointer">
            <img 
              src="https://unavatar.io/twitter/syphax_twt" 
              alt="Syphax" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback to the original "s" placeholder if the image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden absolute inset-0 grid place-items-center text-4xl text-muted-foreground bg-muted">s</div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background z-10" />
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
            AI/ML Engineer // Student
          </p>
        </BlurFade>

        {/* bio */}
        <BlurFade delay={0.2} inView>
          <p className="mt-5 text-[14px] leading-relaxed text-foreground/90">
            I'm a student with a keen interest in AI/ML engineering and research. I wish to contribute to
            core infrastructure, including implementing custom designs for language models.
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-foreground/90">
            I’m driven by the desire to build things that make an impact.
            Currently diving into deep learning, NLP, and transformer architecture.
          </p>
        </BlurFade>

        {/* skills */}
        <BlurFade delay={0.3} inView>
          <SectionTitle>skill / stack</SectionTitle>
          <div className="flex flex-wrap gap-2.5">
            <TechCircle label="PY" bg="#3776AB" fg="#fff" />
            <TechCircle label="PT" bg="#EE4C2C" fg="#fff" />
            <TechCircle label="HF" bg="#FFD21E" fg="#000" />
            <TechCircle label="MoE" bg="#000000" fg="#fff" />
            <TechCircle label="3D" bg="#8892BF" fg="#fff" />
          </div>
        </BlurFade>

        {/* featured work */}
        <BlurFade delay={0.4} inView>
          <SectionTitle>Projects</SectionTitle>
          <p className="text-[13px] text-muted-foreground mb-4">Core architectures and ML tooling I've built or collaborated on.</p>
          <div className="mt-3">
            <ProjectRow 
              title="Wikitext-MoE-40M" 
              repo="rkcode2025/Wikitext-MoE-40M" 
              url="https://github.com/rkcode2025/Wikitext-MoE-40M"
              desc="Developed and benchmarked a 109M parameter transformer model achieving a 35.34 test perplexity." 
            />
            <ProjectRow 
              title="XTRAIN" 
              repo="MangalanLabs/XTRAIN" 
              url="https://github.com/MangalanLabs/XTRAIN"
              desc="A collaborative CPU training framework built on an original model design. Specifically led the development of the LMV model specializing in mathematics." 
            />
            <ProjectRow 
              title="AI-Authenticator" 
              repo="rkcode2025/AI-Authenticator" 
              url="https://github.com/rkcode2025/AI-Authenticator"
              desc="A deployed authentication tool for detecting AI-generated images, hosted live on Hugging Face Spaces." 
            />
          </div>
        </BlurFade>

        {/* experience */}
        <BlurFade delay={0.5} inView>
          <SectionTitle>experience</SectionTitle>
          <div className="mt-3">
            <ExperienceItem
              date="nov 2025 — may 2026"
              role="AI/ML Intern & Engineer"
              org="Manglan Labs"
              body="Worked collaboratively with a research group to design, research, and implement new small-sized model architectures."
            />
          </div>
        </BlurFade>

        {/* recent reads */}
        <BlurFade delay={0.6} inView>
          <SectionTitle>recent reads</SectionTitle>
          <p className="text-[13px] text-muted-foreground mb-4">Research papers and insights I am currently exploring.</p>
          <div className="grid md:grid-cols-3 gap-2.5">
            {[
              { d: "Research", t: "Efficient Estimation of Word Representations in Vector Space", href: "#reads" },
              { d: "Research", t: "Attention Is All You Need: Fundamentals of Transformers", href: "#reads" },
              { d: "Research", t: "Outrageously Large Neural Networks: Sparsely-Gated MoE", href: "#reads" },
            ].map((w) => (
              <a key={w.t} href={w.href} className="border border-border rounded-lg p-3.5 hover:bg-accent/40 transition flex flex-col gap-2">
                <div className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5"><BookOpen className="w-3 h-3"/> {w.d}</div>
                <div className="text-[13.5px] leading-snug">{w.t}</div>
              </a>
            ))}
          </div>
        </BlurFade>

        {/* contact */}
        <BlurFade delay={0.7} inView>
          <SectionTitle>contact</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {[
              { I: Mail, label: "email", v: "syphaxtwt2025@gmail.com", url: "mailto:syphaxtwt2025@gmail.com" },
              { I: Twitter, label: "x.com", v: "@syphax_twt", url: "https://x.com/syphax_twt" },
              { I: Github, label: "github", v: "rkcode2025", url: "https://github.com/rkcode2025" },
            ].map(({ I, label, v, url }) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 border border-border rounded-lg p-3 hover:bg-accent/40 transition group">
                <I className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="flex flex-col">
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                  <span className="text-[13px]">{v}</span>
                </div>
              </a>
            ))}
          </div>
        </BlurFade>

        {/* footer */}
        <BlurFade delay={0.8} inView>
          <footer className="mt-20 flex flex-col items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <a href="#" className="hover:text-foreground transition-colors">built with tanstack</a>
              <span>·</span>
              <a href="#" className="hover:text-foreground transition-colors">rss</a>
              <span>·</span>
              <a href="#" className="hover:text-foreground transition-colors">sitemap</a>
            </div>
            <div>© 2026 syphax</div>
          </footer>
        </BlurFade>
      </main>
    </div>
  );
}
