export type DirectoryListingStatus = "active" | "suspended" | "expired";

export function addCalendarMonths(date: Date, months: number): Date {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export function defaultMembershipExpiresAt(startedAt: Date, months = 12): Date {
  return addCalendarMonths(startedAt, months);
}

export function unixSecondsToDate(unix?: number | null): Date | null {
  if (typeof unix !== "number" || !Number.isFinite(unix) || unix <= 0) {
    return null;
  }
  return new Date(unix * 1000);
}

export function subscriptionPeriodEndUnix(sub: {
  current_period_end?: number | null;
  items?: { data?: Array<{ current_period_end?: number | null }> } | null;
}): number | null {
  const fromItem = sub.items?.data?.[0]?.current_period_end;
  if (typeof fromItem === "number" && fromItem > 0) {
    return fromItem;
  }
  if (typeof sub.current_period_end === "number" && sub.current_period_end > 0) {
    return sub.current_period_end;
  }
  return null;
}

export function isPublicDirectoryListing(input: {
  isActive?: boolean | null;
  membershipExpiresAt?: Date | string | null;
  now?: Date;
}): boolean {
  if (input.isActive === false) {
    return false;
  }
  if (input.membershipExpiresAt == null || input.membershipExpiresAt === "") {
    return true;
  }
  const expires =
    input.membershipExpiresAt instanceof Date
      ? input.membershipExpiresAt
      : new Date(input.membershipExpiresAt);
  if (Number.isNaN(expires.getTime())) {
    return true;
  }
  const now = input.now ?? new Date();
  return expires.getTime() > now.getTime();
}

export function listingStatus(input: {
  isActive?: boolean | null;
  membershipExpiresAt?: Date | string | null;
  now?: Date;
}): DirectoryListingStatus {
  if (input.isActive === false) {
    return "suspended";
  }
  if (!isPublicDirectoryListing(input)) {
    return "expired";
  }
  return "active";
}

export function shouldRestoreAfterDispute(disputeStatus?: string | null): boolean {
  const status = (disputeStatus || "").toLowerCase();
  return status === "won" || status === "warning_closed";
}
