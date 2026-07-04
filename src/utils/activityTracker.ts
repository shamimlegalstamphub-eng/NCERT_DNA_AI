export interface ActivityLog {
  id: string;
  type: "scan" | "explain" | "save" | "revise" | "export" | "session";
  title: string;
  desc: string;
  timestamp: string;
}

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  params: Record<string, any>;
  timestamp: string;
}

export interface WeeklyInsights {
  mostStudiedChapter: string;
  weakChapter: string;
  progressPercentage: number;
  studyTimeMinutes: number;
}

export function logActivity(
  type: ActivityLog["type"],
  title: string,
  desc: string
) {
  try {
    const existing = localStorage.getItem("ncert_dna_activities") || "[]";
    let logs: ActivityLog[] = [];
    try {
      logs = JSON.parse(existing);
      if (!Array.isArray(logs)) logs = [];
    } catch (e) {
      logs = [];
    }
    
    const newLog: ActivityLog = {
      id: "act-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      type,
      title,
      desc,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Today"
    };

    const updated = [newLog, ...logs].slice(0, 15);
    localStorage.setItem("ncert_dna_activities", JSON.stringify(updated));
    
    // Also log analytics event automatically
    logAnalyticsEvent(type, { title, desc });
  } catch (err) {
    console.warn("Failed to write activity log", err);
  }
}

export function logAnalyticsEvent(eventName: string, params: Record<string, any> = {}) {
  try {
    const existing = localStorage.getItem("ncert_dna_analytics_events") || "[]";
    let events: AnalyticsEvent[] = [];
    try {
      events = JSON.parse(existing);
      if (!Array.isArray(events)) events = [];
    } catch (e) {
      events = [];
    }

    const newEvent: AnalyticsEvent = {
      id: "evt-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      eventName,
      params,
      timestamp: new Date().toISOString()
    };

    const updated = [newEvent, ...events].slice(0, 50);
    localStorage.setItem("ncert_dna_analytics_events", JSON.stringify(updated));
    
    // Dynamically adjust Weekly Insights when things happen
    recalculateWeeklyInsights();
  } catch (err) {
    console.warn("Failed to write analytics event", err);
  }
}

export function getActivities(): ActivityLog[] {
  try {
    const existing = localStorage.getItem("ncert_dna_activities");
    if (existing) {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {}
  
  // Return default seed data if none exists
  const seed: ActivityLog[] = [
    {
      id: "act-seed-1",
      type: "scan",
      title: "Scanned Tonoplast Membrane Notes",
      desc: "Matched with 99.1% confidence to Cell Chapter, Page 135.",
      timestamp: "10:15 AM Today"
    },
    {
      id: "act-seed-2",
      type: "explain",
      title: "Explained Exarch Xylem Structures",
      desc: "Inquired AI Explainer regarding periphery protoxylem biology.",
      timestamp: "Yesterday, 04:30 PM"
    },
    {
      id: "act-seed-3",
      type: "save",
      title: "Saved Mnemonic Study Note",
      desc: "Recorded Basal background transcription on lac operon.",
      timestamp: "2 days ago"
    }
  ];
  try {
    localStorage.setItem("ncert_dna_activities", JSON.stringify(seed));
  } catch (err) {}
  return seed;
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const existing = localStorage.getItem("ncert_dna_analytics_events");
    if (existing) {
      const parsed = JSON.parse(existing);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {}
  return [];
}

export function getWeeklyInsights(): WeeklyInsights {
  try {
    const existing = localStorage.getItem("ncert_dna_weekly_insights");
    if (existing) {
      const parsed = JSON.parse(existing);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch (err) {}
  
  // Standard initial seed
  const seed: WeeklyInsights = {
    mostStudiedChapter: "Cell: Unit of Life",
    weakChapter: "Morphology of Flowering Plants",
    progressPercentage: 68,
    studyTimeMinutes: 145
  };
  try {
    localStorage.setItem("ncert_dna_weekly_insights", JSON.stringify(seed));
  } catch (err) {}
  return seed;
}

export function recalculateWeeklyInsights() {
  try {
    const existingEvents = localStorage.getItem("ncert_dna_analytics_events") || "[]";
    let events: AnalyticsEvent[] = [];
    try {
      events = JSON.parse(existingEvents);
      if (!Array.isArray(events)) events = [];
    } catch (e) {
      events = [];
    }

    const existingInsights = localStorage.getItem("ncert_dna_weekly_insights");
    let insights: WeeklyInsights = { 
      mostStudiedChapter: "Cell: Unit of Life", 
      weakChapter: "Morphology of Flowering Plants", 
      progressPercentage: 68, 
      studyTimeMinutes: 145 
    };

    if (existingInsights) {
      try {
        const parsed = JSON.parse(existingInsights);
        if (parsed && typeof parsed === "object") {
          insights = parsed;
        }
      } catch (e) {}
    }

    // Count events to calibrate insights
    const scanCount = events.filter(e => e.eventName === "scan").length;
    const explainCount = events.filter(e => e.eventName === "explain").length;
    const saveCount = events.filter(e => e.eventName === "save").length;

    // Simulate real calculations based on events
    insights.progressPercentage = Math.min(68 + (scanCount * 2) + (saveCount * 3), 100);
    insights.studyTimeMinutes = 145 + (scanCount * 12) + (explainCount * 8) + (saveCount * 5);
    
    if (explainCount > 2) {
      insights.mostStudiedChapter = "Molecular Genetics Node";
    }
    if (scanCount > 3) {
      insights.weakChapter = "Anatomy of Flowering Plants";
    }

    localStorage.setItem("ncert_dna_weekly_insights", JSON.stringify(insights));
  } catch (err) {
    console.warn("Failed to recalculate weekly insights", err);
  }
}
