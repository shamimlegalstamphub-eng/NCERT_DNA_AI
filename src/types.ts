export type ClearanceLevel = "GUEST_PREVIEW" | "STUDENT_PREVIEW" | "ELITE_CLEARANCE";

export interface UserClearance {
  userId: string;
  email: string;
  clearanceLevel: ClearanceLevel;
  clearanceCode: string;
  handshakeToken: string;
  handshakeTimestamp: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface InteractiveForensics {
  importanceReasoning: string;
  historicalAppearances: string;
  commonExaminerTraps: string[];
  predictivePracticeQuestion: PracticeQuestion;
}

export interface NCERTLine {
  id: string;
  chapterId: string;
  chapterName: string;
  volume: "Vol. I" | "Vol. II";
  pageNumber: number;
  lineNumber: number;
  lineText: string;
  
  // Static high-yield analytics
  frequency: number; // e.g. 8 times in 10 years
  recallRisk: number; // e.g. 87% (decay state)
  expectedRankDelta: number; // e.g. +450 ranks
  predictedOccurrenceProb: number; // e.g. 91.5%
  
  // Mastery status (Green=Mastered, Orange=Weak, Red=Critical, Blue=Unknown)
  masteryStatus: "mastered" | "weak" | "critical" | "unknown";
  confidenceScore: number; // 0-100 log
  lastRecallTimestamp?: string;
  
  // Custom metadata
  forensics?: InteractiveForensics;
}

export interface AppStats {
  masteredCount: number;
  weakCount: number;
  criticalCount: number;
  totalCount: number;
  marksPotential: number; // targetable marks boost
  decayWarningCount: number; // high decay risk items
}

// ==========================================
// PHASE 2: BUSINESS & DATA LAYER PREPARATION
// ==========================================

export type MonetizationTier = "free" | "plus" | "pro";

export interface MonetizationFeatureFlags {
  tier: MonetizationTier;
  unlimitedScans: boolean;
  premiumPyqAccess: boolean;
  advancedAiExplainer: boolean;
  unlimitedCustomNotes: boolean;
  priorityLiveSupport: boolean;
}

export interface SyncUser {
  userId: string;
  email: string;
  classLevel: string;
  targetExam: string;
  dailyStudyHoursTarget: number;
  createdAt: string;
  updatedAt: string;
  tier: MonetizationTier;
  featureFlags: MonetizationFeatureFlags;
}

export interface SyncNote {
  noteId: string;
  userId: string;
  chapterId: string;
  noteText: string;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

export interface SyncBookmark {
  bookmarkId: string;
  userId: string;
  lineId: string;
  chapterId: string;
  bookmarkedAt: string;
  synced: boolean;
}

export interface SyncRevisionPlan {
  planId: string;
  userId: string;
  title: string;
  scheduledDate: string;
  chapterIds: string[];
  isCompleted: boolean;
  createdAt: string;
  synced: boolean;
}

export interface SyncScan {
  scanId: string;
  userId: string;
  capturedTextExcerpt: string;
  matchedLineId: string;
  confidenceScore: number;
  pageNumberMatched: number;
  scannedAt: string;
  synced: boolean;
}

