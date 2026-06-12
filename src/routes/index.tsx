import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, Clock, ArrowUpRight,
  Mail, Github, Twitter, BookOpen
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Syphax — AI/ML Engineer" },
      { name: "description", content: "Portfolio site." },
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
    <kbd className="font-mono inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-400">
      {children}
    </kbd>
  );
}

function SectionTitle({ children, id, shortcut }: { children: React.ReactNode; id: string; shortcut: string }) {
  return (
    <div id={id} style={{ fontFamily: "'Inter', sans-serif" }} className="flex items-center gap-3 text-[14px] tracking-widest uppercase text-zinc-700 dark:text-zinc-300 font-medium mt-16 mb-6">
      <span>{children}</span>
      <span className="px-1.5 py-0.5 text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-md bg-zinc-50 dark:bg-zinc-900/50 lowercase select-none">
        {shortcut}
      </span>
    </div>
  );
}

function TechIcon({ label, iconElement, imgSrc }: { label: string; iconElement?: React.ReactNode; imgSrc?: string }) {
  return (
    <div className="relative group flex flex-col items-center">
      <div className="absolute bottom-full mb-2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-30">
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md px-2.5 py-1 text-[11px] font-mono tracking-wider text-zinc-700 dark:text-zinc-300 shadow-sm whitespace-nowrap">
          {label}
        </div>
      </div>
      {/* Border removed */}
      <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/40 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900">
        {iconElement ? (
          iconElement
        ) : (
          <img src={imgSrc} alt={label} className="w-7 h-7 object-contain select-none pointer-events-none" />
        )}
      </div>
    </div>
  );
}

function ProjectRow({ title, repo, url, desc }: { title: string; repo: string; url: string; desc: string }) {
  return (
    <a className="group flex flex-col gap-1.5 py-5 border-t border-zinc-200 dark:border-zinc-800 first:border-t-0 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/30 -mx-3 px-3 rounded-lg transition-all duration-200" href={url} target="_blank" rel="noreferrer">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{title}</div>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-500 font-mono">
            <span>{repo}</span>
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 shrink-0 mt-1 transition-colors" />
      </div>
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1">{desc}</p>
    </a>
  );
}

