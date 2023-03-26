import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { validate } from "deep-email-validator";

async function checkEmail(email: string) {
  const response = await fetch(
    // `https://api.zerobounce.net/v2/validate?api_key=c6a93d22fb6c4d2daf43248ddf8719cf&email=valid@example.com&ip_address=`
    `https://api.zerobounce.net/v2/validate?api_key=c6a93d22fb6c4d2daf43248ddf8719cf&email=${email}&ip_address=`
  );

  const info = await response.json();
  return info;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { email, name, password, checkEmailExists } = req.body;
    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });
    if (checkEmailExists) {
      const emailInfo = await checkEmail(email);
      if (emailInfo.status === "invalid") {
        return res.status(422).json({ error: "Invalid email" });
      }
    }

    if (existingUser) {
      return res.status(422).json({ error: "Email taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
