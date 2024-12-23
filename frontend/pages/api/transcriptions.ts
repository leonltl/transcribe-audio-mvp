import type { NextApiRequest, NextApiResponse } from "next";

type TranscriptionData = {
    key: string;
    filename: string;
    transcript: string;
    language: string;
    created_at: string;
}


type Transcription = {
  key: string;
  filename: string;
  transcript: string;
  language: string;
  createdAt: string;
}
  
const url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api`
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Transcription[]>,
) {
  try {
    const data = await fetch(`${url}/transcriptions`).then(res => res.json());
    const transcriptions = data.map((item: TranscriptionData) => ({
      key: item.filename,
      filename: item.filename,
      language: item.language,
      createdAt: item.created_at,
      transcript: item.transcript
    }));

    res.status(200).json(transcriptions);
  } catch {
    const transcriptions: Transcription[] = [];
    res.status(500).json(transcriptions);
  }
}