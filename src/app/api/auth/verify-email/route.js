import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendVerificationEmail } from '@/utils/sendEmailVerification';
import { NextResponse } from 'next/server';
import { generateToken } from '@/utils/generateToken';
import { generateAccessTokenConfig } from '@/utils/cookieConfig';

const prisma = new PrismaClient();

export async function GET(request, response) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new NextResponse(
        JSON.stringify({ status: 'error', message: 'Token not found.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Try to verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const expiredTokenPayload = jwt.decode(token);

        if (expiredTokenPayload?.email) {
          const user = await prisma.user.findUnique({
            where: { email: expiredTokenPayload.email },
          });

          if (user && !user.isEmailVerified) {
            await sendVerificationEmail({
              email: user.email,
              name: user.name,
            });

            return new NextResponse(
              JSON.stringify({
                status: 'expired',
                message: 'Token expired. A new verification email has been sent.',
              }),
              { status: 498, headers: { 'Content-Type': 'application/json' } }
            );
          }
        }
      }

      return new NextResponse(
        JSON.stringify({ status: 'error', message: 'Invalid token.' }),
        { status: 498, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If token is valid, find the user
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: 'User with this email was not found in our records.',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (user.isEmailVerified) {
      return new NextResponse(
        JSON.stringify({ status: 'verified', message: 'Email already verified.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email: decoded.email },
      data: { isEmailVerified: true },
    });

    // Generate access token
    const accessToken = await generateToken({ id: user.id, email: user.email })
    res.cookie('token', accessToken, generateAccessTokenConfig());
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ status: 'error', message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
