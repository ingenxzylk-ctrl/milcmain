import { imageSourceToBlob } from "./compressImage";

export async function precheckPhotoQuality(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string") {
    return { ok: false, reasons: ["Image unclear"], message: "Please upload a proper image." };
  }

  try {
    const blob = await imageSourceToBlob(dataUrl);
    let bitmap;
    try {
      bitmap = await createImageBitmap(blob);
    } catch {
      return { ok: true };
    }
    const maxSide = 320;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(32, Math.round(bitmap.width * scale));
    const h = Math.max(32, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      bitmap.close?.();
      return { ok: true };
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const { data } = ctx.getImageData(0, 0, w, h);

    let sum = 0;
    let darkCount = 0;
    const pixels = w * h;
    const gray = new Float32Array(pixels);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const y = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      gray[p] = y;
      sum += y;
      if (y < 40) darkCount += 1;
    }
    const mean = sum / pixels;
    let edgeSum = 0;
    let edgeCount = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const gx = gray[i + 1] - gray[i - 1];
        const gy = gray[i + w] - gray[i - w];
        edgeSum += gx * gx + gy * gy;
        edgeCount += 1;
      }
    }
    const sharpness = edgeCount ? edgeSum / edgeCount : 0;
    const darkRatio = darkCount / pixels;
    const reasons = [];
    if (mean < 55 || darkRatio > 0.62) reasons.push("Insufficient lighting / too dark");
    if (sharpness < 90) reasons.push("Image unclear / blurry");
    if (!reasons.length) return { ok: true };
    return {
      ok: false,
      reasons,
      message: `Please upload a clearer photo. ${reasons.join("; ")}. Use natural light, no makeup, and no filters.`,
    };
  } catch {
    return { ok: true };
  }
}
