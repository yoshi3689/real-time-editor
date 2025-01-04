// import { prisma } from '../../../../prismaClient';
// import { contentJSON } from "../../../../utils/responseHeaders"
// export async function GET(request) {
//   try {
//     const messages = await prisma.message.findMany({
//       orderBy: { createdAt: 'asc' },
//     });

//     return new Response(JSON.stringify(messages), {
//       status: 200,
//       headers: { contentJSON },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
//       status: 500,
//       headers: { contentJSON },
//     });
//   }
// }

// export async function POST(request) {
//   try {
//     const { content, userId } = await request.json();

//     const newMessage = await prisma.message.create({
//       data: { content, userId },
//     });

//     return new Response(JSON.stringify(newMessage), {
//       status: 201,
//       headers: { contentJSON },
//     });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to send message' }), {
//       status: 500,
//       headers: { contentJSON },
//     });
//   }
// }
