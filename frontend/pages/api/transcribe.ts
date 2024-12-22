import type { NextApiRequest, NextApiResponse } from "next";
import { Formidable } from "formidable";
import fs from "fs/promises";
import path from "path";
import os from "os";

type TranscriptionData = {
  filename: string;
  transcript: string;
  language: string;
  created_at: string;
};

type ErrorResponse = {
  error: string;
};

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranscriptionData | ErrorResponse>
) {
  const { language } = req.query;
  if (!language || typeof language !== "string") {
    res.status(400).json({ error: "Invalid or missing language query" });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed for File Upload" });
    return;
  }

  // Temporary directory
  const tempDir = path.join(os.tmpdir(), "uploads");

  // Ensure the temporary directory exists
  await fs.mkdir(tempDir, { recursive: true });

  // Parse incoming form data
  const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const form = new Formidable({
      uploadDir: tempDir, // Temporary storage directory
      keepExtensions: true, // Retain file extensions
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const { files } = data;

  // Validate uploaded file
  const file = files.file; // `file` should match the name in `formData.append`
  if (!file || !(file instanceof Array) || !file.length) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const uploadedFile = file[0];
  try {

    // Read the uploaded file
    const fileBuffer = await fs.readFile(uploadedFile.filepath);
    
    // Convert fileBuffer to Blob
    const blob = new Blob([fileBuffer]);

    // Create FormData and attach the file
    const formData = new FormData();
    formData.append("file", blob, uploadedFile.originalFilename);

    // Forward the file to the transcription server
    const transcriptionServerUrl = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api/transcribe?language=${language}`;
    const response = await fetch(transcriptionServerUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      res.status(response.status).json(error);
      return;
    }

    const result: TranscriptionData = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    try {
        await fs.unlink(uploadedFile.filepath);
        console.log(`Temporary file deleted: ${uploadedFile.filepath}`);
      } catch (cleanupError) {
        console.error(`Failed to delete temporary file: ${uploadedFile.filepath}`, cleanupError);
      }
  }
}