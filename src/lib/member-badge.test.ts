import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  badgePngFilename,
  getBadgeTierLabel,
  renderMemberBadgeSvg,
  resolveMemberId,
  toBadgeRenderData,
} from "./member-badge.ts";

describe("member badge helpers", () => {
  it("maps membership tiers and stable member IDs", () => {
    assert.equal(getBadgeTierLabel("Corporate & Community Sponsorship"), "Corporate Partner");
    assert.equal(getBadgeTierLabel("Community Partner ($390)"), "Community Partner");
    assert.equal(resolveMemberId({ memberId: "ccm-2026-ab12cd" }), "CCM-2026-AB12CD");
    assert.equal(resolveMemberId({ id: 17 }), "CCM-2026-000017");
    assert.equal(badgePngFilename("CCM-2026-DEV001"), "CCM-Official-Badge-CCM-2026-DEV001.png");
  });

  it("renders an SVG badge with escaped member details", () => {
    const svg = renderMemberBadgeSvg(
      toBadgeRenderData({
        businessName: 'Hale & <Co>',
        memberId: "CCM-2026-DEV001",
        tier: "Community Partner",
        ownerName: "Jordan Hale",
      })
    );
    assert.match(svg, /<svg /);
    assert.match(svg, /HALE &amp; &lt;CO&gt;/);
    assert.match(svg, /CCM-2026-DEV001/);
    assert.match(svg, /COMMUNITY PARTNER/);
    assert.match(svg, /Jordan Hale/);
  });
});
