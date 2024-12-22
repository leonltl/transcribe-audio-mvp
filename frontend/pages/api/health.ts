// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: string;
};

const url = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/api`
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const data: { status: string } = await fetch(`${url}/health`).then(res => res.json());
    const { status } = data;
    res.status(200).json({ status });
  } catch (error) {
    res.status(200).json({ status: "Unhealthy" });
  }
}
