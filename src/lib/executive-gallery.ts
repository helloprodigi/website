import { EXECUTIVE_GALLERY_FILES_BY_YEAR } from "@/data/executive-gallery";

function toPublicImagePath(year: string, fileName: string): string {
  return `/images/executives/gallery/${encodeURIComponent(year)}/${encodeURIComponent(fileName)}`;
}

export function getExecutiveGalleryImages(year: string): string[] {
  const files = EXECUTIVE_GALLERY_FILES_BY_YEAR[year] ?? [];

  return files.map((name) => toPublicImagePath(year, name));
}

export function getExecutiveGalleryYears(): string[] {
  return Object.entries(EXECUTIVE_GALLERY_FILES_BY_YEAR)
    .filter(([, files]) => files.length > 0)
    .map(([year]) => year)
    .sort((a, b) => b.localeCompare(a));
}
