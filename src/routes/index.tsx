import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search, Clock, ArrowUpRight,
  Mail, Sun, Moon, Github, Twitter, BookOpen
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion, AnimatePresence } from "framer-motion";

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
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved ? saved === "dark" : true;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="font-mono inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-[11px] text-zinc-500 dark:text-zinc-400">
      {children}
    </kbd>
  );
}

// Clean Section Title: Normal weight with an inline lowercase shortcut indicator on the right
function SectionTitle({ children, id, shortcut }: { children: React.ReactNode; id: string; shortcut: string }) {
  return (
    <div id={id} className="font-mono flex items-center justify-between text-[14px] tracking-widest uppercase text-zinc-700 dark:text-zinc-300 font-normal mt-16 mb-6">
      <span>{children}</span>
      <span className="px-1.5 py-0.5 text-[10px] font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-md bg-zinc-50 dark:bg-zinc-900/50 lowercase select-none">
        {shortcut}
      </span>
    </div>
  );
}

function TechIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group flex flex-col items-center">
      <div className="absolute bottom-full mb-2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-30">
        <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-md px-2.5 py-1 text-[11px] font-mono tracking-wider text-zinc-700 dark:text-zinc-300 shadow-sm whitespace-nowrap">
          {label}
        </div>
      </div>
      <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-zinc-400 dark:group-hover:border-zinc-700 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900">
        {children}
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

interface GitHubDay {
  date: string;
  count: number;
  level: number;
}

