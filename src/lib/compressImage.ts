import pica from "pica";

export const compressImage = async (
  file: File,
  targetWidth = 600,
  targetHeight = 800,
  backgroundColor = "#ffffff"
): Promise<File> => {
  const img = new Image();
  const reader = new FileReader();

  const imgLoaded = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  reader.onload = () => {
    img.src = reader.result as string;
  };
  reader.readAsDataURL(file);
  await imgLoaded;

  const originalCanvas = document.createElement("canvas");
  originalCanvas.width = img.width;
  originalCanvas.height = img.height;
  const ctx = originalCanvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");
  ctx.drawImage(img, 0, 0);

  // Create target canvas (with white background)
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = targetWidth;
  outputCanvas.height = targetHeight;

  const outCtx = outputCanvas.getContext("2d")!;
  outCtx.fillStyle = backgroundColor;
  outCtx.fillRect(0, 0, targetWidth, targetHeight);

  // Calculate scaling and centering
  const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (targetWidth - drawWidth) / 2;
  const offsetY = (targetHeight - drawHeight) / 2;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = drawWidth;
  tempCanvas.height = drawHeight;

  await pica().resize(originalCanvas, tempCanvas);

  outCtx.drawImage(tempCanvas, offsetX, offsetY);

  return new Promise<File>((resolve, reject) => {
    outputCanvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas toBlob failed"));
      resolve(new File([blob], file.name, { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
  });
};

export default compressImage;