export const getLinkMetadata = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();
  const match = html.match(
    /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i
  );
  const descriptionMatch = html.match(
    /<meta\s+name="description"\s+content="([^"]+)"/i
  );
  const description = descriptionMatch ? descriptionMatch[1] : "";
  let image = match ? match[1] : "";
  if (image.startsWith("/")) {
    const urlObj = new URL(url);
    image = urlObj.origin + image;
  }
  return { description, image, url };
};

export const getLinks = (content: string) => {
  const links = content.match(/https?:\/\/\S+/g);
  return links ? links : [];
};

export const parseContent = (content: string) => {
  const link = getLinks(content)[0];
  const metadata = getLinkMetadata(link);
  return metadata;
};
