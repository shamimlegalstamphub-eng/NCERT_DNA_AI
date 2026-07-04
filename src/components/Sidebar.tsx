import { 
  Home, Search, Camera, Bookmark, Flame, Calendar, BarChart3, 
  User, Settings, LogOut, FileText, Sparkles, Database, X,
  GraduationCap, Cpu, HelpCircle, Zap, GitFork, Smartphone, Users, ShieldCheck, Brain, Compass
} from "lucide-react";
import { UserClearance } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserClearance;
  onLogout: () => void;
  bookmarksCount: number;
  notesCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onLogout, 
  bookmarksCount, 
  notesCount,
  isMobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  console.log("Rendering Sidebar component. MobileOpen:", isMobileOpen);

  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home, color: "text-primary" },
    { id: "studyos", label: "Smart Study OS", icon: Brain, color: "text-indigo-600" },
    { id: "mobile", label: "Mobile App Shell", icon: Smartphone, color: "text-slate-800" },
    { id: "billing", label: "Subscription Tiers", icon: Zap, color: "text-amber-500" },
    { id: "community", label: "Community Hub", icon: Users, color: "text-sky-500" },
    { id: "teacher", label: "Educator Desk", icon: FileText, color: "text-purple-500" },
    { id: "secgrowth", label: "Security & Growth", icon: ShieldCheck, color: "text-emerald-500" },
    { id: "finder", label: "NCERT Finder", icon: Search, color: "text-amber-500" },
    { id: "vision", label: "Vision Search", icon: Camera, color: "text-teal-500" },
    { id: "pyq", label: "Previous Questions", icon: GraduationCap, color: "text-indigo-500" },
    { id: "predictive", label: "Predictive Questions", icon: Cpu, color: "text-teal-600" },
    { id: "explain", label: "AI Explain", icon: Sparkles, color: "text-amber-500" },
    { id: "graph", label: "Line Graph Map", icon: GitFork, color: "text-rose-500" },
    { id: "notes", label: "Notes", icon: FileText, color: "text-purple-500", badge: notesCount },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark, color: "text-emerald-500", badge: bookmarksCount },
    { id: "recovery", label: "Recovery", icon: Flame, color: "text-orange-500" },
    { id: "revision", label: "Revision", icon: Calendar, color: "text-blue-500" },
    { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-indigo-500" },
    { id: "admin", label: "Admin Insights", icon: Database, color: "text-violet-600" },
    { id: "performance", label: "Speed & Reliability", icon: Zap, color: "text-emerald-500" },
    { id: "profile", label: "Profile", icon: User, color: "text-rose-500" },
    { id: "help", label: "Help & FAQs", icon: HelpCircle, color: "text-teal-600" },
    { id: "tour", label: "Interactive Tour", icon: Compass, color: "text-indigo-500" },
    { id: "settings", label: "Settings", icon: Settings, color: "text-slate-500" },
  ];

  const BrandHeader = ({ onClose }: { onClose?: () => void }) => (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
          D
        </div>
        <div>
          <h1 className="font-poppins font-semibold text-slate-900 tracking-tight text-sm leading-none">NCERT DNA AI</h1>
          <span className="text-[9px] text-primary font-bold tracking-wider uppercase mt-1 block">NEET OS Node</span>
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const NavList = ({ onSelect }: { onSelect?: () => void }) => (
    <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (onSelect) onSelect();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[12px] text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : item.color}`} />
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                isActive ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const UserBadge = () => (
    <div className="p-4 border-t border-slate-100 space-y-3.5 bg-slate-50/50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0">
          {user.email.substring(0, 2)}
        </div>
        <div className="truncate flex-1">
          <h4 className="text-xs font-poppins font-bold text-slate-900 truncate">{user.email.split("@")[0]}</h4>
          <span className={`text-[9px] font-bold uppercase tracking-wider block mt-0.5 ${
            user.clearanceLevel === "ELITE_CLEARANCE" 
              ? "text-amber-500" 
              : user.clearanceLevel === "STUDENT_PREVIEW" 
                ? "text-primary" 
                : "text-slate-400"
          }`}>
            {user.clearanceLevel.replace("_", " ")}
          </span>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full py-2.5 hover:bg-rose-50 hover:text-rose-600 border border-slate-200/60 hover:border-rose-200 text-slate-600 font-semibold rounded-[12px] text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
      >
        <LogOut className="w-3.5 h-3.5" /> Disconnect Node
      </button>

      <div className="pt-2.5 flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-100/40">
        <span>v2.4.0-Production</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Aligned
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-white border-r border-slate-100 flex-col h-screen sticky top-0 shrink-0">
        <BrandHeader />
        <NavList />
        <UserBadge />
      </aside>

      {/* 2. Mobile Backdrop Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* 3. Mobile Left Drawer Menu */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[340px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <BrandHeader onClose={onCloseMobile} />
        <NavList onSelect={onCloseMobile} />
        <UserBadge />
      </aside>
    </>
  );
}
