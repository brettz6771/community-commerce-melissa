import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyPublicDirectoryVisibility,
  parseVisibility,
  toMemberPortalRecord,
  validateMemberProfile,
  visibilityFromRecord,
} from "./member-portal.ts";

describe("validateMemberProfile", () => {
  const valid = {
    businessName: "Melissa Family Dental",
    ownerName: "Jane Doe",
    email: "  Jane@Example.com ",
    phone: "(972) 555-0100",
    category: "Health, Medical & Wellness",
    description: "Family dentistry serving Melissa.",
    website: "melissafamilydental.com",
    city: "Melissa",
    state: "TX",
  };

  it("normalizes email and website and accepts required member fields", () => {
    const parsed = validateMemberProfile(valid);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.value.email, "jane@example.com");
    assert.equal(parsed.value.website, "https://melissafamilydental.com");
    assert.equal(parsed.value.businessName, "Melissa Family Dental");
  });

  it("rejects missing fields and unsafe websites", () => {
    const parsed = validateMemberProfile({
      businessName: "",
      ownerName: "",
      email: "not-an-email",
      phone: "",
      category: "",
      description: "",
      website: "https://",
    });
    assert.equal(parsed.ok, false);
    if (parsed.ok) return;
    assert.equal(parsed.errors.businessName, "Business name is required.");
    assert.equal(parsed.errors.email, "Enter a valid email address.");
    assert.equal(parsed.errors.website, "Enter a valid website URL (https://…).");
    assert.ok(parsed.errors.description);
  });
});

describe("portal record", () => {
  it("links the badge record by email and never exposes a password hash", () => {
    const record = toMemberPortalRecord({
      id: 9,
      businessName: "Melissa Demo Partners",
      category: "Professional & Business Consulting",
      email: "Member@Example.com",
      ownerName: "Jordan Hale",
      passwordHash: "scrypt$salt$hash",
      isActive: true,
    });
    assert.equal(record.email, "member@example.com");
    assert.equal(record.hasPassword, true);
    assert.equal(record.memberId, "CCM-2026-000009");
    assert.equal(record.passwordHash, undefined);
  });
});

describe("directory visibility", () => {
  it("defaults email hidden and other public fields visible", () => {
    const visibility = visibilityFromRecord({});
    assert.equal(visibility.listingVisible, true);
    assert.equal(visibility.showPhone, true);
    assert.equal(visibility.showEmail, false);
  });

  it("strips opted-out fields and drops hidden listings", () => {
    const hidden = applyPublicDirectoryVisibility({
      businessName: "Hidden Shop",
      category: "Retail, Boutiques & Shopping",
      isActive: true,
      listingVisible: false,
      phone: "555",
    });
    assert.equal(hidden, null);

    const partial = applyPublicDirectoryVisibility({
      businessName: "Visible Shop",
      category: "Retail, Boutiques & Shopping",
      description: "A local shop",
      phone: "(972) 555-0148",
      website: "https://example.com",
      city: "Melissa",
      state: "TX",
      email: "owner@example.com",
      ownerName: "Owner",
      isActive: true,
      listingVisible: true,
      showPhone: false,
      showWebsite: false,
      showDescription: true,
      showLocation: false,
      showEmail: true,
    });

    assert.ok(partial);
    assert.equal(partial?.phone, "");
    assert.equal(partial?.website, "");
    assert.equal(partial?.description, "A local shop");
    assert.equal(partial?.city, "");
    assert.equal(partial?.state, "");
    assert.equal(partial?.email, "owner@example.com");
    assert.equal(partial?.ownerName, "");
  });

  it("parses visibility booleans from a portal payload", () => {
    const parsed = parseVisibility({
      listingVisible: false,
      showPhone: "true",
      showWebsite: 0,
      showDescription: true,
      showLocation: "false",
      showEmail: 1,
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.value.listingVisible, false);
    assert.equal(parsed.value.showPhone, true);
    assert.equal(parsed.value.showWebsite, false);
    assert.equal(parsed.value.showLocation, false);
    assert.equal(parsed.value.showEmail, true);
  });
});
