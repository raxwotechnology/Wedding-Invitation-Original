export type RsvpStatus = "Confirmed" | "Pending" | "Declined";
export type GuestSide = "A" | "B" | "Both" | "";

export interface Guest {
  id: string;
  name: string;
  title?: string;
  phone: string;
  group: string;
  side?: string;
  status: RsvpStatus;
  table: string;
  partySize?: number;
  createdAt?: string;
  rsvpUpdatedAt?: string;
}

export interface NewGuestInput {
  name: string;
  title?: string;
  phone: string;
  group: string;
  side?: string;
  status: RsvpStatus;
  table?: string;
  partySize?: number;
}

export interface UpdateGuestInput {
  name?: string;
  title?: string;
  phone?: string;
  group?: string;
  side?: string;
  status?: RsvpStatus;
  table?: string;
  partySize?: number;
  rsvpUpdatedAt?: string;
}

export interface Table {
  id: string;
  number: number;
  label: string;
  capacity: number;
}

export interface TableInput {
  number: number;
  label: string;
  capacity: number;
}

export interface TableUpdate {
  number?: number;
  label?: string;
  capacity?: number;
}
