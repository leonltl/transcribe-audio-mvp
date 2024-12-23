// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    message: string
}

const url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api`;

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>,
) {
  const { filename } = req.query;
  if (!filename || typeof filename !== 'string') {
    res.status(400).json({ error: 'Invalid search query' });
    return;
  }

  if (req.method !== 'DELETE') {
    res.status(405).json({error: "Method not allowed for File Deletion"});
    return;
  }

  try {
    const response = await fetch(`${url}/delete?filename=${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const message = await response.json();
      res.status(response.status).json({ error: message.error });
      return;
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
