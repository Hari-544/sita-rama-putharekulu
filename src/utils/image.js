const CLOUDINARY_UPLOAD_SEGMENT = "/upload/";

const createCloudinaryTransform = (width, square = false) =>
  square
    ? `f_auto,q_auto,c_fill,g_auto,w_${width},h_${width}`
    : `f_auto,q_auto,c_limit,w_${width}`;

export const optimizeCloudinaryImage = (
  src,
  width = 600
) => {
  if (
    typeof src !== "string" ||
    !src.includes("res.cloudinary.com") ||
    !src.includes(CLOUDINARY_UPLOAD_SEGMENT)
  ) {
    return src;
  }

  const transforms = createCloudinaryTransform(width, false);

  return src.replace(
    CLOUDINARY_UPLOAD_SEGMENT,
    `${CLOUDINARY_UPLOAD_SEGMENT}${transforms}/`
  );
};

export const optimizeCloudinarySquareImage = (
  src,
  width = 600
) => {
  if (
    typeof src !== "string" ||
    !src.includes("res.cloudinary.com") ||
    !src.includes(CLOUDINARY_UPLOAD_SEGMENT)
  ) {
    return src;
  }

  const transforms = createCloudinaryTransform(width, true);

  return src.replace(
    CLOUDINARY_UPLOAD_SEGMENT,
    `${CLOUDINARY_UPLOAD_SEGMENT}${transforms}/`
  );
};

export const cloudinarySrcSet = (
  src,
  widths = [320, 480, 600, 768, 960]
) => {
  if (
    typeof src !== "string" ||
    !src.includes("res.cloudinary.com")
  ) {
    return undefined;
  }

  return widths
    .map(
      (width) =>
        `${optimizeCloudinaryImage(src, width)} ${width}w`
    )
    .join(", ");
};

export const cloudinarySquareSrcSet = (
  src,
  widths = [320, 480, 600, 768, 960]
) => {
  if (
    typeof src !== "string" ||
    !src.includes("res.cloudinary.com")
  ) {
    return undefined;
  }

  return widths
    .map(
      (width) =>
        `${optimizeCloudinarySquareImage(src, width)} ${width}w`
    )
    .join(", ");
};
