import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Plus, LogOut, Cpu, Database, Activity, RefreshCw, Bookmark, 
  FileText, Check, ChevronRight, X, AlertTriangle, Settings, 
  Sparkles, ShieldCheck, Heart, User, Award, Flame, Calendar, Menu,
  Search, BarChart3, Camera, Bell, GraduationCap, Target
} from "lucide-react";

import { NCERTLine, UserClearance, ClearanceLevel } from "./types";
import { INITIAL_NCERT_LINES, MASTER_CHAPTERS } from "./data";
import BootSequence from "./components/BootSequence";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import ErrorBoundary from "./components/ErrorBoundary";
import LineFinder from "./components/LineFinder";
import VisionIntelligence from "./components/VisionIntelligence";
import PreviousQuestionEngine from "./components/PreviousQuestionEngine";
import PredictiveQuestionEngine from "./components/PredictiveQuestionEngine";
import AIExplain from "./components/AIExplain";
import RecoveryProtocol from "./components/RecoveryProtocol";
import NotesManager from "./components/NotesManager";
import RevisionPlanner from "./components/RevisionPlanner";
import AnalyticsPanel from "./components/AnalyticsPanel";
import ProfilePanel from "./components/ProfilePanel";
import DNAMap from "./components/DNAMap";
import NCERTLineGraph from "./components/NCERTLineGraph";
import MobileSimulator from "./components/MobileSimulator";
import SubscriptionBilling from "./components/SubscriptionBilling";
import CommunityHub from "./components/CommunityHub";
import TeacherPortal from "./components/TeacherPortal";
import SmartStudyOS from "./components/SmartStudyOS";
import SecurityGrowthPanel from "./components/SecurityGrowthPanel";
import DailyRetentionHome from "./components/DailyRetentionHome";
import OnboardingModal from "./components/OnboardingModal";
import HelpCenter from "./components/HelpCenter";
import FeedbackModal from "./components/FeedbackModal";
import AdminPanel from "./components/AdminPanel";
import PerformanceCenter from "./components/PerformanceCenter";
import { api } from "./services/api";
import DataMigrationSync from "./components/DataMigrationSync";

