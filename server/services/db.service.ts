import { getDatabaseStatus } from "../config/db";
import { 
  User, Session, Bookmark, Note, NCERTLine, 
  VisionUpload, QuestionHistory, PredictedQuestion, 
  Analytics, RevisionPlan, TourProgress 
} from "../models/schemas";
import { FallbackDB } from "./dbFallback";

export class DatabaseService {
  private static isConnected(): boolean {
    return getDatabaseStatus().connected;
  }

  // --- 1. USER AUTH & PROFILE ---
  static async findOrCreateUser(email: string, name?: string) {
    const emailLower = email.toLowerCase();
    
    // Determine clearance details
    let clearanceLevel = "GUEST_PREVIEW";
    let clearanceCode = "DNA-LVL-01";
    if (emailLower.includes("elite") || emailLower.endsWith(".gov") || emailLower.length > 15) {
      clearanceLevel = "ELITE_CLEARANCE";
      clearanceCode = "DNA-LVL-99_SYS_OP";
    } else if (emailLower.includes("student") || emailLower.includes("@")) {
      clearanceLevel = "STUDENT_PREVIEW";
      clearanceCode = "DNA-LVL-05";
    }

    if (this.isConnected()) {
      try {
        let user = await User.findOne({ email: emailLower });
        if (!user) {
          user = await User.create({ 
            email: emailLower, 
            name: name || emailLower.split("@")[0],
            clearanceLevel,
            clearanceCode
          });
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          clearanceLevel: user.clearanceLevel,
          clearanceCode: user.clearanceCode,
          createdAt: user.createdAt
        };
      } catch (e) {
        console.error("Mongoose User error, falling back", e);
      }
    }

    // FallbackDB
    let fbUser = FallbackDB.findOne("users", u => u.email === emailLower);
    if (!fbUser) {
      fbUser = FallbackDB.save("users", {
        email: emailLower,
        name: name || emailLower.split("@")[0],
        clearanceLevel,
        clearanceCode
      });
    }
    return {
      id: fbUser.id,
      email: fbUser.email,
      name: fbUser.name,
      clearanceLevel: fbUser.clearanceLevel,
      clearanceCode: fbUser.clearanceCode,
      createdAt: fbUser.createdAt
    };
  }