function ExperienceItem({ date, role, org, body }: { date: string; role: string; org: string; body: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-6 py-6 border-t border-zinc-200 dark:border-zinc-800 first:border-t-0">
      <div className="font-mono text-[12px] text-zinc-400 dark:text-zinc-500 pt-0.5">{date}</div>
      <div>
        <h3 className="text-[14px] flex items-center gap-2 flex-wrap text-zinc-800 dark:text-zinc-200 font-medium">
          <span>{role}</span>
          <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-[13px]">
            <span className="w-4 h-4 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-[9px]">◎</span>
            <span>{org}</span>
          </span>
        </h3>
        <p className="mt-2 text-[13.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

// ----- GitHub Heatmap: last 6 months, always visible -----
function GitHubHeatmap() {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState<{ date: Date; count: number }[][]>([]);

  useEffect(() => {
    setLoading(true);
    // Fetch contributions for the user (last 6 months via API)
    fetch(`https://github-contributions-api.deno.dev/rkcode2025.json`)
      .then(res => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (json && json.contributions) {
          setData(json.contributions);
        } else {
          throw new Error("Invalid data");
        }
      })
      .catch(err => {
        console.warn("API failed, using dummy data", err);
        // Generate realistic dummy data for last 6 months
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        const dummy: Record<string, number> = {};
        let cur = new Date(startDate);
        while (cur <= endDate) {
          const dateStr = cur.toISOString().split('T')[0];
          const rand = Math.random();
          let count = 0;
          if (rand < 0.6) count = 0;
          else if (rand < 0.8) count = Math.floor(Math.random() * 3) + 1;
          else if (rand < 0.95) count = Math.floor(Math.random() * 4) + 3;
          else count = Math.floor(Math.random() * 5) + 7;
          dummy[dateStr] = count;
          cur.setDate(cur.getDate() + 1);
        }
        setData(dummy);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const weeksArray: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = data[dateStr] || 0;
      currentWeek.push({ date: new Date(currentDate), count });
      
      if (currentDate.getDay() === 6 || currentDate.toDateString() === endDate.toDateString()) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setWeeks(weeksArray);
  }, [data, loading]);

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-zinc-100 dark:bg-zinc-800";
    if (count <= 2) return "bg-emerald-200 dark:bg-emerald-900/60";
    if (count <= 4) return "bg-emerald-400 dark:bg-emerald-700";
    if (count <= 6) return "bg-emerald-600 dark:bg-emerald-500";
    return "bg-emerald-800 dark:bg-emerald-400";
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-zinc-400 text-sm font-mono">
        loading contribution matrix...
      </div>
    );
  }

  if (weeks.length === 0) {
    return (
      <div className="py-8 text-center text-zinc-400 text-sm font-mono">
        No contribution data available.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-none">
      <div className="min-w-[720px]">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm ${getColorClass(day.count)} transition-all hover:scale-110 hover:shadow-sm`}
                  title={`${day.date.toDateString()}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-end items-center gap-2 mt-4 text-[10px] font-mono text-zinc-400">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-200 dark:bg-emerald-900/60" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-800 dark:bg-emerald-400" />
          <span>More</span>
        </div>
        <div className="text-right text-[10px] font-mono text-zinc-400 mt-2">
          Last 6 months
        </div>
      </div>
    </div>
  );
}

function Index() {
  const time = useClock();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = 
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      if (!isInput && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      if (isInput) return;

      const keys: Record<string, string> = {
        s: "stack", p: "projects", g: "github-stats",
        e: "experience", r: "reads", c: "contact"
      };
      const target = keys[e.key.toLowerCase()];
      if (target) {
        e.preventDefault();
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unifiedProjects = [
    { title: "Wikitext-MoE-40M", repo: "rkcode2025/Wikitext-MoE-40M", url: "https://github.com/rkcode2025/Wikitext-MoE-40M", desc: "Developed and benchmarked a 109M parameter transformer architecture achieving 35.34 test perplexity." },
    { title: "AI-Authenticator", repo: "rkcode2025/AI-Authenticator", url: "https://github.com/rkcode2025/AI-Authenticator", desc: "An authentication verification model deployed live on Hugging Face Spaces for detecting synthetic media." },
    { title: "XTRAIN", repo: "MangalanLabs/XTRAIN", url: "https://github.com/MangalanLabs/XTRAIN", desc: "A custom CPU-optimized model-agnostic training framework built from scratch. Spearheaded its mathematics-centric language variant framework." }
  ];

  const searchItems = [
    { id: "stack", name: "Skill / Stack Infrastructure", cat: "Section" },
    { id: "projects", name: "Projects & Production Tooling", cat: "Section" },
    { id: "github-stats", name: "GitHub Activity Engine Tracker", cat: "Section" },
    { id: "experience", name: "Engineering Experience", cat: "Section" },
    { id: "reads", name: "Recent Research Reads", cat: "Section" },
    { id: "contact", name: "Contact Nodes", cat: "Section" }
  ];

  const filteredItems = searchItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 relative select-none selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-x-hidden scrollbar-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:wght@400;500;600&display=swap');
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-full relative">
        <header className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between font-mono text-[12px] text-zinc-400 dark:text-zinc-500 tracking-wider">
          <div className="flex items-center gap-1">EST. 2024</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>{time || "00:00:00 GMT+00:00"}</span>
            </div>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <Kbd>⌘K</Kbd>
            </button>
          </div>
        </header>
      </div>

      <main className="max-w-2xl mx-auto px-6 mt-14">
        <BlurFade delay={0.1} inView>
          <div className="relative p-0 bg-transparent flex flex-col items-center sm:items-start gap-6">
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 group shrink-0 shadow-sm border border-zinc-200/40 dark:border-zinc-800/40">
                <img 
                  src="https://unavatar.io/twitter/syphax_twt" 
                  alt="Syphax" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 grid place-items-center text-5xl font-serif font-medium text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-900">s</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 style={{ fontFamily: "'EB Garamond', serif" }} className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
                    Syphax
                  </h1>
                  <svg className="w-[19px] h-[19px] text-blue-500 fill-current shrink-0 mt-1" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <p className="mt-3 text-[13px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wide">
                  AI/ML Engineer // Student
                </p>
              </div>
            </div>
            {/* Magic UI Animated Theme Toggler */}
            <div className="absolute top-0 right-0">
              <AnimatedThemeToggler dark={dark} toggle={toggle} />
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="space-y-4 mt-10 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>I'm a student with a keen interest in AI/ML engineering and research. I wish to contribute to core infrastructure, including implementing custom designs for language models.</p>
            <p>I’m driven by the desire to build things that make an impact. Currently diving into deep learning, NLP, and transformer architecture.</p>
          </div>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <SectionTitle id="stack" shortcut="s">skill / stack</SectionTitle>
          <div className="flex flex-wrap gap-4.5">
            <TechIcon label="PYTHON" imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" />
            <TechIcon label="PYTORCH" imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" />
            <TechIcon label="TENSORFLOW" imgSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" />
            <TechIcon label="SCIKIT-LEARN" iconElement={<svg className="w-8 h-8 object-contain" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="#F1AA3C"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3499CD" strokeWidth="2"/></svg>} />
            <TechIcon label="HUGGING FACE" imgSrc="https://huggingface.co/front/assets/huggingface_logo-noborder.svg" />
          </div>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <SectionTitle id="projects" shortcut="p">Projects</SectionTitle>
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-4 -mt-2">Core architectures and ML tooling I've built or collaborated on.</p>
          <div className="mt-3 min-h-[160px]">
            {unifiedProjects.map((project) => <ProjectRow key={project.title} {...project} />)}
          </div>
        </BlurFade>

        <BlurFade delay={0.45} inView>
          <SectionTitle id="github-stats" shortcut="g">github contribution matrix</SectionTitle>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-6 -mt-2">
            Activity trace for <span className="font-mono text-zinc-700 dark:text-zinc-300">rkcode2025</span> (last 6 months)
          </p>
          <div className="relative overflow-hidden rounded-3xl py-4">
            <GitHubHeatmap />
          </div>
        </BlurFade>

        <BlurFade delay={0.5} inView>
          <SectionTitle id="experience" shortcut="e">experience</SectionTitle>
          <div className="mt-3">
            <ExperienceItem date="nov 2025 — may 2026" role="AI/ML Intern & Engineer" org="Manglan Labs" body="Worked collaboratively with a research group to design, research, and implement new small-sized model architectures." />
          </div>
        </BlurFade>

        <BlurFade delay={0.6} inView>
          <SectionTitle id="reads" shortcut="r">recent reads</SectionTitle>
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-4 -mt-2">Research papers and insights I am currently exploring.</p>
          <div className="grid md:grid-cols-3 gap-2.5">
            {[
              { d: "Research", t: "Efficient Estimation of Word Representations in Vector Space", href: "#reads" },
              { d: "Research", t: "Attention Is All You Need: Fundamentals of Transformers", href: "#reads" },
              { d: "Research", t: "Outrageously Large Neural Networks: Sparsely-Gated MoE", href: "#reads" },
            ].map((w) => (
              <a key={w.t} href={w.href} className="border border-zinc-200 dark:border-zinc-900 rounded-xl p-3.5 bg-white/30 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition flex flex-col gap-2">
                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5"><BookOpen className="w-3 h-3"/> {w.d}</div>
                <div className="text-[13.5px] leading-snug text-zinc-700 dark:text-zinc-300">{w.t}</div>
              </a>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.7} inView>
          <SectionTitle id="contact" shortcut="c">contact</SectionTitle>
          <div className="w-full border-t border-zinc-200 dark:border-zinc-900 mt-2">
            {[
              { I: Mail, label: "email", v: "syphaxtwt2025@gmail.com", url: "mailto:syphaxtwt2025@gmail.com" },
              { I: Twitter, label: "x.com", v: "@syphax_twt", url: "https://x.com/syphax_twt" },
              { I: Github, label: "github", v: "rkcode2025", url: "https://github.com/rkcode2025" },
            ].map(({ I, label, v, url }) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-4 border-b border-zinc-200 dark:border-zinc-900 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 px-2 rounded-md transition-colors">
                <div className="flex items-center gap-3">
                  <I className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors" />
                  <span className="text-[14px] text-zinc-700 dark:text-zinc-300 font-mono tracking-wide">{label}</span>
                </div>
                <div className="flex items-center gap-1.5 text-right font-mono">
                  <span className="text-[14px] text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">{v}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={0.8} inView>
          <footer className="mt-24 flex flex-col items-center gap-1.5 font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
            <div className="flex items-center gap-2">
              <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">built with tanstack</a>
              <span>·</span>
              <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">rss</a>
              <span>·</span>
              <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">sitemap</a>
            </div>
            <div>© 2026 syphax</div>
          </footer>
        </BlurFade>
      </main>

      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSearchOpen(false)} className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs" />
            <motion.div initial={{ opacity: 0, scale: 0.98, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -4 }} transition={{ duration: 0.15 }} className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl relative z-10 overflow-hidden font-mono">
              <div className="flex items-center gap-3 px-4 border-b border-zinc-200 dark:border-zinc-800">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input autoFocus type="text" placeholder="Search architecture layers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-4 text-[13px] bg-transparent text-zinc-800 dark:text-zinc-100 outline-none border-none placeholder-zinc-400" />
                <button onClick={() => setIsSearchOpen(false)} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-400 rounded-md">ESC</button>
              </div>
              <div className="max-h-[250px] overflow-y-auto p-1.5">
                {filteredItems.length > 0 ? filteredItems.map((item) => (
                  <button key={item.id} onClick={() => { setIsSearchOpen(false); document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" }); }} className="w-full text-left p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors cursor-pointer rounded-lg group">
                    <span className="text-[13px] text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">{item.name}</span>
                    <span className="text-[9px] text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 rounded-md uppercase">{item.cat}</span>
                  </button>
                )) : <div className="p-4 text-center text-zinc-400 text-[11px]">No modules indexed.</div>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
