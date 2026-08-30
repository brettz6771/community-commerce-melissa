import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { toCsv } from "./csv.ts";

describe("toCsv", () => {
  it("adds a UTF-8 BOM and CRLF rows so Excel opens names correctly", () => {
    const csv = toCsv(["Name", "Email"], [["Jane", "jane@example.com"]]);
    assert.equal(csv.charCodeAt(0), 0xfeff);
    assert.equal(csv.slice(1), "Name,Email\r\nJane,jane@example.com\r\n");
  });

  it("quotes commas, quotes, and newlines", () => {
    const csv = toCsv(["Note"], [['He said "hi", then left\nnext line']]);
    assert.equal(csv.slice(1), 'Note\r\n"He said ""hi"", then left\nnext line"\r\n');
  });
});
