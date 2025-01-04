import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, username, password, name } = await request.json();

    // Validate input fields
    if (!email || !username || !password || !name) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if the email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email or username is already registered" }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
        emailVerified: null, // Email verification is handled by NextAuth
        isVerificationEmailSent: false, // Optional field for custom logic
      },
    });

    // Optionally, you can send a verification email here
    // Example: await sendVerificationEmail({ email: newUser.email, name: newUser.name });

    // Respond with success
    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: {
          email: newUser.email,
          username: newUser.username,
          name: newUser.name,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error.message);

    // Prisma-specific error handling
    if (error.code === "P2002") {
      return new Response(
        JSON.stringify({ error: "Email or username already exists" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
