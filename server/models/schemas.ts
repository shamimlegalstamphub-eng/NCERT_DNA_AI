import mongoose, { Schema, Document } from "mongoose";

// --- Helper for Mock Data Fallback ---
// Since we want the system to be 100% functional even when MongoDB URI is empty or during compilation,
// we will export real Mongoose Models if connected, but we'll also have a fallback structure.

// 1. User Schema
export interface IUser extends Document {
  email: string;
  name?: string;
  clearanceLevel: string;
  clearanceCode: string;
  createdAt: Date;
}
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  clearanceLevel: { type: String, default: "GUEST_PREVIEW" },
  clearanceCode: { type: String, default: "DNA-LVL-01" },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 2. Session Schema with TTL index
export interface ISession extends Document {
  userId: string;
  token: string;
  createdAt: Date;
}
const SessionSchema = new Schema<ISession>({
  userId: { type: String, required: true, index: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, index: true }
});
// TTL Index: Session expires after 30 days (30 days * 24 hours * 60 mins * 60 secs = 2592000 seconds)
SessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// 3. Bookmark Schema
export interface IBookmark extends Document {
  userId: string;
  lineId: string;
  text: string;
  chapter: string;
  matchedLine?: string;
  createdAt: Date;
}
const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: String, required: true, index: true },
  lineId: { type: String, required: true },
  text: { type: String, required: true },
  chapter: { type: String, required: true, index: true },
  matchedLine: { type: String },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 4. Note Schema
export interface INote extends Document {
  userId: string;
  lineId: string;
  text: string;
  content: string;
  chapter: string;
  createdAt: Date;
}
const NoteSchema = new Schema<INote>({
  userId: { type: String, required: true, index: true },
  lineId: { type: String, required: true },
  text: { type: String, required: true },
  content: { type: String, required: true },
  chapter: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 5. NCERTLine Schema
export interface INCERTLine extends Document {
  chapter: string;
  text: string;
  lineHash: string;
  index: number;
  difficulty: string;
  createdAt: Date;
}
const NCERTLineSchema = new Schema<INCERTLine>({
  chapter: { type: String, required: true, index: true },
  text: { type: String, required: true },
  lineHash: { type: String, required: true, unique: true, index: true },
  index: { type: Number, required: true },
  difficulty: { type: String, default: "Medium" },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 6. VisionUpload Schema
export interface IVisionUpload extends Document {
  userId: string;
  imageName: string;
  matchedLine?: string;
  confidence: number;
  insights: string;
  createdAt: Date;
}
const VisionUploadSchema = new Schema<IVisionUpload>({
  userId: { type: String, required: true, index: true },
  imageName: { type: String, required: true },
  matchedLine: { type: String },
  confidence: { type: Number, default: 0 },
  insights: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 7. QuestionHistory Schema
export interface IQuestionHistory extends Document {
  userId: string;
  questionId: string;
  questionText: string;
  selectedIndex: number;
  answerIndex: number;
  correct: boolean;
  createdAt: Date;
}
const QuestionHistorySchema = new Schema<IQuestionHistory>({
  userId: { type: String, required: true, index: true },
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  selectedIndex: { type: Number, required: true },
  answerIndex: { type: Number, required: true },
  correct: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 8. PredictedQuestion Schema
export interface IPredictedQuestion extends Document {
  chapter: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  difficulty: string;
  createdAt: Date;
}
const PredictedQuestionSchema = new Schema<IPredictedQuestion>({
  chapter: { type: String, required: true, index: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  answerIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
  difficulty: { type: String, default: "Medium" },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 9. Analytics Schema
export interface IAnalytics extends Document {
  userId: string;
  completedRatio: number;
  rankPrediction: number;
  streakCount: number;
  totalQuestions: number;
  createdAt: Date;
}
const AnalyticsSchema = new Schema<IAnalytics>({
  userId: { type: String, required: true, unique: true, index: true },
  completedRatio: { type: Number, default: 0 },
  rankPrediction: { type: Number, default: 10000 },
  streakCount: { type: Number, default: 1 },
  totalQuestions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 10. RevisionPlan Schema
export interface IRevisionPlan extends Document {
  userId: string;
  chapter: string;
  interval: number;
  nextRevision: Date;
  state: string;
  createdAt: Date;
}
const RevisionPlanSchema = new Schema<IRevisionPlan>({
  userId: { type: String, required: true, index: true },
  chapter: { type: String, required: true, index: true },
  interval: { type: Number, default: 1 },
  nextRevision: { type: Date, required: true },
  state: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now, index: true }
});

// 11. TourProgress Schema
export interface ITourProgress extends Document {
  userId: string;
  completed: boolean;
  lastStep: number;
  createdAt: Date;
}
const TourProgressSchema = new Schema<ITourProgress>({
  userId: { type: String, required: true, unique: true, index: true },
  completed: { type: Boolean, default: false },
  lastStep: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true }
});

// --- Register and Export Models ---
export const User = mongoose.model<IUser>("User", UserSchema);
export const Session = mongoose.model<ISession>("Session", SessionSchema);
export const Bookmark = mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
export const Note = mongoose.model<INote>("Note", NoteSchema);
export const NCERTLine = mongoose.model<INCERTLine>("NCERTLine", NCERTLineSchema);
export const VisionUpload = mongoose.model<IVisionUpload>("VisionUpload", VisionUploadSchema);
export const QuestionHistory = mongoose.model<IQuestionHistory>("QuestionHistory", QuestionHistorySchema);
export const PredictedQuestion = mongoose.model<IPredictedQuestion>("PredictedQuestion", PredictedQuestionSchema);
export const Analytics = mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
export const RevisionPlan = mongoose.model<IRevisionPlan>("RevisionPlan", RevisionPlanSchema);
export const TourProgress = mongoose.model<ITourProgress>("TourProgress", TourProgressSchema);
