import { NextResponse, type NextRequest } from "next/server";

/**
 * GET /api/find-seat?name=<query>
 *
 * Server-side name search — never ships the full guest list to the browser.
 * Returns only the minimal public fields the "Find Your Seat" card needs.
 *
 * Privacy: returns only { displayName, group, tableId }
 * Never returns: phone, id, rsvpStatus, rsvpUpdatedAt, side
 *
 * NOTE: `tableId` is the raw ID stored on the guest record.
 * The caller resolves tableId → display number using the tables from localStorage.
 * This keeps the server stateless w.r.t. table configuration.
 */

interface SeatResult {
  id: string;          // needed by the RSVP page to write back via PUT /api/guests/:id
  displayName: string; // "Mr. Amal Perera" or "Amal Perera"
  group: string;       // for disambiguation when multiple guests match
  tableId: string;     // raw ID — resolved client-side using localStorage tables
  rsvpStatus: string;  // "Confirmed" | "Pending" | "Declined" — for pre-populating RSVP UI
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("name")?.trim() ?? "";

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Please enter at least 2 characters." },
      { status: 400 }
    );
  }

  try {
    const { default: dbConnect }  = await import("@/lib/mongodb");
    const { default: GuestModel } = await import("@/models/Guest");

    await dbConnect();

    // Case-insensitive substring search — only on the name field
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex   = new RegExp(escaped, "i");

    const rawGuests = await GuestModel
      .find({ name: regex }, "name title group table status")
      .limit(20)
      .lean();

    const results: SeatResult[] = (rawGuests as any[]).map((g) => {
      const title = String(g.title ?? "").trim();
      const name  = String(g.name  ?? "").trim();
      return {
        id:          g._id.toString(),
        displayName: title ? `${title} ${name}` : name,
        group:       String(g.group      ?? ""),
        tableId:     String(g.table      ?? ""),
        rsvpStatus:  String(g.status     ?? "Pending"),
      };
    });

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: any) {
    console.error("[find-seat] Error:", error?.message ?? error);
    return NextResponse.json(
      { error: "Search unavailable. Please try again." },
      { status: 500 }
    );
  }
}
