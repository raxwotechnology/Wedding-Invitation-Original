import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: "success", message: "Connected to MongoDB successfully!" });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
