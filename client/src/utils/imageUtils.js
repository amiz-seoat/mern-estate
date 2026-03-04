const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const DEFAULT_QUALITY = 0.8;

export async function compressImage(file, { maxWidth = MAX_WIDTH, maxHeight = MAX_HEIGHT, quality = DEFAULT_QUALITY } = {}) {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width <= maxWidth && height <= maxHeight && file.size < 500_000) {
    bitmap.close();
    return file;
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let blob;
  try {
    blob = await canvas.convertToBlob({ type: "image/webp", quality });
  } catch {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  }

  const ext = blob.type === "image/webp" ? ".webp" : ".jpg";
  const name = file.name.replace(/\.[^.]+$/, ext);
  return new File([blob], name, { type: blob.type, lastModified: Date.now() });
}
