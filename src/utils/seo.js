const SITE_ORIGIN = "https://sita-rama-putharekulu.vercel.app";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-image.svg`;

const setNodeContent = (selector, createNode, content) => {
  if (typeof document === "undefined") {
    return null;
  }

  let node = document.head.querySelector(selector);

  if (!node) {
    node = createNode();
    document.head.appendChild(node);
  }

  if (content !== undefined) {
    node.setAttribute("content", content);
  }

  return node;
};

const setLinkHref = (selector, createNode, href) => {
  if (typeof document === "undefined") {
    return null;
  }

  let node = document.head.querySelector(selector);

  if (!node) {
    node = createNode();
    document.head.appendChild(node);
  }

  node.setAttribute("href", href);
  return node;
};

export const setSeoMeta = ({
  title,
  description,
  keywords,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
  type = "website",
}) => {
  if (typeof document === "undefined") {
    return;
  }

  const canonicalUrl = new URL(path, SITE_ORIGIN).toString();

  document.title = title;

  setNodeContent(
    'meta[name="description"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("name", "description");
      return node;
    },
    description
  );

  setNodeContent(
    'meta[name="keywords"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("name", "keywords");
      return node;
    },
    keywords ||
      "Atreyapuram Putharekulu, homemade sweets, Andhra sweets, traditional sweets, pure ghee sweets, online sweets delivery"
  );

  setNodeContent(
    'meta[name="robots"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("name", "robots");
      return node;
    },
    noindex
      ? "noindex,nofollow"
      : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
  );

  setNodeContent(
    'meta[property="og:type"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:type");
      return node;
    },
    type
  );

  setNodeContent(
    'meta[property="og:site_name"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:site_name");
      return node;
    },
    "Sita Rama Putharekulu"
  );

  setNodeContent(
    'meta[property="og:title"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:title");
      return node;
    },
    title
  );

  setNodeContent(
    'meta[property="og:description"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:description");
      return node;
    },
    description
  );

  setNodeContent(
    'meta[property="og:url"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:url");
      return node;
    },
    canonicalUrl
  );

  setNodeContent(
    'meta[property="og:image"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:image");
      return node;
    },
    image
  );

  setNodeContent(
    'meta[property="og:image:alt"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("property", "og:image:alt");
      return node;
    },
    "Sita Rama Putharekulu - authentic handmade Atreyapuram sweets"
  );

  setNodeContent(
    'meta[name="twitter:card"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("name", "twitter:card");
      return node;
    },
    "summary_large_image"
  );

  setNodeContent(
    'meta[name="twitter:title"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("name", "twitter:title");
      return node;
    },
    title
  );

  setNodeContent(
    'meta[name="twitter:description"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("name", "twitter:description");
      return node;
    },
    description
  );

  setNodeContent(
    'meta[name="twitter:image"]',
    () => {
      const node = document.createElement("meta");
      node.setAttribute("name", "twitter:image");
      return node;
    },
    image
  );

  setLinkHref(
    'link[rel="canonical"]',
    () => {
      const node = document.createElement("link");
      node.setAttribute("rel", "canonical");
      return node;
    },
    canonicalUrl
  );
};

export const setPreloadImage = ({ id, href, type = "image/jpeg" }) => {
  if (typeof document === "undefined") {
    return () => {};
  }

  let node = document.getElementById(id);

  if (!node) {
    node = document.createElement("link");
    node.id = id;
    node.rel = "preload";
    node.as = "image";
    node.type = type;
    node.fetchPriority = "high";
    document.head.appendChild(node);
  }

  node.setAttribute("href", href);

  return () => {
    node?.remove();
  };
};

export const setStructuredData = (id, value) => {
  if (typeof document === "undefined") {
    return () => {};
  }

  let node = document.getElementById(id);

  if (!node) {
    node = document.createElement("script");
    node.id = id;
    node.type = "application/ld+json";
    document.head.appendChild(node);
  }

  node.textContent = JSON.stringify(value);

  return () => {
    node?.remove();
  };
};