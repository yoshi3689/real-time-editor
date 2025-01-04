import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from "@/utils/sendEmailVerification"
import validate from 'deep-email-validator';

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, username, password, name } = await request.json();
    // Validate input
    if (!email || !username || !password || !name) {
      // deep-validate email address
      let errorResponseMessage = 'All fields are required';
      const mailValidationRes = await validate(email)
      if (!mailValidationRes.valid) {
        errorResponseMessage = 'invalid email address';
      }
      return new Response(JSON.stringify({ error: errorResponseMessage }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  const userId = uuidv4(); // Generate a unique ID
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email,
        username,
        password: hashedPassword,
        name,
        isVerificationEmailSent: false,
        isEmailVerified: false
      },
    });
    
    // Simplified utility call
    await sendVerificationEmail({ email: newUser.email, name: newUser.name });

    // Update the user to indicate the email has been sent
    await prisma.user.update({
      where: { email: newUser.email },
      data: { isVerificationEmailSent: true },
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
    
  } catch (error) {
    if (error.code === 'P2002') {
    return new Response(
      JSON.stringify({ error: 'Email or username already exists' }),
      { status: 400 }
    );
    }
    console.error(error.message)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