export default function App() {
  console.log("Rendering core App content");

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case "home": return "Dashboard";
      case "studyos": return "Smart Study OS";
      case "mobile": return "Mobile App Shell";
      case "billing": return "Subscription Tiers";
      case "community": return "Community Hub";
      case "teacher": return "Educator Desk";
      case "secgrowth": return "Security & Growth";
      case "finder": return "NCERT Finder";
      case "vision": return "Vision Search";
      case "pyq": return "Previous Questions";
      case "predictive": return "Predictive Questions";
      case "explain": return "AI Explain";
      case "graph": return "NCERT Line Graph";
      case "notes": return "My Notes";
      case "bookmarks": return "Bookmarks";
      case "recovery": return "Recovery";
      case "revision": return "Revision";
      case "analytics": return "Analytics";
      case "admin": return "Admin Insights";
      case "performance": return "Speed & Reliability";
      case "profile": return "Profile";
      case "settings": return "Settings";
      default: return "NCERT DNA AI";
    }
  };
  
  // App-level state
  const [bootCompleted, setBootCompleted] = useState<boolean>(false);
  const [userClearance, setUserClearance] = useState<UserClearance | null>(null);
  
  // Core targeted lines state
  const [lines, setLines] = useState<NCERTLine[]>(INITIAL_NCERT_LINES);
  const [activeLineId, setActiveLineId] = useState<string>("morphology-01");
  
  // Bookmarks & notes state
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  
  // Dashboard Navigation state
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // React Router integration & Diagnostics (Step 1-11)
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [clickDiagnostics, setClickDiagnostics] = useState<Array<{ timestamp: string; from: string; to: string; latencyMs: number }>>([]);

  // Real student launch-ready states
  const [onboardingData, setOnboardingData] = useState<any>(() => {
    const saved = localStorage.getItem("ncert_dna_onboarding_v3");
    return saved ? JSON.parse(saved) : null;
  });
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showMigrationModal, setShowMigrationModal] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [studyLanguage, setStudyLanguage] = useState<string>(() => localStorage.getItem("ncert_dna_pref_lang") || "English");
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem("ncert_dna_pref_notif");
    return saved !== "false";
  });
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // --- STEP 5: TOAST NOTIFICATIONS SYSTEM ---
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: "info" | "success" | "warning" }>>([]);
  
  const triggerNotification = (title: string, message: string, type: "info" | "success" | "warning" = "info") => {
    const newId = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id: newId, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newId));
    }, 4000);
  };

  // --- STEP 4: STUDY TIMER ---
  const [studySeconds, setStudySeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [focusScore, setFocusScore] = useState<number>(94);
  const [streak, setStreak] = useState<number>(5);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // --- STEP 6: INTERACTIVE USER TOUR STEPS ---
  const [tourStep, setTourStep] = useState<number | null>(null);
  const tourSteps = [
    {
      title: "🧭 Welcome to NEET OS v1.2",
      content: "This interactive tour will calibrate your layout options. Click Next to master NCERT high-yield statements!"
    },
    {
      title: "🧭 Advanced Navigation Sidebar",
      content: "Toggle seamlessly between NCERT Finder, PYQ Question engines, Screenshot scanners, and real-time student charts."
    },
    {
      title: "⏱️ Automated Focus Monitor",
      content: "An integrated study clock tracks active prep seconds. If you step away, it automatically pauses to protect statistics!"
    },
    {
      title: "📸 High-Yield Vision OCR Scan",
      content: "Upload screenshots or textbook images to instantly transcribe and match relevant sentences to original syllabus coordinates."
    },
    {
      title: "📈 Real Diagnostics Analytics",
      content: "Visualize progress with recall heatmaps, chapter balance curves, active timelines, and cumulative mastery indicators."
    }
  ];

  // Study timer background tick
  useEffect(() => {
    let interval: any;
    if (isTimerActive && userClearance) {
      interval = setInterval(() => {
        setStudySeconds(prev => {
          const next = prev + 1;
          // Milestone alert every 5 minutes
          if (next % 300 === 0) {
            triggerNotification(
              "🎯 Focus Milestone",
              `Splendid work! You have spent another 5 minutes in high-yield deep study. Streak remains active!`,
              "success"
            );
          }
          // Periodically sync back up to local storage
          if (next % 5 === 0) {
            const currentStored = localStorage.getItem("ncert_dna_active_study_time");
            let parsed = { daily: 0, weekly: 120, monthly: 480 };
            if (currentStored) {
              try {
                parsed = JSON.parse(currentStored);
              } catch (e) {}
            }
            parsed.daily = (parsed.daily || 0) + 5;
            parsed.weekly = (parsed.weekly || 0) + 5;
            parsed.monthly = (parsed.monthly || 0) + 5;
            localStorage.setItem("ncert_dna_active_study_time", JSON.stringify(parsed));
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, userClearance]);

  // Inactivity tracking engine (1 min limits)
  useEffect(() => {
    if (!userClearance) return;
    
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (!isTimerActive) {
        setIsTimerActive(true);
        triggerNotification("⏱️ Study Timer Active", "Focus monitor has resumed tracking. Dive back into biology!", "info");
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);

    const checkInterval = setInterval(() => {
      if (Date.now() - lastActivity > 60000) { // 60 seconds inactivity threshold
        if (isTimerActive) {
          setIsTimerActive(false);
          triggerNotification("💤 Inactivity Pause", "Timer has paused automatically. Move your cursor to resume.", "warning");
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(checkInterval);
    };
  }, [lastActivity, isTimerActive, userClearance]);

  // Welcome triggers on load
  useEffect(() => {
    if (userClearance) {
      const welcomeTimer = setTimeout(() => {
        triggerNotification(
          "📚 High-Yield Ready",
          "Your exam target is active! Let's get reading to secure NEET marks.",
          "info"
        );
        
        // Auto start tour on very first login if they haven't seen it
        const seen = localStorage.getItem("ncert_dna_tour_seen");
        if (!seen) {
          setTourStep(0);
        }
      }, 3000);
      return () => clearTimeout(welcomeTimer);
    }
  }, [userClearance]);

  // Tab transition automated notifications (Step 5)
  useEffect(() => {
    if (userClearance && activeTab) {
      if (activeTab === "revision") {
        triggerNotification("🔥 Spaced Repetition Sweep", "Clear decay warnings in biology exceptions to lock in accuracy.", "success");
      } else if (activeTab === "pyq") {
        triggerNotification("🧬 PYQ Practice Engine Ready", "Solve actual questions mapped precisely to textbook lines.", "info");
      } else if (activeTab === "admin") {
        triggerNotification("🛡️ Admin Console Online", "Live diagnostics control center active.", "success");
      }
    }
  }, [activeTab, userClearance]);

  // Track session load analytic event
  useEffect(() => {
    // Log active user session
    const existingSessions = localStorage.getItem("ncert_dna_session_log");
    const count = parseInt(existingSessions || "0") + 1;
    localStorage.setItem("ncert_dna_session_log", count.toString());

    // Setup offline network event listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Show onboarding automatically if logged in and data is empty
  useEffect(() => {
    if (userClearance !== null && onboardingData === null) {
      setShowOnboardingModal(true);
    }
  }, [userClearance, onboardingData]);

  // Custom Line Creator forms
  const [showAddLine, setShowAddLine] = useState(false);
  const [customVolume, setCustomVolume] = useState<"Vol. I" | "Vol. II">("Vol. I");
  const [customChapterId, setCustomChapterId] = useState("ch-06");
  const [customPage, setCustomPage] = useState("");
  const [customLineNum, setCustomLineNum] = useState("");
  const [customText, setCustomText] = useState("");
  const [formError, setFormError] = useState("");

  // Hydrate local storage persistence and setup API client token
  useEffect(() => {
    const savedClearance = localStorage.getItem("ncert_dna_clearance");
    const savedLines = localStorage.getItem("ncert_dna_lines");
    const savedActiveLine = localStorage.getItem("ncert_dna_active_id");
    const savedBookmarks = localStorage.getItem("ncert_dna_bookmarks");
    const savedNotes = localStorage.getItem("ncert_dna_notes");

    if (savedClearance) {
      try {
        const parsed = JSON.parse(savedClearance);
        setUserClearance(parsed);
        if (parsed.handshakeToken) {
          api.setToken(parsed.handshakeToken);
          localStorage.setItem("ncert_dna_user_email", parsed.email);
        }
      } catch (e) {
        console.warn("Failed to parse saved clearance", e);
      }
    }

    if (savedLines) {
      try {
        setLines(JSON.parse(savedLines));
      } catch (e) {
        setLines(INITIAL_NCERT_LINES);
      }
    }

    if (savedActiveLine) {
      setActiveLineId(savedActiveLine);
    }

    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        setBookmarks([]);
      }
    }

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        setNotes({});
      }
    }

    // Direct transition past boot sequence for recurring sessions
    if (savedClearance) {
      setBootCompleted(true);
    }

    const savedActiveTab = localStorage.getItem("ncert_dna_active_tab");
    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }
  }, []);

  // Cloud sync system
  const syncDataWithCloud = async () => {
    if (!userClearance || userClearance.userId === "GUEST_USER") return;
    try {
      // 1. Fetch Bookmarks
      const bmResponse = await api.get("bookmarks");
      if (bmResponse.status === "SUCCESS" && Array.isArray(bmResponse.bookmarks)) {
        const activeIds = bmResponse.bookmarks.map((b: any) => b.lineId);
        setBookmarks(activeIds);
        localStorage.setItem("ncert_dna_bookmarks", JSON.stringify(activeIds));
      }

      // 2. Fetch Notes
      const notesResponse = await api.get("notes");
      if (notesResponse.status === "SUCCESS" && Array.isArray(notesResponse.notes)) {
        const notesMap: Record<string, string> = {};
        notesResponse.notes.forEach((n: any) => {
          if (n.lineId) {
            notesMap[n.lineId] = n.content;
          }
        });
        setNotes(notesMap);
        localStorage.setItem("ncert_dna_notes", JSON.stringify(notesMap));
      }

      // 3. Fetch Analytics
      const analyticsResponse = await api.get("analytics");
      if (analyticsResponse.status === "SUCCESS" && analyticsResponse.analytics) {
        const stats = analyticsResponse.analytics;
        if (stats.streakCount) {
          localStorage.setItem("ncert_dna_streak", stats.streakCount.toString());
        }
        if (stats.totalQuestions) {
          localStorage.setItem("ncert_dna_xp", (stats.totalQuestions * 100).toString());
        }
      }

      // 4. Fetch Tour
      const tourResponse = await api.get("tour");
      if (tourResponse.status === "SUCCESS" && tourResponse.tour) {
        if (tourResponse.tour.completed) {
          localStorage.setItem("ncert_dna_tour_seen", "true");
        }
      }
    } catch (e) {
      console.warn("Cloud synchronization offline or unreachable. Falling back to offline client cache.", e);
    }
  };

  // Trigger cloud sync upon authentication
  useEffect(() => {
    if (userClearance && userClearance.userId !== "GUEST_USER") {
      // Check if there is any legacy local data to migrate
      const bookmarksRaw = localStorage.getItem("ncert_dna_bookmarks") || "[]";
      const notesRaw = localStorage.getItem("ncert_dna_notes") || "{}";
      const onboardingRaw = localStorage.getItem("ncert_dna_onboarding_v3");

      let hasNotes = false;
      try {
        const parsedNotes = JSON.parse(notesRaw);
        hasNotes = Object.keys(parsedNotes).length > 0;
      } catch (e) {}
      const hasBookmarks = JSON.parse(bookmarksRaw).length > 0;

      if (hasNotes || hasBookmarks || onboardingRaw) {
        setShowMigrationModal(true);
      } else {
        syncDataWithCloud();
      }
    }
  }, [userClearance]);

  // Save activeTab to localStorage on transitions
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("ncert_dna_active_tab", activeTab);
    }
  }, [activeTab]);

  // --- STEP 1-11: SYNCHRONIZED REACT ROUTER FLOWS ---
  // 1. Sync Browser URL path name to activeTab state (Handles: browser refresh, back/forward keys, direct deep links)
  useEffect(() => {
    // We only process routing once the initial boot has finished and state is loaded
    if (!bootCompleted) return;

    const currentPath = location.pathname.substring(1); // e.g. "finder"
    console.log(`[Navigation Diagnostics] Path change detected in URL: /${currentPath}`);

    if (userClearance) {
      // Redirect from login/landing to dashboard when logged in
      if (currentPath === "" || currentPath === "login" || currentPath === "landing") {
        setActiveTab("home");
        navigate("/dashboard", { replace: true });
      } else if (currentPath === "logout") {
        handleLogout();
      } else if (currentPath === "tour") {
        setTourStep(0);
        setActiveTab("home");
        navigate("/dashboard", { replace: true });
      } else {
        const validTabs = [
          "home", "dashboard", "studyos", "mobile", "billing", "community", 
          "teacher", "secgrowth", "finder", "vision", "pyq", "predictive", 
          "explain", "graph", "notes", "bookmarks", "recovery", "revision", 
          "analytics", "admin", "performance", "profile", "settings", "help"
        ];
        
        const mappedTab = currentPath === "dashboard" ? "home" : currentPath;
        if (validTabs.includes(mappedTab)) {
          // Record diagnostic click metric
          const start = performance.now();
          setIsNavigating(true);
          setActiveTab(mappedTab);
          
          const end = performance.now();
          setClickDiagnostics(prev => [
            { timestamp: new Date().toLocaleTimeString(), from: activeTab, to: mappedTab, latencyMs: Math.round(end - start) },
            ...prev.slice(0, 19)
          ]);
          
          setTimeout(() => setIsNavigating(false), 200);
        } else {
          // Automatic route fallback for unknown pages
          console.warn(`[Navigation Diagnostics] Unknown route /${currentPath}, executing fallback redirect to /dashboard`);
          setActiveTab("home");
          navigate("/dashboard", { replace: true });
        }
      }
    } else {
      // Route Guarding: Force non-auth routes to / when logged out
      if (currentPath !== "" && currentPath !== "login" && currentPath !== "landing") {
        console.warn(`[Navigation Diagnostics] Unauthorized access attempt to /${currentPath} blocked. Redirecting to Landing.`);
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, userClearance, bootCompleted]);

  // 2. Sync activeTab state changes back to Browser URL path name (Handles: component and sidebar clicks)
  useEffect(() => {
    if (!bootCompleted) return;

    if (userClearance && activeTab) {
      const currentPath = location.pathname.substring(1);
      const targetPath = activeTab === "home" ? "dashboard" : activeTab;
      if (currentPath !== targetPath) {
        console.log(`[Navigation Diagnostics] State update triggered redirect: /${currentPath} -> /${targetPath}`);
        navigate("/" + targetPath);
      }
    }
  }, [activeTab, userClearance, bootCompleted]);

  // 3. Dynamic SEO, Metadata, Canonical, and JSON-LD Structured Data Injection
  useEffect(() => {
    const currentPath = location.pathname;
    const baseOrigin = window.location.origin || "https://ais-pre-zmrjpa5r6wmc2xforjzzs7-928988966339.asia-east1.run.app";
    const fullUrl = `${baseOrigin}${currentPath}`;

    let title = "NCERT DNA AI — High-Yield NEET OS";
    let description = "Unlock NCERT Biology master coordinates with NCERT DNA AI. A robust NEET preparation operating system featuring high-yield active-recall drills, screenshot OCR scanning, and personalized performance diagnostics.";
    let jsonLd: any = null;

    if (currentPath === "/" || currentPath === "" || currentPath === "/landing" || currentPath === "/login") {
      title = "NCERT DNA AI — High-Yield NEET OS & Active Recall Terminal";
      description = "Master high-yield NCERT Biology statements and NEET preparation with live active-recall drills, screenshot OCR search, and personalized student diagnostics.";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "NCERT DNA AI",
        "alternateName": "NEET OS",
        "url": baseOrigin,
        "description": description,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseOrigin}/dashboard?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
    } else if (currentPath.includes("dashboard")) {
      title = "Student Dashboard | NCERT DNA AI NEET OS";
      description = "Access your NEET high-yield Biology statement engine, active study clock, focus monitor, and interactive workspace components.";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "NCERT DNA AI Dashboard",
        "url": fullUrl,
        "description": description,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseOrigin },
            { "@type": "ListItem", "position": 2, "name": "Dashboard", "item": fullUrl }
          ]
        }
      };
    } else if (currentPath.includes("profile")) {
      title = "Student Profile & Calibration | NCERT DNA AI NEET OS";
      description = "Calibrate study preferences, security clearance levels, study language, and track NEET preparation stats and streak badges.";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "name": "Student Profile - NCERT DNA AI",
        "url": fullUrl,
        "description": description,
        "mainEntity": {
          "@type": "Person",
          "name": userClearance?.email || "NEET Student",
          "jobTitle": "Aspirant"
        }
      };
    } else if (currentPath.includes("notes")) {
      title = "My Active Recall Notes & Statements | NCERT DNA AI NEET OS";
      description = "Manage and study your saved NCERT biology high-yield master coordinates, custom lines, and study guidance logs.";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "My Study Notes",
        "url": fullUrl,
        "description": description
      };
    } else if (currentPath.includes("analytics")) {
      title = "Diagnostics & Performance Analytics | NCERT DNA AI NEET OS";
      description = "Analyze student prep diagnostic metrics, response latency logs, chapter mastery, and detailed streak histories.";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "NEET OS Diagnostics & Analytics",
        "url": fullUrl,
        "description": description
      };
    } else {
      // General fallbacks for other active tabs
      const segment = currentPath.replace("/", "");
      const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
      title = `${formattedSegment} | NCERT DNA AI NEET OS`;
      description = `Access the ${formattedSegment} utility on NCERT DNA AI — the ultimate High-Yield NEET Biology Operating System.`;
    }

    // 1. Update Title
    document.title = title;

    // Helper to create or update meta tag
    const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Update Primary Description and Keywords
    setMetaTag("name", "description", description);

    // 3. Update Open Graph Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", fullUrl);

    // 4. Update Twitter Tags
    setMetaTag("property", "twitter:title", title);
    setMetaTag("property", "twitter:description", description);
    setMetaTag("property", "twitter:url", fullUrl);

    // 5. Update Canonical Link
    let canonical = document.getElementById("canonical-link") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.id = "canonical-link";
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

    // 6. Update JSON-LD Script Block
    let jsonLdScript = document.getElementById("seo-json-ld") as HTMLScriptElement;
    if (jsonLdScript) {
      jsonLdScript.remove();
    }
    if (jsonLd) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = "seo-json-ld";
      jsonLdScript.type = "application/ld+json";
      jsonLdScript.innerHTML = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }
  }, [location.pathname, activeTab, userClearance]);

  // Save states to local storage on changes
  const saveLinesState = (updatedLines: NCERTLine[]) => {
    setLines(updatedLines);
    localStorage.setItem("ncert_dna_lines", JSON.stringify(updatedLines));
  };

  const handleSelectLine = (id: string) => {
    setActiveLineId(id);
    localStorage.setItem("ncert_dna_active_id", id);
  };

  const handleToggleBookmark = async (id: string) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem("ncert_dna_bookmarks", JSON.stringify(updated));

    // Async sync to Cloud
    if (userClearance && userClearance.userId !== "GUEST_USER") {
      try {
        const line = lines.find(l => l.id === id);
        await api.post("bookmarks", {
          lineId: id,
          text: line?.lineText || "General NCERT line",
          chapter: line?.chapterName || "General Chapter",
          matchedLine: line
        });
      } catch (err) {
        console.warn("Relying on offline cache. Bookmark sync queued:", err);
      }
    }
  };

  const handleSaveNote = async (id: string, text: string) => {
    const updated = { ...notes, [id]: text };
    setNotes(updated);
    localStorage.setItem("ncert_dna_notes", JSON.stringify(updated));

    // Async sync to Cloud
    if (userClearance && userClearance.userId !== "GUEST_USER") {
      try {
        const line = lines.find(l => l.id === id);
        await api.post("notes", {
          lineId: id,
          text: line?.lineText || "NCERT Text Line",
          content: text,
          chapter: line?.chapterName || "General Syllabus"
        });
      } catch (err) {
        console.warn("Relying on offline cache. Note save queued:", err);
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    const updated = { ...notes };
    delete updated[id];
    setNotes(updated);
    localStorage.setItem("ncert_dna_notes", JSON.stringify(updated));

    // Async sync to Cloud
    if (userClearance && userClearance.userId !== "GUEST_USER") {
      try {
        await api.delete(`notes/${id}`);
      } catch (err) {
        console.warn("Relying on offline cache. Note deletion queued:", err);
      }
    }
  };

  const handleLoginSuccess = (user: UserClearance) => {
    setUserClearance(user);
    localStorage.setItem("ncert_dna_clearance", JSON.stringify(user));
    if (user.handshakeToken) {
      api.setToken(user.handshakeToken);
      localStorage.setItem("ncert_dna_user_email", user.email);
    }
    setBootCompleted(true);
    setActiveTab("home");
  };

  const handleEnterGuestMode = () => {
    const guestUser: UserClearance = {
      userId: "GUEST_USER",
      email: "guest_preview@ncertdna.ai",
      clearanceLevel: "GUEST_PREVIEW",
      clearanceCode: "DNA-GUEST-00",
      handshakeToken: "PUBLIC_GUEST_BYPASS",
      handshakeTimestamp: new Date().toISOString()
    };
    handleLoginSuccess(guestUser);
  };

  const handleLogout = () => {
    setUserClearance(null);
    localStorage.removeItem("ncert_dna_clearance");
    api.clearAuth();
    setActiveTab("home");
    navigate("/");
  };

  const handleAddCustomLine = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!customPage || !customLineNum || !customText.trim()) {
      setFormError("All custom parameters must be populated.");
      return;
    }

    const matchedChapter = MASTER_CHAPTERS.find(ch => ch.id === customChapterId);
    const newId = `custom-line-${Date.now()}`;
    const newLine: NCERTLine = {
      id: newId,
      chapterId: customChapterId,
      chapterName: matchedChapter?.name || "General Anatomy",
      volume: customVolume,
      pageNumber: parseInt(customPage) || 1,
      lineNumber: parseInt(customLineNum) || 1,
      lineText: customText.trim(),
      frequency: 1,
      predictedOccurrenceProb: 45,
      recallRisk: 10,
      expectedRankDelta: 15,
      masteryStatus: "unknown",
      confidenceScore: 0,
      lastRecallTimestamp: ""
    };

    const updated = [...lines, newLine];
    saveLinesState(updated);
    setActiveLineId(newId);
    setShowAddLine(false);
    setCustomText("");
    setCustomPage("");
    setCustomLineNum("");
  };

  // Reset core lines to master database
  const handleResetMastery = () => {
    saveLinesState(INITIAL_NCERT_LINES);
    setActiveLineId("morphology-01");
  };

  // Student Data & Progress Exporters
  const handleExportBackup = () => {
    const backupData = {
      xp: localStorage.getItem("ncert_dna_xp") || "0",
      streak: localStorage.getItem("ncert_dna_streak") || "1",
      bookmarks: localStorage.getItem("ncert_dna_bookmarks") || "[]",
      notes: localStorage.getItem("ncert_dna_notes") || "{}",
      onboarding: localStorage.getItem("ncert_dna_onboarding_v3") || null,
      searchHistory: localStorage.getItem("ncert_dna_search_history_v2") || "[]",
      recentScans: localStorage.getItem("ncert_dna_recent_scans") || "[]",
      activityLog: localStorage.getItem("ncert_dna_activity_log") || "[]",
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NEET_OS_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportStudyReport = () => {
    const reportText = `================================================
NEET OS - BIOLOGY REVISION STUDY REPORT
Generated on: ${new Date().toLocaleString()}
================================================

STUDENT ACCOUNT PROFILE:
------------------------
Name: ${onboardingData?.name || "Biology Student"}
Class Level: ${onboardingData?.classLevel || "12th Standard"}
Target Exam: ${onboardingData?.exam || "NEET UG"}
Daily Study Target: ${onboardingData?.studyHours || "4"} hours

STUDY PERFORMANCE MATRIX:
-------------------------
Current Streak: ${localStorage.getItem("ncert_dna_streak") || "1"} days
Total Study XP: ${localStorage.getItem("ncert_dna_xp") || "0"} XP
Total Custom Notes Created: ${Object.keys(notes).length} mnemonics
Total Bookmarks Tracked: ${bookmarks.length} lines

SYSTEM RETENTION FORENSICS:
---------------------------
Active NCERT Genome Matrices Loaded: ${lines.length} high-yield coordinates
- Mastered Coordinates: ${lines.filter(l => l.masteryStatus === "mastered").length}
- Weak Coordinates: ${lines.filter(l => l.masteryStatus === "weak").length}
- Critical Coordinates: ${lines.filter(l => l.masteryStatus === "critical").length}
- Unexplored: ${lines.filter(l => l.masteryStatus === "unknown" || !l.masteryStatus).length}

================================================
* All telemetry coordinates comply with NEET medical alignments. Keep revised.
================================================`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(reportText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NEET_OS_Study_Report_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportProgressReport = () => {
    const reportText = `================================================
NEET OS - DIAGNOSTIC PROGRESS REPORT
================================================
Generated on: ${new Date().toLocaleString()}
Confidence Index Level: Excellent (89.1% avg)
Recommended Flashcard Focus: Botany Genetics & Anatomy Physiology.

COGNITIVE SPEEDS:
-----------------
Diagnostic API Response Latency: 120ms
Largest Contentful Paint (LCP): 0.82s
Cumulative Layout Shift (CLS): 0.01

STUDENT METRIC EXPORT COMPLETED SUCCESSFULLY.
================================================`;

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(reportText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NEET_OS_Progress_Report_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Boot animation routing
  if (!bootCompleted && userClearance === null) {
    return (
      <BootSequence 
        onComplete={() => setBootCompleted(true)} 
      />
    );
  }

  // Unauthorized Landing Page Routing
  if (userClearance === null) {
    return (
      <LandingPage 
        onLoginSuccess={handleLoginSuccess} 
        onEnterGuestMode={handleEnterGuestMode} 
      />
    );
  }

  // Maintenance Mode Intercept Page
  if (maintenanceMode) {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-5">
          <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono bg-amber-500/15 text-amber-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
              SYSTEM MAINTENANCE TRIGGERED
            </span>
            <h2 className="text-2xl font-poppins font-black uppercase tracking-tight">NEET OS is Calibrating</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              The core genomes databases and predictive MCQs matrices are undergoing scheduled calibration. Normal server operations will resume shortly.
            </p>
          </div>
          <button
            onClick={() => setMaintenanceMode(false)}
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer min-h-[44px]"
          >
            Bypass Maintenance Mode
          </button>
        </div>
      </div>
    );
  }

  const activeLine = lines.find(l => l.id === activeLineId) || lines[0];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col lg:flex-row text-[#111827] antialiased w-full overflow-x-hidden">
      {/* Dynamic dashboard Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={userClearance} 
        onLogout={handleLogout}
        bookmarksCount={bookmarks.length}
        notesCount={Object.keys(notes).length}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main viewport panels */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {isOffline && (
          <div className="bg-amber-500 text-white px-4 py-2.5 text-[10px] font-mono text-center font-bold flex items-center justify-center gap-2 shrink-0 animate-pulse z-40">
            <AlertTriangle className="w-4 h-4" />
            <span>STUDENT OFFLINE MODE ACTIVE • Local cached NCERT database remains 100% active. Changes sync when online.</span>
          </div>
        )}

        {/* Mobile Top Header */}
        <header className="lg:hidden h-16 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 flex items-center justify-between w-full shrink-0 pt-[env(safe-area-inset-top,0px)] relative">
          {/* Logo Left */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-xs">
              D
            </div>
            <span className="font-poppins font-bold text-slate-900 text-xs tracking-tight hidden xs:block">NCERT DNA</span>
          </div>

          {/* Page Title Center */}
          <div className="absolute left-1/2 -translate-x-1/2 font-poppins font-bold text-slate-900 text-xs uppercase tracking-wider text-center max-w-[130px] sm:max-w-[180px] truncate no-word-break">
            {getPageTitle(activeTab)}
          </div>

          {/* Icons Right */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setActiveTab("finder")}
              className={`p-1.5 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                activeTab === "finder" ? "text-primary bg-primary/10" : "text-slate-500 hover:text-primary hover:bg-slate-50"
              }`}
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setActiveTab("revision")}
              className={`p-1.5 rounded-xl transition-all relative min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                activeTab === "revision" ? "text-primary bg-primary/10" : "text-slate-500 hover:text-primary hover:bg-slate-50"
              }`}
              aria-label="Notifications"
            >
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
              <Bell className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`p-1.5 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                activeTab === "profile" ? "text-primary bg-primary/10" : "text-slate-500 hover:text-primary hover:bg-slate-50"
              }`}
              aria-label="Profile"
            >
              <User className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Responsive Content Container */}
        <main className="flex-1 p-4 md:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] lg:pb-6 flex flex-col min-w-0 w-full lg:h-screen lg:overflow-hidden overflow-y-visible">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 shrink-0 gap-4 w-full">
            <div className="w-full sm:w-auto">
              <h1 className="font-poppins font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight no-word-break">
                NCERT Intelligence Operating System
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-full no-word-break">
                Analyzing core genetics statements & candidate revision calibration indicators.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
              {/* Active Study Timer Widget (Step 4) */}
              {userClearance && (
                <div id="study-timer-widget" className="flex items-center gap-3 bg-slate-900 text-white p-2 md:p-3.5 rounded-[15px] border border-slate-800 shadow-sm font-mono text-[10px] md:text-[11px] shrink-0 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isTimerActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-ping"}`}></span>
                    <span className="font-bold uppercase text-slate-400">Timer:</span>
                    <strong className="text-white">
                      {Math.floor(studySeconds / 60).toString().padStart(2, "0")}:
                      {(studySeconds % 60).toString().padStart(2, "0")}
                    </strong>
                  </div>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-slate-400 font-bold">{streak}d Streak</span>
                  </div>
                  <span className="text-slate-700">|</span>
                  <div className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-slate-400 font-bold">Focus: {focusScore}%</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowAddLine(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-[15px] text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Plus className="w-4 h-4" /> Add Custom NCERT Line
              </button>
            </div>
          </header>

          {/* Content Tabs Wrapper */}
          <div className="flex-1 min-h-[500px] lg:min-h-0 bg-white border border-slate-100 rounded-xl md:rounded-[20px] p-4 md:p-6 shadow-sm overflow-y-auto lg:overflow-hidden flex flex-col relative">
            {isNavigating && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-600 animate-pulse z-50 rounded-t-xl" />
            )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="h-full min-h-0"
            >
              <ErrorBoundary>
                {/* Tab 1: Dashboard Home Workspace */}
                {activeTab === "home" && (
                <DailyRetentionHome 
                  lines={lines} 
                  activeLineId={activeLineId} 
                  onLineSelected={handleSelectLine} 
                  bookmarks={bookmarks} 
                  notes={notes} 
                  setActiveTab={setActiveTab} 
                  saveLinesState={saveLinesState}
                  onboardingData={onboardingData}
                />
              )}

              {/* Tab 2: Interactive Finder */}
              {activeTab === "finder" && (
                <LineFinder 
                  lines={lines} 
                  activeLineId={activeLineId} 
                  onLineSelected={handleSelectLine} 
                  bookmarks={bookmarks} 
                  toggleBookmark={handleToggleBookmark} 
                  notes={notes} 
                  saveNote={handleSaveNote} 
                  onTriggerAIExplain={() => setActiveTab("recovery")} 
                  onTriggerPYQEngine={() => setActiveTab("recovery")} 
                  onTriggerPredictiveEngine={() => setActiveTab("recovery")}
                />
              )}

              {/* Tab 3: Vision Intelligence */}
              {activeTab === "vision" && (
                <VisionIntelligence 
                  onLineSelected={handleSelectLine} 
                  setActiveTab={setActiveTab} 
                />
              )}

              {/* Tab 4: Bookmarks Manager */}
              {activeTab === "bookmarks" && (
                <div className="space-y-4 h-full overflow-y-auto pr-1">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-sm font-poppins font-bold text-slate-900 tracking-tight">My Bookmarked High-Yield Lines</h2>
                    <span className="text-[10px] text-slate-400 font-mono">COUNT: {bookmarks.length} BOOKMARKS</span>
                  </div>

                  {bookmarks.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-[20px] flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                        <Bookmark className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xs font-poppins font-bold text-slate-800 uppercase">No Bookmark Targets Saved Yet</h3>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                          Save textbook statements, predicted questions, or vital genome entries to your bookmarks shelf to build an accessible study hub.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("finder")}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-[12px] hover:bg-primary/95 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                      >
                        Explore NCERT Statements
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lines.filter(l => bookmarks.includes(l.id)).map(line => (
                        <div key={line.id} className="p-4 bg-slate-50 border border-slate-100 rounded-[15px] flex justify-between gap-4 items-start hover:border-slate-200 transition-all">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-full uppercase">{line.chapterName}</span>
                              <span className="text-[9px] font-semibold text-slate-400">Page {line.pageNumber} • Line {line.lineNumber}</span>
                            </div>
                            <p className="text-xs text-slate-800 leading-relaxed font-semibold">"{line.lineText}"</p>
                          </div>
                          <button
                            onClick={() => handleToggleBookmark(line.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Notes Manager */}
              {activeTab === "notes" && (
                <NotesManager 
                  notes={notes} 
                  saveNote={handleSaveNote} 
                  deleteNote={handleDeleteNote} 
                />
              )}

              {/* Tab 6: Cognitive Recovery Protocol */}
              {activeTab === "recovery" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <RecoveryProtocol lines={lines} onLineSelected={handleSelectLine} onLineUpdated={(updated) => {
                    const idx = lines.findIndex(l => l.id === updated.id);
                    if (idx !== -1) {
                      const copy = [...lines];
                      copy[idx] = updated;
                      saveLinesState(copy);
                    }
                  }} />
                </div>
              )}

              {/* Tab 11: Previous Year Questions */}
              {activeTab === "pyq" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <PreviousQuestionEngine activeLine={activeLine} onLineSelected={handleSelectLine} />
                </div>
              )}

              {/* Tab 12: Predictive Questions */}
              {activeTab === "predictive" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <PredictiveQuestionEngine activeLine={activeLine} />
                </div>
              )}

              {/* Tab 13: AI Explain */}
              {activeTab === "explain" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <AIExplain activeLine={activeLine} />
                </div>
              )}

              {/* Tab: NCERT Line Graph Map */}
              {activeTab === "graph" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <NCERTLineGraph lines={lines} onLineSelected={handleSelectLine} setActiveTab={setActiveTab} />
                </div>
              )}

              {/* New Platform Ecosystem Tabs (Step 1-10) */}
              {activeTab === "studyos" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <SmartStudyOS />
                </div>
              )}

              {activeTab === "mobile" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <MobileSimulator />
                </div>
              )}

              {activeTab === "billing" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <SubscriptionBilling />
                </div>
              )}

              {activeTab === "community" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <CommunityHub />
                </div>
              )}

              {activeTab === "teacher" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <TeacherPortal />
                </div>
              )}

              {activeTab === "secgrowth" && (
                <div className="h-full min-h-0 overflow-y-auto">
                  <SecurityGrowthPanel />
                </div>
              )}

              {/* Tab 7: Smart Revision Planner */}
              {activeTab === "revision" && (
                <RevisionPlanner 
                  lines={lines} 
                  onLineSelected={handleSelectLine} 
                  setActiveTab={setActiveTab} 
                />
              )}

              {/* Tab 8: Analytics */}
              {activeTab === "analytics" && (
                <AnalyticsPanel lines={lines} />
              )}

              {/* Tab: Admin Insights */}
              {activeTab === "admin" && (
                <AdminPanel onboardingData={onboardingData} />
              )}

              {/* Tab: Speed & Reliability */}
              {activeTab === "performance" && (
                <PerformanceCenter isOffline={isOffline} />
              )}

              {/* Tab 9: Profile */}
              {activeTab === "profile" && (
                <ProfilePanel 
                  user={userClearance!} 
                  lines={lines} 
                  onUpdateUser={(updated) => {
                    setUserClearance(updated);
                    localStorage.setItem("ncert_dna_clearance", JSON.stringify(updated));
                    triggerNotification("👤 Profile Updated", "Your study goals and targets have been successfully saved.", "success");
                  }} 
                  onLogout={handleLogout}
                  onStartTour={() => {
                    setTourStep(0);
                    setActiveTab("home");
                  }}
                />
              )}              {/* Tab 14: Help Center */}
              {activeTab === "help" && (
                <HelpCenter />
              )}

              {/* Tab 10: Settings */}
              {activeTab === "settings" && (
                <div className="space-y-6 h-full overflow-y-auto pr-1 text-slate-600 text-xs">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-poppins font-bold text-slate-900 text-sm uppercase">System Configurations & Preferences</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Calibrate connection coordinates, reset memory nodes or toggle study preferences.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preferences & Personalization */}
                    <div className="p-5 border border-slate-100 rounded-[20px] space-y-4 bg-slate-50/50">
                      <h4 className="font-poppins font-bold text-slate-900 uppercase text-[10.5px] tracking-wide">Study Preference Configurations</h4>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Preferred Study Language</label>
                          <select
                            value={studyLanguage}
                            onChange={(e) => {
                              setStudyLanguage(e.target.value);
                              localStorage.setItem("ncert_dna_pref_lang", e.target.value);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer text-slate-700"
                          >
                            <option value="English">English (Standard NEET Terminology)</option>
                            <option value="Hindi">Hindi (NCERT Core Translation)</option>
                            <option value="Tamil">Tamil (State NEET Alignments)</option>
                          </select>
                        </div>

                        <div className="space-y-2 pt-1.5">
                          <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={notificationsEnabled} 
                              onChange={(e) => {
                                setNotificationsEnabled(e.target.checked);
                                localStorage.setItem("ncert_dna_pref_notif", e.target.checked ? "true" : "false");
                              }}
                              className="rounded accent-primary w-4 h-4 cursor-pointer" 
                            />
                            <span>Push Spaced Repetition reminders to student email</span>
                          </label>
                          <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded accent-primary w-4 h-4 cursor-pointer" />
                            <span>Enable live background OCR alignment assistance</span>
                          </label>
                          <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                            <input type="checkbox" className="rounded accent-primary w-4 h-4 cursor-pointer" />
                            <span>Strict competitive NEET timers on mock generators</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* UI Styles & Release Safety */}
                    <div className="p-5 border border-slate-100 rounded-[20px] space-y-4 bg-slate-50/50">
                      <h4 className="font-poppins font-bold text-slate-900 uppercase text-[10.5px] tracking-wide">Theme & Release Safety</h4>
                      
                      <div className="space-y-3.5 text-[11px]">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-800 block">Workspace Theme Mode</span>
                            <span className="text-[10px] text-slate-400">Toggle light / dark cosmetic frames.</span>
                          </div>
                          <button
                            onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-lg text-[10px] uppercase transition-colors shrink-0"
                          >
                            {themeMode.toUpperCase()} MODE
                          </button>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100/80 pt-3">
                          <div>
                            <span className="font-bold text-slate-800 block">Simulate Maintenance Mode</span>
                            <span className="text-[10px] text-slate-400">Temporarily freeze and calibrate database arrays.</span>
                          </div>
                          <button
                            onClick={() => setMaintenanceMode(true)}
                            className="px-3 py-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-[10px] uppercase transition-colors shrink-0"
                          >
                            TRIGGER
                          </button>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-100/80 pt-3">
                          <div>
                            <span className="font-bold text-slate-800 block">Submit Feedback & Bugs</span>
                            <span className="text-[10px] text-slate-400">Report errors, suggest features, rate us.</span>
                          </div>
                          <button
                            onClick={() => setShowFeedbackModal(true)}
                            className="px-3 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary font-bold rounded-lg text-[10px] uppercase transition-colors shrink-0"
                          >
                            OPEN COMMAND
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Exporters and Backup Data Portability */}
                    <div className="p-5 border border-slate-100 rounded-[20px] space-y-4 bg-slate-50/50">
                      <h4 className="font-poppins font-bold text-slate-900 uppercase text-[10.5px] tracking-wide">Data Portability & Exporters</h4>
                      <p className="text-slate-500 leading-relaxed text-[11px] font-medium">
                        Export study schedules, custom notes, bookmarks, and diagnostic scorecards as digital backups or progress summaries.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          onClick={handleExportBackup}
                          className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-[10px] uppercase transition-colors text-center font-mono cursor-pointer min-h-[44px] flex flex-col justify-center items-center"
                        >
                          <span className="block">EXPORT BACKUP</span>
                          <span className="text-[8px] text-slate-400 font-normal mt-0.5">JSON Payload</span>
                        </button>
                        <button
                          onClick={handleExportStudyReport}
                          className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-[10px] uppercase transition-colors text-center font-mono cursor-pointer min-h-[44px] flex flex-col justify-center items-center"
                        >
                          <span className="block">STUDY REPORT</span>
                          <span className="text-[8px] text-slate-400 font-normal mt-0.5">Formatted TXT</span>
                        </button>
                        <button
                          onClick={handleExportProgressReport}
                          className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-[10px] uppercase transition-colors text-center font-mono cursor-pointer min-h-[44px] flex flex-col justify-center items-center"
                        >
                          <span className="block">PROGRESS CARD</span>
                          <span className="text-[8px] text-slate-400 font-normal mt-0.5">Diagnostic Sheet</span>
                        </button>
                      </div>
                    </div>

                    {/* Mastery resetting panel */}
                    <div className="p-5 border border-slate-100 rounded-[20px] space-y-3 bg-slate-50/50">
                      <h4 className="font-poppins font-bold text-slate-900 uppercase text-[10.5px] tracking-wide">Reload Genome Matrices</h4>
                      <p className="text-slate-500 leading-relaxed text-[11px] font-medium">
                        Wipes customized mastery levels, activity logs, saved study bookmarks, notes, and restores the pristine standard high-yield NCERT Biology core dataset.
                      </p>
                      <button
                        onClick={handleResetMastery}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer uppercase font-mono tracking-wider"
                      >
                        Reset Core Dataset
                      </button>
                    </div>

                    {/* Hard Student Data Reset */}
                    <div className="p-5 border border-slate-100 rounded-[20px] space-y-3 bg-slate-50/50">
                      <h4 className="font-poppins font-bold text-slate-900 uppercase text-[10.5px] tracking-wide">Hard Student Profile Reset</h4>
                      <p className="text-slate-500 leading-relaxed text-[11px] font-medium">
                        This resets your onboarding parameters, study hours targets, class levels, email configurations, and deletes cached local preferences entirely.
                      </p>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to reset all onboarding parameters and student profiles? This is irreversible.")) {
                            localStorage.removeItem("ncert_dna_onboarding_v3");
                            localStorage.removeItem("ncert_dna_search_history_v2");
                            localStorage.removeItem("ncert_dna_recent_scans");
                            localStorage.removeItem("ncert_dna_feedbacks");
                            setOnboardingData(null);
                            setShowOnboardingModal(true);
                          }
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer uppercase font-mono tracking-wider"
                      >
                        Wipe Profile & Onboardings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      </div>

      {/* Floating menu button on mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-20 left-4 w-12 h-12 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-lg z-40 cursor-pointer"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sticky Bottom Navigation (mobile only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 flex items-center justify-between z-40 shadow-md">
        {[
          { id: "home", label: "Home", icon: Award },
          { id: "finder", label: "Finder", icon: Search },
          { id: "vision", label: "Scan", icon: Camera },
          { id: "notes", label: "Notes", icon: FileText },
          { id: "profile", label: "Profile", icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 cursor-pointer transition-colors ${
                isActive ? "text-primary font-bold" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* POPUP MODAL: ADD CUSTOM HIGH-YIELD NCERT STATEMENT */}
      <AnimatePresence>
        {showAddLine && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setShowAddLine(false)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-[20px] p-6 w-full max-w-md border border-slate-100 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-poppins font-bold text-slate-900">Add Custom NCERT Statement</h3>
                <p className="text-xs text-slate-400 mt-1">Populate customized textbook sentences to map predictive mock questions</p>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-[12px] text-xs text-rose-600 mb-4 font-medium">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddCustomLine} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold">NCERT Volume</label>
                    <select
                      value={customVolume}
                      onChange={(e) => setCustomVolume(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer text-slate-700"
                    >
                      <option value="Vol. I">Biology Vol I</option>
                      <option value="Vol. II">Biology Vol II</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Chapter Target</label>
                    <select
                      value={customChapterId}
                      onChange={(e) => setCustomChapterId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer text-slate-700"
                    >
                      {MASTER_CHAPTERS.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.id.replace("ch-", "Ch ")}: {ch.name.substring(0, 15)}...</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Page Number</label>
                    <input
                      type="number"
                      value={customPage}
                      onChange={(e) => setCustomPage(e.target.value)}
                      placeholder="135"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/25 text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold">Line Coordinate</label>
                    <input
                      type="number"
                      value={customLineNum}
                      onChange={(e) => setCustomLineNum(e.target.value)}
                      placeholder="4"
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/25 text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Exact Textbook Sentence</label>
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter the exact literal wording of the NCERT line..."
                    required
                    className="w-full h-20 px-4 py-3 bg-slate-50 border border-slate-200 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder-slate-400 text-slate-700"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLine(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-[12px] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-[12px] hover:bg-primary/95 transition-all shadow-xs cursor-pointer"
                  >
                    Insert Sentence
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Flow Modal Overlay */}
      <OnboardingModal 
        isOpen={showOnboardingModal} 
        onComplete={(data) => {
          setOnboardingData(data);
          localStorage.setItem("ncert_dna_onboarding_v3", JSON.stringify(data));
          setShowOnboardingModal(false);
        }} 
      />

      {/* Legacy Data Migration Overlays */}
      {showMigrationModal && userClearance && (
        <DataMigrationSync 
          userId={userClearance.userId} 
          onMigrationComplete={() => {
            setShowMigrationModal(false);
            syncDataWithCloud();
          }} 
        />
      )}

      {/* Feedback Flow Modal Overlay */}
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />

      {/* Dynamic Toast Notifications (Step 5) */}
      <div className="fixed bottom-6 right-6 z-55 flex flex-col gap-2 max-w-xs md:max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`p-4 rounded-[16px] border shadow-lg pointer-events-auto flex items-start gap-3 bg-white text-slate-800 ${
                toast.type === "success" ? "border-emerald-100 bg-emerald-50/10 text-emerald-900" :
                toast.type === "warning" ? "border-amber-100 bg-amber-50/10 text-amber-900" :
                "border-slate-100 bg-white"
              }`}
            >
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-poppins font-bold uppercase tracking-wide leading-none">{toast.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Interactive User Tour Overlay (Step 6) */}
      <AnimatePresence>
        {tourStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/25 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-900 text-white rounded-[20px] border border-slate-800 shadow-2xl p-6 max-w-md w-full relative"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">NEET OS COGNITIVE TOUR</span>
              </div>

              <h3 className="text-sm font-poppins font-bold uppercase tracking-tight">{tourSteps[tourStep].title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 font-medium">
                {tourSteps[tourStep].content}
              </p>

              <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    localStorage.setItem("ncert_dna_tour_seen", "true");
                    setTourStep(null);
                  }}
                  className="text-[10px] font-bold font-mono text-slate-400 hover:text-white uppercase transition-colors"
                >
                  Skip Tour
                </button>

                <div className="flex gap-2">
                  {tourStep > 0 && (
                    <button
                      onClick={() => setTourStep(prev => prev! - 1)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg transition-colors font-mono uppercase"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (tourStep < tourSteps.length - 1) {
                        setTourStep(prev => prev! + 1);
                      } else {
                        localStorage.setItem("ncert_dna_tour_seen", "true");
                        setTourStep(null);
                        triggerNotification("🎉 Tour Completed", "Congratulations! You are now fully calibrated for NEET biology mastery.", "success");
                      }
                    }}
                    className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg transition-colors font-mono uppercase shadow-md shadow-primary/20"
                  >
                    {tourStep === tourSteps.length - 1 ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
