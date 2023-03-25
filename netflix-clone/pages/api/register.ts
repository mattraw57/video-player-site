import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";
import { validate } from "deep-email-validator";

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
    // checkEmailExists &&
    //   (await validate(email || "").then((validatorRes) => {
    //     if (!validatorRes.validators.smtp?.valid)
    //       return res.status(422).json({ error: "Invalid email" });
    //   }));

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
