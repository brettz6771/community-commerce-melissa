import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashMemberPassword,
  memberHasPassword,
  validateMemberPassword,
  verifyMemberPassword,
} from "./member-password.ts";

describe("member passwords", () => {
  it("requires a reasonably long password", () => {
    assert.equal(validateMemberPassword(""), "Enter a password.");
    assert.equal(validateMemberPassword("short"), "Use at least 10 characters.");
    assert.equal(validateMemberPassword("a".repeat(201)), "Password is too long.");
    assert.equal(validateMemberPassword("Melissa2026!"), null);
  });

  it("hashes and verifies a password without storing the plaintext", async () => {
    const hash = await hashMemberPassword("Melissa2026!");
    assert.match(hash, /^scrypt\$/);
    assert.equal(hash.includes("Melissa2026!"), false);
    assert.equal(await verifyMemberPassword("Melissa2026!", hash), true);
    assert.equal(await verifyMemberPassword("wrong-password", hash), false);
    assert.equal(await verifyMemberPassword("Melissa2026!", "not-a-hash"), false);
  });

  it("treats only scrypt hashes as a set password", () => {
    assert.equal(memberHasPassword({ passwordHash: "scrypt$abc$def" }), true);
    assert.equal(memberHasPassword({ passwordHash: "" }), false);
    assert.equal(memberHasPassword({}), false);
  });
});
