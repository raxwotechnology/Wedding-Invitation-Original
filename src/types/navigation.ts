import type { ComponentType } from "react";

/** Represents the wedding couple whose names appear in the drawer header. */
export interface WeddingCouple {
  partnerA: string;
  partnerB: string;
}

/**
 * A single navigation item in the guest-management sidebar drawer.
 * `isActive` is a predicate so each item can define its own active logic
 * (e.g. exact path, path + query-param, or prefix match).
 */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isActive: (pathname: string, searchParams: URLSearchParams) => boolean;
}
