import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
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

// Full-Viewport Circle Theme Overlay Hook
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

  return { dark, setDark };
}

interface SearchItem {
  id: string;
  title: string;
  type: string;
  desc?: string;
}

function Index() {
  const time = useClock();
  const { dark, setDark } = useTheme();
  const [activeYear, setActiveYear] = useState<"2026" | "2025" | "2024" | "2023" | "2022">("2026");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Theme ripple animation state
  const [ripple, setRipple] = useState<{ x: number; y: number; visible: boolean; targetDark: boolean } | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Search Index Data
  const searchItems: SearchItem[] = [
    { id: "hero", title: "Overview / Bio", type: "Section" },
    { id: "stack", title: "Skill / Tech Stack", type: "Section", desc: "Python, PyTorch, TensorFlow, Scikit-Learn, Hugging Face" },
    { id: "projects", title: "Projects", type: "Section", desc: "Wikitext-MoE-40M, AI-Authenticator, XTRAIN" },
    { id: "experience", title: "Experience", type: "Section", desc: "Mangalan Labs AI/ML Intern" },
    { id: "github-graph", title: "GitHub Activity Graph", type: "Section", desc: "Annual contribution block heatmaps" },
    { id: "reads", title: "Recent Reads", type: "Section", desc: "Transformers, Word Representations, MoE research papers" },
    { id: "contact", title: "Contact Information", type: "Section", desc: "Email, X.com, GitHub links" },
  ];

  // Global Keyboard Shortcuts for Sections & Search Modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search modal with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Ignore individual hotkeys if user is actively writing in input elements
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      const keyMap: Record<string, string> = {
        h: "hero",
        s: "stack",
        p: "projects",
        e: "experience",
        g: "github-graph",
        r: "reads",
        c: "contact",
      };

      const targetId = keyMap[e.key.toLowerCase()];
      if (targetId) {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleThemeToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const nextDark = !dark;

    setRipple({ x, y, visible: true, targetDark: nextDark });
    
    // Switch state midway through visual wave expansion
    setTimeout(() => {
      setDark(nextDark);
    }, 250);

    setTimeout(() => {
      setRipple(null);
    }, 600);
  };

  const filteredSearchItems = searchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const navigateToSection = (id: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Generate deterministic contribution arrays mimicking actual GitHub block arrays
  const getContributionGrid = (year: string) => {
    const seed = year.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const columns = 38; 
    const rows = 7;
    const items = [];
    
    for (let c = 0; c < columns; c++) {
      const colItems = [];
      for (let r = 0; r < rows; r++) {
        const val = (seed * (c + 1) * (r + 3)) % 100;
        let level = 0;
        if (val > 88) level = 4;
        else if (val > 72) level = 3;
        else if (val > 45) level = 2;
        else if (val > 20) level = 1;
        
        // Hide future months for current year 2026 (e.g. mock layout)
        const isFuture = year === "2026" && c > 18;
        colItems.push(isFuture ? -1 : level);
      }
      items.push(colItems);
    }
    return items;
  };

  const gridData = getContributionGrid(activeYear);

  return (
    <div className="min-h-screen pb-24 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 transition-colors duration-300 relative overflow-x-hidden selection:bg-zinc-200 dark:selection:bg-zinc-800">
      
      {/* Visual Canvas Theme Ripple Overlay Layer */}
      <AnimatePresence>
        {ripple?.visible && (
          <motion.div
            initial={{ 
              position: "fixed",
              left: ripple.x,
              top: ripple.y,
              translateX: "-50%",
              translateY: "-50%",
              width: 1,
              height: 1,
              borderRadius: "50%",
              zIndex: 50,
              pointerEvents: "none"
            }}
            animate={{
              scale: 3000,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className={ripple.targetDark ? "bg-zinc-950" : "bg-zinc-50"}
          />
        )}
      </AnimatePresence>

      {/* Global End-to-End Vertical Guidelines (Bounded to content layout edges) */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-2xl h-full pointer-events-none z-10 hidden sm:block">
        <div className="w-full h-full border-l border-r border-zinc-200/50 dark:border-zinc-900/40 relative">
          <div className="absolute top-0 -left-[4px] text-zinc-300 dark:text-zinc-800 font-mono text-[11px]">+</div>
          <div className="absolute top-0 -right-[4px] text-zinc-300 dark:text-zinc-800 font-mono text-[11px]">+</div>
        </div>
      </div>

      {/* Structural Top Accent Line Grid Container */}
      <div className="w-full border-b border-zinc-200 dark:border-zinc-900 relative z-20 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <header className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between font-mono text-[12px] text-zinc-400 dark:text-zinc-500 tracking-wider">
          <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
            <span>SYPHAX // LABS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span>{time || "00:00:00 GMT+05:30"}</span>
            </div>
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-none border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-500 dark:text-zinc-400 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5 text-[10px]">
                <kbd className="font-mono">⌘</kbd>
                <kbd className="font-mono">K</kbd>
              </div>
            </button>
          </div>
        </header>
        
        {/* Intersection Anchor Plus Indicators */}
        <div className="max-w-2xl mx-auto px-6 relative">
          <span className="absolute -bottom-[6px] left-0 text-zinc-400 dark:text-zinc-700 font-mono text-[11px] select-none z-30">+</span>
          <span className="absolute -bottom-[6px] right-0 text-zinc-400 dark:text-zinc-700 font-mono text-[11px] select-none z-30">+</span>
        </div>
      </div>

      {/* Main Structural Layout Content Column */}
      <main className="max-w-2xl mx-auto px-6 mt-12 relative z-20">
        
        {/* Hero Section Banner Panel (Flat edge structural line layout) */}
        <div id="hero" className="border-b border-zinc-200 dark:border-zinc-900 pb-10 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Clean Enlarged Square Profile Frame without status markers */}
              <div className="relative w-28 h-28 rounded-none overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs shrink-0">
                <img 
                  src="https://unavatar.io/twitter/syphax_twt" 
                  alt="Syphax Profile Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 grid place-items-center text-5xl font-serif font-medium text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-900">S</div>
              </div>

              <div>
                <h1 className="font-serif text-4xl font-medium tracking-tight text-zinc-800 dark:text-zinc-100">
                  Syphax
                </h1>
                <p className="mt-2 text-[13px] font-mono text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                  AI/ML Researcher & Developer
                </p>
              </div>
            </div>

            {/* Custom Interactive Theme Trigger Box */}
            <button
              ref={toggleRef}
              onClick={handleThemeToggleClick}
              aria-label="Toggle structural theme"
              className="w-10 h-10 rounded-none border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-xs cursor-pointer transition-colors relative z-30 shrink-0"
            >
              {dark ? <Sun className="w-4 h-4 text-zinc-400" /> : <Moon className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>

          <div className="space-y-4 mt-8 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-xl">
            <p>
              I am a developer and deep learning researcher focused on Natural Language Processing (NLP), Transformer architectures, and Mixture-of-Experts (MoE) core systems.
            </p>
            <p>
              Building custom frameworks from the math up, deploying localized CPU-optimized infrastructure solutions, and engineering low-latency interfaces.
            </p>
          </div>
          
          {/* Bottom Section Corner Markers */}
          <span className="absolute -bottom-[6px] left-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
          <span className="absolute -bottom-[6px] right-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
        </div>

        {/* Skill / Core Tech Stack Section */}
        <div id="stack" className="border-b border-zinc-200 dark:border-zinc-900 pb-10 relative">
          <div className="font-mono flex items-center gap-2 text-[16px] tracking-widest uppercase text-zinc-800 dark:text-zinc-200 font-semibold mt-12 mb-6">
            <span>[S] Skill // Stack</span>
          </div>
          
          <div className="flex flex-wrap gap-5">
            {[
              { name: "PYTHON", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
              { name: "PYTORCH", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg" },
              { name: "TENSORFLOW", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg" },
              { name: "SCIKIT-LEARN", img: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikit/scikit-original.svg" },
              { name: "HUGGINGFACE", img: "https://api.iconify.design/logos:huggingface.svg" }
            ].map((tech) => (
              <div key={tech.name} className="relative group flex flex-col items-center">
                {/* Tooltip on top matching Reference image behaviors */}
                <div className="absolute bottom-full mb-2 flex flex-col items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 transform translate-y-1 group-hover:translate-y-0 z-30">
                  <div className="bg-zinc-900 dark:bg-zinc-100 border border-zinc-800 dark:border-zinc-200 rounded-sm px-2.5 py-1 text-[10px] font-mono font-bold tracking-widest text-zinc-100 dark:text-zinc-900 shadow-md whitespace-nowrap">
                    {tech.name}
                  </div>
                  <div className="w-1.5 h-1.5 bg-zinc-900 dark:bg-zinc-100 rotate-45 -mt-1" />
                </div>
                
                {/* Actual colored icon frame */}
                <div className="w-14 h-14 rounded-none flex items-center justify-center border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 shadow-xs transition-all duration-200 group-hover:border-zinc-400 dark:group-hover:border-zinc-700 group-hover:bg-zinc-100/50 dark:group-hover:bg-zinc-900/80">
                  <img src={tech.img} alt={`${tech.name} Logo`} className="w-7 h-7 object-contain grayscale-20 group-hover:grayscale-0 transition-all duration-200" />
                </div>
              </div>
            ))}
          </div>
          <span className="absolute -bottom-[6px] left-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
          <span className="absolute -bottom-[6px] right-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
        </div>

        {/* Flat Projects Portfolio Stream (No Year Toggle Interferences) */}
        <div id="projects" className="border-b border-zinc-200 dark:border-zinc-900 pb-10 relative">
          <div className="font-mono flex items-center gap-2 text-[16px] tracking-widest uppercase text-zinc-800 dark:text-zinc-200 font-semibold mt-12 mb-4">
            <span>[P] Projects</span>
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-900">
            {[
              { title: "Wikitext-MoE-40M", repo: "rkcode2025/Wikitext-MoE-40M", url: "https://github.com/rkcode2025/Wikitext-MoE-40M", desc: "A 109M parameter transformer architecture optimized on wikitext topologies, achieving a benchmarked test perplexity score of 35.34." },
              { title: "AI-Authenticator (AiAuth)", repo: "rkcode2025/AiAuth", url: "https://huggingface.co/spaces", desc: "Synthetic media authentication platform engineered to spot deepfakes and algorithmic generation signatures, hosted live via Hugging Face Spaces." },
              { title: "XTRAIN", repo: "MangalanLabs/XTRAIN", url: "https://github.com/MangalanLabs/XTRAIN", desc: "A custom CPU-optimized training runtime architecture written entirely from basic mathematical matrix foundations, omitting third-party optimization dependencies." }
            ].map((p) => (
              <a key={p.title} href={p.url} target="_blank" rel="noreferrer" className="group flex flex-col gap-1 py-5 block hover:bg-zinc-100/40 dark:hover:bg-zinc-900/20 -mx-2 px-2 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">{p.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors" />
                </div>
                <span className="text-[11.5px] font-mono text-zinc-400 dark:text-zinc-500">{p.repo}</span>
                <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">{p.desc}</p>
              </a>
            ))}
          </div>
          <span className="absolute -bottom-[6px] left-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
          <span className="absolute -bottom-[6px] right-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
        </div>

        {/* Experience Section */}
        <div id="experience" className="border-b border-zinc-200 dark:border-zinc-900 pb-10 relative">
          <div className="font-mono flex items-center gap-2 text-[16px] tracking-widest uppercase text-zinc-800 dark:text-zinc-200 font-semibold mt-12 mb-4">
            <span>[E] Experience</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-2 md:gap-4 py-4">
            <span className="font-mono text-[12px] text-zinc-400 dark:text-zinc-500 pt-0.5">2025 — PRESENT</span>
            <div>
              <h3 className="text-[15px] text-zinc-800 dark:text-zinc-200 font-medium">
                AI/ML Architecture Researcher <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[13px]">@ Mangalan Labs</span>
              </h3>
              <p className="text-[13.5px] text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Co-developing small-scale high-efficiency deep learning pipelines, custom language model tokens matrices, and CPU training matrices.
              </p>
            </div>
          </div>
          <span className="absolute -bottom-[6px] left-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
          <span className="absolute -bottom-[6px] right-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
        </div>

        {/* Authentic GitHub Contribution Section matching image reference layout */}
        <div id="github-graph" className="border-b border-zinc-200 dark:border-zinc-900 pb-10 relative">
          <div className="font-mono flex items-center gap-2 text-[16px] tracking-widest uppercase text-zinc-800 dark:text-zinc-200 font-semibold mt-12 mb-2">
            <span>[G] Contribution Matrix</span>
          </div>

          <div className="mt-4 border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/20 p-5">
            {/* Headers mapping months */}
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-2 px-1">
              <span>jan</span><span>feb</span><span>mar</span><span>apr</span><span>may</span><span>jun</span>
              <span>jul</span><span>aug</span><span>sep</span><span>oct</span><span>nov</span><span>dec</span>
            </div>

            {/* Matrix Block Columns mapping */}
            <div className="flex justify-between gap-[2px] overflow-x-auto pb-2 scrollbar-none">
              {gridData.map((col, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-[2px] shrink-0">
                  {col.map((level, rIdx) => {
                    let bgClass = "bg-zinc-100 dark:bg-zinc-900"; // Empty block / future
                    if (level === 1) bgClass = "bg-green-200 dark:bg-green-950/60";
                    if (level === 2) bgClass = "bg-green-300 dark:bg-green-800/60";
                    if (level === 3) bgClass = "bg-green-500 dark:bg-green-600";
                    if (level === 4) bgClass = "bg-green-700 dark:bg-green-400";
                    if (level === -1) bgClass = "bg-zinc-100/40 dark:bg-zinc-900/20"; // unreached dates

                    return (
                      <div 
                        key={rIdx} 
                        className={`w-[11px] h-[11px] transition-colors duration-150 ${bgClass}`} 
                        title={`Activity weight factor: ${level >= 0 ? level : 0}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Total Metric Stats Footer row matching reference view */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[12px] font-mono text-zinc-400 dark:text-zinc-500 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900/60 gap-3">
              <span>1,481 contributions in the last year</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span>less</span>
                <div className="w-2.5 h-2.5 bg-zinc-100 dark:bg-zinc-900" />
                <div className="w-2.5 h-2.5 bg-green-200 dark:bg-green-950" />
                <div className="w-2.5 h-2.5 bg-green-300 dark:bg-green-800" />
                <div className="w-2.5 h-2.5 bg-green-500 dark:bg-green-600" />
                <div className="w-2.5 h-2.5 bg-green-700 dark:bg-green-400" />
                <span>more</span>
              </div>
            </div>
          </div>

          {/* GitHub Style Year Selector Buttons underneath heatmap matrix */}
          <div className="flex flex-wrap items-center gap-1.5 mt-5">
            {(["2026", "2025", "2024", "2023", "2022"] as const).map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-4 py-1.5 text-[12px] font-mono border transition-all cursor-pointer ${
                  activeYear === year
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 font-bold"
                    : "border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <span className="absolute -bottom-[6px] left-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
          <span className="absolute -bottom-[6px] right-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
        </div>

        {/* Recent Reads Section */}
        <div id="reads" className="border-b border-zinc-200 dark:border-zinc-900 pb-10 relative">
          <div className="font-mono flex items-center gap-2 text-[16px] tracking-widest uppercase text-zinc-800 dark:text-zinc-200 font-semibold mt-12 mb-4">
            <span>[R] Recent Reads</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { t: "Efficient Estimation of Word Representations in Vector Space", author: "Mikolov et al." },
              { t: "Attention Is All You Need", author: "Vaswani et al." },
              { t: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer", author: "Shazeer et al." }
            ].map((paper) => (
              <div key={paper.t} className="border border-zinc-200 dark:border-zinc-900 p-4 bg-white dark:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                <div className="flex items-start gap-2 text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono text-[11px]">
                  <BookOpen className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>RESEARCH LABS</span>
                </div>
                <h4 className="text-[13.5px] font-medium text-zinc-700 dark:text-zinc-300 leading-snug">{paper.t}</h4>
                <span className="block mt-2 text-[11px] font-mono text-zinc-400 dark:text-zinc-500">{paper.author}</span>
              </div>
            ))}
          </div>
          <span className="absolute -bottom-[6px] left-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
          <span className="absolute -bottom-[6px] right-0 text-zinc-300 dark:text-zinc-800 font-mono text-[11px] select-none">+</span>
        </div>

        {/* End-to-End Contact Channel Layout matching Reference Image 3 */}
        <div id="contact" className="pb-4">
          <div className="font-mono flex items-center gap-2 text-[16px] tracking-widest uppercase text-zinc-800 dark:text-zinc-200 font-semibold mt-12 mb-4">
            <span>[C] Contact</span>
          </div>
          
          <div className="w-full border-t border-zinc-200 dark:border-zinc-900 mt-2">
            {[
              { label: "email", val: "dev@avhi.in", link: "mailto:syphaxtwt2025@gmail.com" },
              { label: "x.com", val: "@syphax_twt", link: "https://x.com/syphax_twt" },
              { label: "github", val: "@rkcode2025", link: "https://github.com/rkcode2025" }
            ].map((chan) => (
              <a 
                key={chan.label} 
                href={chan.link} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center justify-between py-4 border-b border-zinc-200 dark:border-zinc-900 px-1 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/10 transition-colors"
              >
                <span className="text-[14px] text-zinc-700 dark:text-zinc-300 font-mono tracking-wide">{chan.label}</span>
                <div className="flex items-center gap-1.5 font-mono text-right">
                  <span className="text-[14px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors">{chan.val}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Minimal Footer view */}
        <footer className="mt-20 flex flex-col items-center gap-1 font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400">built with tanstack</a>
            <span>·</span>
            <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400">rss</a>
            <span>·</span>
            <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-400">sitemap</a>
          </div>
          <div className="mt-1">© 2026 SYPHAX</div>
        </footer>
      </main>

      {/* Active Command Search Dialog Modal View Layer */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop layer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.16 }}
              className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-xl relative z-10 overflow-hidden font-mono"
            >
              <div className="flex items-center gap-3 px-4 border-b border-zinc-200 dark:border-zinc-800">
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Type a section or keyword to jump..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 text-[14px] bg-transparent text-zinc-800 dark:text-zinc-100 outline-none border-none placeholder-zinc-400"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-400"
                >
                  ESC
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredSearchItems.length > 0 ? (
                  filteredSearchItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigateToSection(item.id)}
                      className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 flex flex-col gap-0.5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="text-zinc-800 dark:text-zinc-200 font-medium group-hover:text-zinc-950 dark:group-hover:text-zinc-100">{item.title}</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-1.5 uppercase tracking-wide">{item.type}</span>
                      </div>
                      {item.desc && (
                        <span className="text-[11.5px] text-zinc-400 dark:text-zinc-500 truncate">{item.desc}</span>
                      )}
                    </button>
                    ))
                ) : (
                  <div className="p-4 text-center text-zinc-400 text-[12px]">
                    No index matching content filters.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
