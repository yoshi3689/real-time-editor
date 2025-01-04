export const generateAccessTokenConfig = (value) => {
  return {
    name: "access token for socket chat app",
    value,
    maxAge: 3600 * 1000, // 1 hour
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: 'strict', // Mitigates CSRF attacks
    }
}

// {
//     name: "jwt",
//     value: jwt,
//     maxAge: 60*60*24,
//     httpOnly: true,
//     sameSite: strict,
//   }

export const generateRefreshTokenConfig = () => {
  return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: 'strict', // Mitigates CSRF attacks
      maxAge: 3600 * 1000, // 1 hour
    }
}