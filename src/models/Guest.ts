import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  title:          { type: String, default: "" },
  phone:          { type: String, required: true },
  group:          { type: String, default: "Family" },
  /** "A" | "B" | "" — which partner's side; empty = both */
  side:           { type: String, enum: ["A", "B", ""], default: "" },
  status:         { type: String, enum: ["Confirmed", "Pending", "Declined"], default: "Pending" },
  table:          { type: String, default: "" },
  /**
   * ISO timestamp of the last RSVP status change.
   * Stamped automatically by the PUT route when status changes.
   */
  rsvpUpdatedAt:  { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.Guest || mongoose.model("Guest", GuestSchema);
