import fs from "node:fs";
import path from "node:path";

const SUPPORTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const galleryRootDir = path.join(
  process.cwd(),
  "public",
  "images",
  "executives",
  "gallery",
);

function toPublicImagePath(year: string, fileName: string): string {
  return `/images/executives/gallery/${encodeURIComponent(year)}/${encodeURIComponent(fileName)}`;
}

export function getExecutiveGalleryImages(year: string): string[] {
  const galleryDir = path.join(galleryRootDir, year);

  if (!fs.existsSync(galleryDir)) {
    return [];
  }

  const files = fs
    .readdirSync(galleryDir)
    .filter((name) => {
      const ext = path.extname(name).toLowerCase();
      return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
    })
    .sort((a, b) => a.localeCompare(b));

  return files.map((name) => toPublicImagePath(year, name));
}

export function getExecutiveGalleryYears(): string[] {
  if (!fs.existsSync(galleryRootDir)) {
    return [];
  }

  return fs
    .readdirSync(galleryRootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => b.localeCompare(a));
}
