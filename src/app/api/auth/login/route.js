import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '@/utils/sendEmailVerification';
import { generateToken } from "@/utils/generateToken"
import { generateAccessTokenConfig } from '@/utils/cookieConfig';
import { NextResponse } from 'next/server';
export const prisma = new  PrismaClient()

export async function POST(request) {
    try {
      const { username, password } = await request.json();
      // TODO: giving the null result error because the field username in the schema was not annotated with @unique
      const user = await prisma.user.findUnique({
        where: { username }
      });
      
    // if user not found in db
    if (!user) {
      return new Response(JSON.stringify({ error: 'user not found. Please sign up first.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // if passowrd incorrect
    if (!(await bcrypt.compare(password, user.password))) {

      return new Response(JSON.stringify({ error: 'incorrect password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
      
      // if email not verified
      if (user && !user.isEmailVerified) {
        // if EVER email not sent
        if (!user.isVerificationEmailSent) {
          const result = await sendVerificationEmail({ email: user.email, name: user.name });
          console.log(result)
            await prisma.user.update({
              where: { email: user.email },
              data: { isVerificationEmailSent: true },
            });
        }
        return new Response(
          JSON.stringify({ error: 'Email not vierified yet' }),
          { status: 400 }
        );
      }

      const token = await generateToken({
        id: user.id, email: user.email
      })
      
      
      // Set the JWT in an HttpOnly cookie
      const response = NextResponse.json(
        { data: { message: 'Login successful' }, },
        { status: 200, statusText: 'Login successful' }
      );
      response.cookies.set(generateAccessTokenConfig(token))
      return response
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