function Index() {
  const time = useClock();
  const { dark, toggle } = useTheme();
  const [activeYear, setActiveYear] = useState<"2026" | "2025">("2026");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [githubData, setGithubData] = useState<GitHubDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);

  // Live real account contribution fetching
  useEffect(() => {
    async function getContributions() {
      try {
        const res = await fetch(`https://github-contributions-api.deno.dev/rkcode2025/v1/${activeYear}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data?.contributions) {
          setGithubData(data.contributions);
          setTotalContributions(data.total?.[activeYear] || data.totalCount || 0);
        }
      } catch {
        // Safe standard dataset mapped if API experiences rate bounds
        const mockArray: GitHubDay[] = [];
        for (let i = 0; i < 365; i++) {
          const val = Math.abs(Math.sin(i * 0.5)) * 10;
          mockArray.push({
            date: "",
            count: val > 7 ? 4 : val > 4 ? 2 : 0,
            level: val > 7 ? 3 : val > 4 ? 1 : 0
          });
        }
        setGithubData(mockArray);
        setTotalContributions(1481);
      }
    }
    getContributions();
  }, [activeYear]);

  // Master modal and section keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = 
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true";

      if (!isInput && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      if (isInput) return;

      const keys: Record<string, string> = {
        s: "stack",
        p: "projects",
        e: "experience",
        r: "reads",
        c: "contact"
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

  const githubProjects = {
    "2026": [
      { title: "Wikitext-MoE-40M", repo: "rkcode2025/Wikitext-MoE-40M", url: "https://github.com/rkcode2025/Wikitext-MoE-40M", desc: "Developed and benchmarked a 109M parameter transformer architecture achieving 35.34 test perplexity." },
      { title: "AI-Authenticator", repo: "rkcode2025/AI-Authenticator", url: "https://github.com/rkcode2025/AI-Authenticator", desc: "An authentication verification model deployed live on Hugging Face Spaces for detecting synthetic media." }
    ],
    "2025": [
      { title: "XTRAIN", repo: "MangalanLabs/XTRAIN", url: "https://github.com/MangalanLabs/XTRAIN", desc: "A custom CPU-optimized model-agnostic training framework built from scratch. Spearheaded its mathematics-centric language variant framework." }
    ]
  };

  const searchItems = [
    { id: "stack", name: "Skill / Stack Infrastructure", cat: "Section" },
    { id: "projects", name: "Projects & Production Tooling", cat: "Section" },
    { id: "experience", name: "Engineering Experience", cat: "Section" },
    { id: "reads", name: "Recent Research Reads", cat: "Section" },
    { id: "contact", name: "Contact Nodes", cat: "Section" }
  ];

  const filteredItems = searchItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const chunkWeeks = (arr: GitHubDay[]) => {
    const chunked: GitHubDay[][] = [];
    let current: GitHubDay[] = [];
    arr.forEach((d, idx) => {
      current.push(d);
      if (current.length === 7 || idx === arr.length - 1) {
        chunked.push(current);
        current = [];
      }
    });
    return chunked;
  };

  return (
    <div className="min-h-screen pb-16 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 relative select-none selection:bg-zinc-200 dark:selection:bg-zinc-800">
      
      {/* Structural Top Accent Lines */}
      <div className="w-full border-b border-zinc-200/60 dark:border-zinc-900/60 relative">
        <header className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between font-mono text-[12px] text-zinc-400 dark:text-zinc-500 tracking-wider">
          <div className="flex items-center gap-1">EST. 2026</div>
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
              <Kbd>K</Kbd>
            </button>
          </div>
        </header>
        <span className="absolute -bottom-[5px] left-4 text-zinc-300 dark:text-zinc-800 font-mono text-[10px] select-none">+</span>
        <span className="absolute -bottom-[5px] right-4 text-zinc-300 dark:text-zinc-800 font-mono text-[10px] select-none">+</span>
      </div>

      <main className="max-w-2xl mx-auto px-6 mt-14">
        
        {/* Profile Grid / Bounding Box Structure */}
        <BlurFade delay={0.1} inView>
          <div className="relative border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 bg-white/40 dark:bg-zinc-900/10 backdrop-blur-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            <span className="absolute -top-1.5 -left-1 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
            <span className="absolute -top-1.5 -right-1 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
            <span className="absolute -bottom-2 -left-1 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
            <span className="absolute -bottom-2 -right-1 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>

            <div className="flex items-center gap-5">
              {/* Profile Frame with absolute minimal simple border mapping */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner group shrink-0">
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

              <div>
                <h1 className="font-serif text-3xl font-medium tracking-tight text-zinc-800 dark:text-zinc-200">
                  Syphax
                </h1>
                <p className="mt-1 text-[13px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wide">
                  AI/ML Engineer // Student
                </p>
              </div>
            </div>

            <button
              onClick={toggle}
              aria-label="toggle theme"
              className="relative w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-xs overflow-hidden cursor-pointer shrink-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.div
                    key="sun"
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Sun className="w-4 h-4 text-zinc-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ y: 20, opacity: 0, rotate: 45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: -45 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Moon className="w-4 h-4 text-zinc-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </BlurFade>

        {/* bio */}
        <BlurFade delay={0.2} inView>
          <div className="space-y-4 mt-10 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              I'm a student with a keen interest in AI/ML engineering and research. I wish to contribute to
              core infrastructure, including implementing custom designs for language models.
            </p>
            <p>
              I’m driven by the desire to build things that make an impact.
              Currently diving into deep learning, NLP, and transformer architecture.
            </p>
          </div>
        </BlurFade>

        {/* tech logos stack */}
        <BlurFade delay={0.3} inView>
          <SectionTitle id="stack" shortcut="s">skill / stack</SectionTitle>
          <div className="flex flex-wrap gap-4.5">
            <TechIcon label="PYTHON">
              <svg className="w-7 h-7 text-zinc-600 dark:text-zinc-400 fill-current" viewBox="0 0 24 24">
                <path d="M11.922 0c-.156.002-.312.015-.466.037L5.056 1.012c-.93.134-1.64.887-1.706 1.823v2.85h3.393V4.316a.434.434 0 0 1 .435-.435h6.786a.434.434 0 0 1 .435.435v2.302H9.288c-.99 0-1.79.802-1.79 1.792v2.816H4.351A2.164 2.164 0 0 0 2.19 13.38v5.526a2.162 2.162 0 0 0 2.16 2.163h2.302v-3.393h1.369a.435.435 0 0 1 .435.435v6.786c0 .6.49 1.091 1.09 1.091h3.1a2.16 2.16 0 0 0 2.163-2.16v-2.852h-3.393V19.67a.435.435 0 0 1 .435-.435h6.786a.435.435 0 0 1 .435.435v-2.302h5.111c.99 0 1.79-.802 1.79-1.792v-2.816h3.147a2.164 2.164 0 0 0 2.161-2.161V5.074A2.162 2.162 0 0 0 19.65 2.91h-2.302v3.393h-1.369a.434.434 0 0 1-.435-.435V.916A1.1 1.1 0 0 0 14.453 0h-2.531zm-2.84 2.13a.627.627 0 1 1 0 1.253.627.627 0 0 1 0-1.253zm5.498 18.423a.627.627 0 1 1 0 1.254.627.627 0 0 1 0-1.254z"/>
              </svg>
            </TechIcon>

            <TechIcon label="PYTORCH">
              <svg className="w-7 h-7 text-zinc-600 dark:text-zinc-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm3.89 17.5a1.86 1.86 0 0 1-1.36.56H9.47a1.88 1.88 0 0 1-1.37-.56 2.2 2.2 0 0 1-.53-1.53V9.45a2.22 2.22 0 0 1 .53-1.54 1.88 1.88 0 0 1 1.37-.56h4.51c.54 0 1 .19 1.36.56a2.24 2.24 0 0 1 .54 1.54V16a2.22 2.22 0 0 1-.53 1.5zm-1.12-6.57a1.05 1.05 0 0 0-.74-.28H9.97a1.05 1.05 0 0 0-.74.28 1.2 1.2 0 0 0-.29.87v1.54a1.2 1.2 0 0 0 .29.87 1.05 1.05 0 0 0 .74.28h4.01a1.05 1.05 0 0 0 .74-.28 1.2 1.2 0 0 0 .29-.87V11.8a1.2 1.2 0 0 0-.29-.87z"/>
              </svg>
            </TechIcon>

            <TechIcon label="TENSORFLOW">
              <svg className="w-7 h-7 text-zinc-600 dark:text-zinc-400 fill-current" viewBox="0 0 24 24">
                <path d="M12.4 0L3.1 5.4v10.8l9.3 5.4 9.3-5.4V5.4L12.4 0zm7.1 15.1l-7.1 4.1-7.1-4.1V7.1l7.1-4.1 7.1 4.1v8zm-3.6-6.6h-7v1.9h2.3V14h2.3v-3.6h2.4V8.5z"/>
              </svg>
            </TechIcon>

            {/* Robust Scikit-Learn SVG */}
            <TechIcon label="SCIKIT-LEARN">
              <svg className="w-7 h-7" viewBox="0 0 100 100">
                <path d="M25,50 A20,20 0 1,1 65,50 A20,20 0 1,1 25,50" fill="#F1AA3C" className="opacity-80 dark:opacity-70" />
                <path d="M45,50 A15,15 0 1,1 75,50 A15,15 0 1,1 45,50" fill="#3497CD" className="opacity-80 dark:opacity-70" />
                <path d="M35,35 A12,12 0 1,1 59,35 A12,12 0 1,1 35,35" fill="#5CB85C" className="opacity-80 dark:opacity-60" />
              </svg>
            </TechIcon>

            {/* Robust Hugging Face SVG */}
            <TechIcon label="HUGGING FACE">
              <svg className="w-7 h-7 text-zinc-600 dark:text-zinc-400 fill-current" viewBox="0 0 100 100">
                <path d="M50 15c-16.6 0-30 13.4-30 30 0 12.3 7.4 22.8 18 27.3V85h6V74.4c1.9.4 3.9.6 6 .6s4.1-.2 6-.6V85h6V72.3c10.6-4.5 18-15 18-27.3 0-16.6-13.4-30-30-30zm-10 26c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm20 0c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
              </svg>
            </TechIcon>
          </div>
        </BlurFade>

        {/* Featured Work with Interactive GitHub Year Toggle */}
        <BlurFade delay={0.4} inView>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
            <SectionTitle id="projects" shortcut="p">Projects</SectionTitle>
            
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-lg text-[12px] font-mono shadow-xs self-start sm:self-auto mb-4 sm:mb-0">
              {(["2026", "2025"] as const).map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    activeYear === year
                      ? "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold shadow-xs"
                      : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-4 -mt-2">Core architectures and ML tooling I've built or collaborated on.</p>
          
          <div className="mt-3 min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {githubProjects[activeYear].map((project) => (
                  <ProjectRow 
                    key={project.title}
                    title={project.title}
                    repo={project.repo}
                    url={project.url}
                    desc={project.desc}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Genuine Dynamic GitHub Grid Map Node block */}
          <div className="mt-8 border border-zinc-200 dark:border-zinc-900 rounded-xl bg-white dark:bg-zinc-900/10 p-4">
            <div className="flex gap-[2px] overflow-x-auto pb-1 scrollbar-none">
              {chunkWeeks(githubData).slice(0, 40).map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[2px] shrink-0">
                  {week.map((day, dIdx) => (
                    <div 
                      key={dIdx} 
                      className={`w-[9px] h-[9px] rounded-[1px] transition-colors ${
                        day.level === 3 ? "bg-green-600 dark:bg-green-400" :
                        day.level === 1 ? "bg-green-200 dark:bg-green-900/50" :
                        "bg-zinc-100 dark:bg-zinc-900"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-2 text-right">
              {totalContributions.toLocaleString()} contributions in {activeYear}
            </div>
          </div>
        </BlurFade>

        {/* experience */}
        <BlurFade delay={0.5} inView>
          <SectionTitle id="experience" shortcut="e">experience</SectionTitle>
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
          <SectionTitle id="reads" shortcut="r">recent reads</SectionTitle>
          <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mb-4 -mt-2">Research papers and insights I am currently exploring.</p>
          <div className="grid md:grid-cols-3 gap-2.5">
            {[
              { d: "Research", t: "Efficient Estimation of Word Representations in Vector Space", href: "#reads" },
              { d: "Research", t: "Attention Is All You Need: Fundamentals of Transformers", href: "#reads" },
              { d: "Research", t: "Outrageously Large Neural Networks: Sparsely-Gated MoE", href: "#reads" },
            ].map((w) => (
              <a key={w.t} href={w.href} className="border border-zinc-200 dark:border-zinc-900 rounded-xl p-3.5 bg-white/30 dark:bg-zinc-900/10 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 transition flex flex-col gap-2">
                <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5"><BookOpen className="w-3 h-3"/> {w.d}</div>
                <div className="text-[13.5px] leading-snug text-zinc-700 dark:text-zinc-300">{w.t}</div>
              </a>
            ))}
          </div>
        </BlurFade>

        {/* Contact Redesigned Layout */}
        <BlurFade delay={0.7} inView>
          <SectionTitle id="contact" shortcut="c">contact</SectionTitle>
          <div className="w-full border-t border-zinc-200 dark:border-zinc-900 mt-2">
            {[
              { I: Mail, label: "email", v: "dev@avhi.in", url: "mailto:syphaxtwt2025@gmail.com" },
              { I: Twitter, label: "x.com", v: "@syphax_twt", url: "https://x.com/syphax_twt" },
              { I: Github, label: "github", v: "rkcode2025", url: "https://github.com/rkcode2025" },
            ].map(({ I, label, v, url }) => (
              <a 
                key={label} 
                href={url} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center justify-between py-4 border-b border-zinc-200 dark:border-zinc-900 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 px-2 rounded-md transition-colors"
              >
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

        {/* footer */}
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

      {/* Universal Search Overlay Modals triggered by K / ⌘K */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl relative z-10 overflow-hidden font-mono"
            >
              <div className="flex items-center gap-3 px-4 border-b border-zinc-200 dark:border-zinc-800">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search architecture layers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 text-[13px] bg-transparent text-zinc-800 dark:text-zinc-100 outline-none border-none placeholder-zinc-400"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-400 rounded-md"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-[250px] overflow-y-auto p-1.5">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full text-left p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors cursor-pointer rounded-lg group"
                    >
                      <span className="text-[13px] text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">{item.name}</span>
                      <span className="text-[9px] text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 rounded-md uppercase">{item.cat}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-zinc-400 text-[11px]">No modules indexed.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
