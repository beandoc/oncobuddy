import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Server-Sent Events (SSE) Endpoint for Real-Time Clinical Pushes.
 * Establishes a long-lived HTTP connection for instant alert/message delivery.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const userId = session.user.id;
  const lastEventId = req.headers.get("last-event-id");

  // Setting up the stream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Logic: In a real environment, we'd use Redis Pub/Sub here.
  // For this implementation, we simulate the stream lifecycle.
  
  const sendEvent = (data: any, eventName = "message") => {
    writer.write(encoder.encode(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`));
  };

  // Initial connection success
  sendEvent({ connected: true, userId, timestamp: new Date().toISOString() }, "connected");

  // Keep-alive heartbeat (Section 9)
  const heartbeatInterval = setInterval(() => {
    writer.write(encoder.encode(`: heartbeat\n\n`));
  }, 30000);

  // Close handle
  req.signal.onabort = () => {
    clearInterval(heartbeatInterval);
    writer.close();
  };

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