  static async getUserProfile(userId: string) {
    if (this.isConnected()) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            clearanceLevel: user.clearanceLevel,
            clearanceCode: user.clearanceCode,
            createdAt: user.createdAt
          };
        }
      } catch (e) {
        console.error("Mongoose getUserProfile error, falling back", e);
      }
    }

    const fbUser = FallbackDB.findOne("users", u => u.id === userId);
    return fbUser ? {
      id: fbUser.id,
      email: fbUser.email,
      name: fbUser.name,
      clearanceLevel: fbUser.clearanceLevel,
      clearanceCode: fbUser.clearanceCode,
      createdAt: fbUser.createdAt
    } : null;
  }

  static async updateUserProfile(userId: string, name: string) {
    if (this.isConnected()) {
      try {
        const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            clearanceLevel: user.clearanceLevel,
            clearanceCode: user.clearanceCode,
            createdAt: user.createdAt
          };
        }
      } catch (e) {
        console.error("Mongoose updateUserProfile error, falling back", e);
      }
    }

    const fbUser = FallbackDB.findOne("users", u => u.id === userId);
    if (fbUser) {
      const updated = FallbackDB.save("users", { ...fbUser, name });
      return {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        clearanceLevel: updated.clearanceLevel,
        clearanceCode: updated.clearanceCode,
        createdAt: updated.createdAt
      };
    }
    return null;
  }

  // --- 2. SESSIONS ---
  static async createSession(userId: string, token: string) {
    if (this.isConnected()) {
      try {
        await Session.create({ userId, token, createdAt: new Date() });
        return true;
      } catch (e) {
        console.error("Mongoose createSession error, falling back", e);
      }
    }
    FallbackDB.save("sessions", { userId, token, createdAt: new Date().toISOString() });
    return true;
  }

  static async verifySession(token: string) {
    if (this.isConnected()) {
      try {
        const session = await Session.findOne({ token });
        if (session) {
          return session.userId;
        }
      } catch (e) {
        console.error("Mongoose verifySession error, falling back", e);
      }
    }
    const fbSession = FallbackDB.findOne("sessions", s => s.token === token);
    return fbSession ? fbSession.userId : null;
  }

  static async destroySession(token: string) {
    if (this.isConnected()) {
      try {
        await Session.deleteOne({ token });
        return true;
      } catch (e) {
        console.error("Mongoose destroySession error, falling back", e);
      }
    }
    FallbackDB.deleteOne("sessions", s => s.token === token);
    return true;
  }

  // --- 3. NOTES ---
  static async getNotes(userId: string) {
    if (this.isConnected()) {
      try {
        const notes = await Note.find({ userId }).sort({ createdAt: -1 });
        return notes.map(n => ({
          id: n._id.toString(),
          lineId: n.lineId,
          text: n.text,
          content: n.content,
          chapter: n.chapter,
          createdAt: n.createdAt
        }));
      } catch (e) {
        console.error("Mongoose getNotes error, falling back", e);
      }
    }
    return FallbackDB.findMany("notes", n => n.userId === userId);
  }

  static async saveNote(userId: string, lineId: string, text: string, content: string, chapter: string) {
    if (this.isConnected()) {
      try {
        // Check if note already exists for this exact lineId to overwrite
        let note = await Note.findOne({ userId, lineId });
        if (note) {
          note.content = content;
          note.text = text;
          note.chapter = chapter;
          await note.save();
        } else {
          note = await Note.create({ userId, lineId, text, content, chapter });
        }
        return {
          id: note._id.toString(),
          lineId: note.lineId,
          text: note.text,
          content: note.content,
          chapter: note.chapter,
          createdAt: note.createdAt
        };
      } catch (e) {
        console.error("Mongoose saveNote error, falling back", e);
      }
    }

    const fbNote = FallbackDB.findOne("notes", n => n.userId === userId && n.lineId === lineId);
    if (fbNote) {
      const updated = FallbackDB.save("notes", { ...fbNote, text, content, chapter });
      return updated;
    } else {
      const saved = FallbackDB.save("notes", { userId, lineId, text, content, chapter });
      return saved;
    }
  }

  static async deleteNote(userId: string, lineId: string) {
    if (this.isConnected()) {
      try {
        await Note.deleteOne({ userId, lineId });
        return true;
      } catch (e) {
        console.error("Mongoose deleteNote error, falling back", e);
      }
    }
    FallbackDB.deleteOne("notes", n => n.userId === userId && n.lineId === lineId);
    return true;
  }

  // --- 4. BOOKMARKS ---
  static async getBookmarks(userId: string) {
    if (this.isConnected()) {
      try {
        const list = await Bookmark.find({ userId }).sort({ createdAt: -1 });
        return list.map(b => ({
          id: b._id.toString(),
          lineId: b.lineId,
          text: b.text,
          chapter: b.chapter,
          matchedLine: b.matchedLine,
          createdAt: b.createdAt
        }));
      } catch (e) {
        console.error("Mongoose getBookmarks error, falling back", e);
      }
    }
    return FallbackDB.findMany("bookmarks", b => b.userId === userId);
  }

  static async toggleBookmark(userId: string, lineId: string, text: string, chapter: string, matchedLine?: string) {
    if (this.isConnected()) {
      try {
        const existing = await Bookmark.findOne({ userId, lineId });
        if (existing) {
          await Bookmark.deleteOne({ _id: existing._id });
          return { isBookmarked: false };
        } else {
          await Bookmark.create({ userId, lineId, text, chapter, matchedLine });
          return { isBookmarked: true };
        }
      } catch (e) {
        console.error("Mongoose toggleBookmark error, falling back", e);
      }
    }

    const fbExisting = FallbackDB.findOne("bookmarks", b => b.userId === userId && b.lineId === lineId);
    if (fbExisting) {
      FallbackDB.deleteOne("bookmarks", b => b.id === fbExisting.id);
      return { isBookmarked: false };
    } else {
      FallbackDB.save("bookmarks", { userId, lineId, text, chapter, matchedLine });
      return { isBookmarked: true };
    }
  }

  // --- 5. VISION UPLOADS ---
  static async saveVisionUpload(userId: string, imageName: string, matchedLine?: string, confidence: number = 0, insights: string = "") {
    if (this.isConnected()) {
      try {
        const upload = await VisionUpload.create({ userId, imageName, matchedLine, confidence, insights });
        return upload;
      } catch (e) {
        console.error("Mongoose saveVisionUpload error, falling back", e);
      }
    }
    return FallbackDB.save("vision_uploads", { userId, imageName, matchedLine, confidence, insights });
  }

  // --- 6. QUESTION HISTORY & PREDICTOR ---
  static async addQuestionHistory(userId: string, questionId: string, questionText: string, selectedIndex: number, answerIndex: number, correct: boolean) {
    if (this.isConnected()) {
      try {
        const hist = await QuestionHistory.create({ userId, questionId, questionText, selectedIndex, answerIndex, correct });
        return hist;
      } catch (e) {
        console.error("Mongoose addQuestionHistory error, falling back", e);
      }
    }
    return FallbackDB.save("question_history", { userId, questionId, questionText, selectedIndex, answerIndex, correct });
  }

  static async getQuestionHistory(userId: string) {
    if (this.isConnected()) {
      try {
        return await QuestionHistory.find({ userId }).sort({ createdAt: -1 });
      } catch (e) {
        console.error("Mongoose getQuestionHistory error", e);
      }
    }
    return FallbackDB.findMany("question_history", q => q.userId === userId);
  }

  // --- 7. ANALYTICS ---
  static async getAnalytics(userId: string) {
    if (this.isConnected()) {
      try {
        let analytics = await Analytics.findOne({ userId });
        if (!analytics) {
          analytics = await Analytics.create({ userId, completedRatio: 12, rankPrediction: 8400, streakCount: 3, totalQuestions: 15 });
        }
        return analytics;
      } catch (e) {
        console.error("Mongoose getAnalytics error, falling back", e);
      }
    }

    let fbAnalytics = FallbackDB.findOne("analytics", a => a.userId === userId);
    if (!fbAnalytics) {
      fbAnalytics = FallbackDB.save("analytics", { userId, completedRatio: 12, rankPrediction: 8400, streakCount: 3, totalQuestions: 15 });
    }
    return fbAnalytics;
  }

  static async saveAnalytics(userId: string, data: any) {
    if (this.isConnected()) {
      try {
        let analytics = await Analytics.findOne({ userId });
        if (analytics) {
          Object.assign(analytics, data);
          await analytics.save();
        } else {
          analytics = await Analytics.create({ userId, ...data });
        }
        return analytics;
      } catch (e) {
        console.error("Mongoose saveAnalytics error, falling back", e);
      }
    }

    const fbAnalytics = FallbackDB.findOne("analytics", a => a.userId === userId) || {};
    return FallbackDB.save("analytics", { ...fbAnalytics, userId, ...data });
  }

  // --- 8. REVISION PLAN ---
  static async getRevisionPlans(userId: string) {
    if (this.isConnected()) {
      try {
        return await RevisionPlan.find({ userId }).sort({ nextRevision: 1 });
      } catch (e) {
        console.error("Mongoose getRevisionPlans error", e);
      }
    }
    return FallbackDB.findMany("revision_plans", r => r.userId === userId);
  }

  static async saveRevisionPlan(userId: string, chapter: string, interval: number, nextRevision: Date, state: string) {
    if (this.isConnected()) {
      try {
        let plan = await RevisionPlan.findOne({ userId, chapter });
        if (plan) {
          plan.interval = interval;
          plan.nextRevision = nextRevision;
          plan.state = state;
          await plan.save();
        } else {
          plan = await RevisionPlan.create({ userId, chapter, interval, nextRevision, state });
        }
        return plan;
      } catch (e) {
        console.error("Mongoose saveRevisionPlan error", e);
      }
    }

    const fbPlan = FallbackDB.findOne("revision_plans", r => r.userId === userId && r.chapter === chapter);
    if (fbPlan) {
      return FallbackDB.save("revision_plans", { ...fbPlan, interval, nextRevision: nextRevision.toISOString(), state });
    } else {
      return FallbackDB.save("revision_plans", { userId, chapter, interval, nextRevision: nextRevision.toISOString(), state });
    }
  }

  // --- 9. TOUR PROGRESS ---
  static async getTourProgress(userId: string) {
    if (this.isConnected()) {
      try {
        let tour = await TourProgress.findOne({ userId });
        if (!tour) {
          tour = await TourProgress.create({ userId, completed: false, lastStep: 0 });
        }
        return tour;
      } catch (e) {
        console.error("Mongoose getTourProgress error", e);
      }
    }

    let fbTour = FallbackDB.findOne("tour_progress", t => t.userId === userId);
    if (!fbTour) {
      fbTour = FallbackDB.save("tour_progress", { userId, completed: false, lastStep: 0 });
    }
    return fbTour;
  }

  static async completeTourProgress(userId: string, completed: boolean, lastStep: number) {
    if (this.isConnected()) {
      try {
        let tour = await TourProgress.findOne({ userId });
        if (tour) {
          tour.completed = completed;
          tour.lastStep = lastStep;
          await tour.save();
        } else {
          tour = await TourProgress.create({ userId, completed, lastStep });
        }
        return tour;
      } catch (e) {
        console.error("Mongoose completeTourProgress error", e);
      }
    }

    const fbTour = FallbackDB.findOne("tour_progress", t => t.userId === userId) || {};
    return FallbackDB.save("tour_progress", { ...fbTour, userId, completed, lastStep });
  }
}
