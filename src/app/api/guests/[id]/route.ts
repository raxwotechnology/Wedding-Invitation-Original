import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  // If the id is not a valid MongoDB ObjectId the guest only exists in
  // localStorage (created while offline). Echo the merged record back so
  // GuestContext can confirm its optimistic state without a DB roundtrip.
  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ id: params.id, ...body });
  }


  try {
    await dbConnect();

    // Auto-stamp rsvpUpdatedAt whenever status is being changed.
    const update = body.status
      ? { ...body, rsvpUpdatedAt: new Date().toISOString() }
      : body;

    const updated = await Guest.findByIdAndUpdate(params.id, update, { new: true });
    if (!updated) {
      // Guest not in DB but id looks like an ObjectId — treat as local-only.
      return NextResponse.json({ id: params.id, ...body });
    }
    return NextResponse.json(mapGuest(updated));
  } catch (error) {
    console.error("PUT /api/guests/[id] error:", error);
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // If the id is not a valid MongoDB ObjectId the guest only exists in
  // localStorage (created while offline). Treat delete as successful.
  if (!isValidObjectId(params.id)) {
    return NextResponse.json({ success: true });
  }

  try {
    await dbConnect();
    const deleted = await Guest.findByIdAndDelete(params.id);
    // 404 just means it was already gone — still treat as success.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/guests/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }
}
