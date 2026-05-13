export async function POST(request) {
  const { code } = await request.json();
  const valid = code && code.trim() === process.env.DEMO_CODE;
  return Response.json({ valid });
}
