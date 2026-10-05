import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import { ADMIN_COOKIE_NAME, isInternalAuthorized, verifyAdminSecret } from "./internal-auth.ts";

const originalSecret = process.env.INTERNAL_API_SECRET;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.INTERNAL_API_SECRET;
  } else {
    process.env.INTERNAL_API_SECRET = originalSecret;
  }
  process.env.NODE_ENV = originalNodeEnv;
});

function requestWith(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/export-newsletter", { headers });
}

describe("isInternalAuthorized", () => {
  it("allows local access only when no secret is configured", () => {
    delete process.env.INTERNAL_API_SECRET;
    process.env.NODE_ENV = "development";
    assert.equal(isInternalAuthorized(requestWith()), true);

    process.env.NODE_ENV = "production";
    assert.equal(isInternalAuthorized(requestWith()), false);
  });

  it("accepts a matching Bearer token or x-internal-api-secret header", () => {
    process.env.INTERNAL_API_SECRET = "export-secret";
    process.env.NODE_ENV = "production";

    assert.equal(isInternalAuthorized(requestWith()), false);
    assert.equal(isInternalAuthorized(requestWith({ authorization: "Bearer wrong" })), false);
    assert.equal(isInternalAuthorized(requestWith({ authorization: "Bearer export-secret" })), true);
    assert.equal(isInternalAuthorized(requestWith({ "x-internal-api-secret": "export-secret" })), true);
  });

  it("accepts an admin cookie", () => {
    process.env.INTERNAL_API_SECRET = "export-secret";
    process.env.NODE_ENV = "production";

    assert.equal(
      isInternalAuthorized(requestWith({ cookie: `${ADMIN_COOKIE_NAME}=wrong` })),
      false
    );
    assert.equal(
      isInternalAuthorized(requestWith({ cookie: `other=foo; ${ADMIN_COOKIE_NAME}=export-secret; bar=baz` })),
      true
    );
  });

  it("verifies secret directly using verifyAdminSecret", () => {
    process.env.INTERNAL_API_SECRET = "export-secret";
    process.env.NODE_ENV = "production";

    assert.equal(verifyAdminSecret("export-secret"), true);
    assert.equal(verifyAdminSecret("wrong-secret"), false);

    delete process.env.INTERNAL_API_SECRET;
    process.env.NODE_ENV = "development";
    assert.equal(verifyAdminSecret(""), true);
    assert.equal(verifyAdminSecret("anything"), true);
  });
});

