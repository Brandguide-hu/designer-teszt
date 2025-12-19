import { nanoid } from 'nanoid';

export function generateShareId(): string {
  return nanoid(8);
}

export function generateShareUrl(primaryType: string, secondaryType: string): string {
  const shareId = generateShareId();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://teszt.brandguide.hu';

  return `${baseUrl}/eredmeny/${primaryType}?alt=${secondaryType}&s=${shareId}`;
}

export function getShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  };
}
