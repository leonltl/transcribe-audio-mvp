// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type TranscriptionData = {
    key: string;
    filename: string;
    transcript: string;
    language: string;
    created_at: string;
}

const url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api`;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranscriptionData[] | ErrorResponse>,
) {
  const { filename } = req.query;
  if (!filename || typeof filename !== 'string') {
    res.status(400).json({ "error": 'Invalid search query' });
    return;
  }

  const data = await fetch(`${url}/search?filename=${filename}`).then(res => res.json());
  const transcriptions = data.map((item: TranscriptionData) => ({
    key: item.filename,
    filename: item.filename,
    language: item.language,
    createdAt: item.created_at
  }));

  res.status(200).json(transcriptions);
}
