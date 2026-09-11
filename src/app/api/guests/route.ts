import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Guest from "@/models/Guest";

/** Map a Mongoose document to the canonical Guest shape. */
function mapGuest(g: any) {
  return {
    id: g._id.toString(),
    name: g.name,
    title: g.title ?? "",
    phone: g.phone,
    group: g.group,
    side: g.side ?? "",
    status: g.status,
    table: g.table ?? "",
    rsvpUpdatedAt: g.rsvpUpdatedAt ?? undefined,
  };
}

export async function GET() {
  try {
    await dbConnect();
    const guests = await Guest.find({}).sort({ createdAt: -1 });
    return NextResponse.json(guests.map(mapGuest));
  } catch (error) {
    console.error("GET /api/guests error:", error);
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Stamp rsvpUpdatedAt if a non-Pending status is set at creation time.
    const rsvpUpdatedAt =
      body.status && body.status !== "Pending"
        ? new Date().toISOString()
        : undefined;

    const newGuest = await Guest.create({ ...body, rsvpUpdatedAt });
    return NextResponse.json(mapGuest(newGuest), { status: 201 });
  } catch (error) {
    console.error("POST /api/guests error:", error);
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 });
  }
}
