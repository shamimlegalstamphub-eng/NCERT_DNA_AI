import fs from "node:fs";
import path from "path";

const LOCAL_STORAGE_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure local storage directory exists
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

export class StorageService {
  /**
   * Mock or upload file to Google Cloud Storage
   * @param fileName Name of the file to save
   * @param base64Content Base64 encoded string or raw file buffer
   * @returns Public accessible URL
   */
  static async uploadFile(fileName: string, base64Content: string): Promise<string> {
    const bucketName = process.env.GCS_BUCKET_NAME || "ncert-dna-uploads-bucket";
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    // Clean up base64 prefix if present
    const base64Data = base64Content.includes(",") 
      ? base64Content.split(",")[1] 
      : base64Content;

    const buffer = Buffer.from(base64Data, "base64");

    // If real Google Application Credentials exist, we can implement the exact SDK upload
    const hasGcs = process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    if (hasGcs) {
      try {
        // Dynamic import of @google-cloud/storage to keep dependencies light and load lazily
        const { Storage } = await import("@google-cloud/storage" as any);
        const storage = new Storage();
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);

        await file.save(buffer, {
          resumable: false,
          metadata: {
            contentType: this.getContentType(fileName)
          }
        });

        console.log(`🚀 File ${fileName} successfully uploaded to Google Cloud Storage bucket: ${bucketName}`);
        return `https://storage.googleapis.com/${bucketName}/${fileName}`;
      } catch (gcsError) {
        console.warn("⚠️ Google Cloud Storage SDK upload failed, falling back to local storage routing:", gcsError);
      }
    }

    // Local Failover Route
    const localPath = path.join(LOCAL_STORAGE_DIR, fileName);
    fs.writeFileSync(localPath, buffer);
    console.log(`📁 File ${fileName} stored locally under public asset directory (Local Cloud Storage Fallback).`);
    return `${appUrl}/uploads/${fileName}`;
  }

  private static getContentType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
      case ".pdf": return "application/pdf";
      case ".png": return "image/png";
      case ".jpg":
      case ".jpeg": return "image/jpeg";
      default: return "application/octet-stream";
    }
  }
}
