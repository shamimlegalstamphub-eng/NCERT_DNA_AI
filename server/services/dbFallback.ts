import fs from "node:fs";
import path from "path";

interface FallbackDBData {
  users: any[];
  sessions: any[];
  bookmarks: any[];
  notes: any[];
  ncert_lines: any[];
  vision_uploads: any[];
  question_history: any[];
  predicted_questions: any[];
  analytics: any[];
  revision_plans: any[];
  tour_progress: any[];
}

const initialData: FallbackDBData = {
  users: [],
  sessions: [],
  bookmarks: [],
  notes: [],
  ncert_lines: [],
  vision_uploads: [],
  question_history: [],
  predicted_questions: [],
  analytics: [],
  revision_plans: [],
  tour_progress: []
};

// Completely in-memory fallback dataset to satisfy the requirement of not loading or writing fallback-db.json
const memoryDB: FallbackDBData = JSON.parse(JSON.stringify(initialData));

export class FallbackDB {
  private static read(): FallbackDBData {
    return memoryDB;
  }

  private static write(data: FallbackDBData) {
    // In-memory data is updated in-place, so write is a safe no-op.
  }

  static getCollection(collectionName: keyof FallbackDBData): any[] {
    const data = this.read();
    return data[collectionName] || [];
  }

  static save(collectionName: keyof FallbackDBData, record: any): any {
    const data = this.read();
    if (!data[collectionName]) {
      data[collectionName] = [];
    }
    
    // Check if item has ID or unique field to update or append
    const idx = data[collectionName].findIndex((item: any) => 
      (record.id && item.id === record.id) || 
      (record.userId && collectionName === "analytics" && item.userId === record.userId) ||
      (record.userId && collectionName === "tour_progress" && item.userId === record.userId) ||
      (record.email && item.email === record.email)
    );

    if (idx >= 0) {
      data[collectionName][idx] = { ...data[collectionName][idx], ...record, updatedAt: new Date().toISOString() };
      this.write(data);
      return data[collectionName][idx];
    } else {
      const newRecord = { 
        id: Math.random().toString(36).substring(2, 11),
        ...record, 
        createdAt: record.createdAt || new Date().toISOString() 
      };
      data[collectionName].push(newRecord);
      this.write(data);
      return newRecord;
    }
  }

  static findOne(collectionName: keyof FallbackDBData, filter: (item: any) => boolean): any | null {
    const list = this.getCollection(collectionName);
    return list.find(filter) || null;
  }

  static findMany(collectionName: keyof FallbackDBData, filter: (item: any) => boolean): any[] {
    const list = this.getCollection(collectionName);
    return list.filter(filter);
  }

  static deleteOne(collectionName: keyof FallbackDBData, filter: (item: any) => boolean): boolean {
    const data = this.read();
    const list = data[collectionName] || [];
    const idx = list.findIndex(filter);
    if (idx >= 0) {
      list.splice(idx, 1);
      data[collectionName] = list;
      this.write(data);
      return true;
    }
    return false;
  }
}
