export const loadImage = async (url?: string): Promise<string | null> => {
  if (!url) return null;

  const img = new Image();
  img.src = url;

  return new Promise<string | null>((resolve): void => {
    img.onload = (): void => {
      resolve(url);
    };

    img.onerror = (): void => {
      resolve(null);
    };
  });
};
