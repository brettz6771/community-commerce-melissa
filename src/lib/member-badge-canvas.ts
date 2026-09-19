import { badgePngFilename, getBadgeTierLabel, type BadgeRenderData } from "@/lib/member-badge";

export function drawMemberBadge(ctx: CanvasRenderingContext2D, data: BadgeRenderData): void {
  const cleanTier = getBadgeTierLabel(data.tier).toUpperCase();
  const businessName = (data.businessName || "MELISSA COMMUNITY PARTNER").toUpperCase();
  const memberId = data.memberId || "CCM-2026-MEMBER";
  const validThrough = data.validThrough || "2026 – 2027";

  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
  bgGrad.addColorStop(0, "#0B0E14");
  bgGrad.addColorStop(0.5, "#151922");
  bgGrad.addColorStop(1, "#0B0E14");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 800);

  ctx.strokeStyle = "#A81C24";
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, 1140, 740);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 46, 1108, 708);

  const ribbonGrad = ctx.createLinearGradient(0, 70, 0, 150);
  ribbonGrad.addColorStop(0, "#7A141A");
  ribbonGrad.addColorStop(1, "#A81C24");
  ctx.fillStyle = ribbonGrad;
  ctx.fillRect(50, 70, 1100, 90);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("COMMUNITY COMMERCE MELISSA, TX", 600, 125);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("OFFICIAL VERIFIED BUSINESS MEMBER", 600, 205);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 48px sans-serif";
  ctx.fillText(`2026 ${cleanTier}`, 600, 275);

  const lineGrad = ctx.createLinearGradient(300, 0, 900, 0);
  lineGrad.addColorStop(0, "rgba(220, 38, 38, 0)");
  lineGrad.addColorStop(0.5, "rgba(220, 38, 38, 1)");
  lineGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(300, 310);
  ctx.lineTo(900, 310);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fillRect(150, 350, 900, 140);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.strokeRect(150, 350, 900, 140);

  ctx.fillStyle = "#EF4444";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("OFFICIALLY ISSUED TO:", 600, 385);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 38px sans-serif";
  ctx.fillText(businessName, 600, 445);

  ctx.fillStyle = "rgba(168, 28, 36, 0.15)";
  ctx.fillRect(150, 530, 420, 160);
  ctx.strokeStyle = "rgba(168, 28, 36, 0.4)";
  ctx.strokeRect(150, 530, 420, 160);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("MEMBER ID NUMBER", 180, 570);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 32px monospace";
  ctx.fillText(memberId, 180, 620);
  ctx.fillStyle = "#22C55E";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("✓ VERIFIED ACTIVE", 180, 660);

  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fillRect(630, 530, 420, 160);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.strokeRect(630, 530, 420, 160);

  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("MEMBERSHIP TERM", 660, 570);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 32px sans-serif";
  ctx.fillText(validThrough, 660, 620);
  ctx.fillStyle = "#94A3B8";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("Melissa, Collin County, TX", 660, 660);
}

export function createBadgeCanvas(data: BadgeRenderData): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create a badge canvas.");
  }
  drawMemberBadge(ctx, data);
  return canvas;
}

export function renderBadgePngDataUrl(data: BadgeRenderData): string {
  return createBadgeCanvas(data).toDataURL("image/png");
}

export async function renderBadgePngBlob(data: BadgeRenderData): Promise<Blob> {
  const canvas = createBadgeCanvas(data);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
  if (!blob) {
    const fallback = await fetch(canvas.toDataURL("image/png"));
    return fallback.blob();
  }
  return blob;
}

export function triggerPngDownload(blob: Blob, memberId: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = badgePngFilename(memberId);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
