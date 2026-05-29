import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

import Footer from "../components/Footer";
import hero from "../assets/premiumHero.jpg";
import storyImage from "../assets/images/jaggery.jpg";
import { db } from "../firebase";
import {
  cloudinarySrcSet,
  cloudinarySquareSrcSet,
  optimizeCloudinaryImage,
  optimizeCloudinarySquareImage,
} from "../utils/image";
import {
  setPreloadImage,
  setSeoMeta,
} from "../utils/seo";

const DELIVERY_STEPS = ["Preparing", "Packed", "Shipped", "Delivered"];

const PRODUCT_CARD_BADGES = ["Handmade", "Pure Ghee"];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const pageShell = "responsive-shell";

const BRAND_PILLARS = [
  "Freshly prepared only after order",
  "No stored sweets, ever",
  "Traditional Atreyapuram preparation",
  "Pure ingredients and handcrafted quality",
];

const formatPrice = (value) => {
  const amount = Number(value);
  return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
};

const normalizeCategory = (value) => {
  if (!value) return "Uncategorized";
  return String(value).trim() || "Uncategorized";
};

const toMillis = (value) => {
  if (!value) return 0;

  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const sortProducts = (items) =>
  [...items].sort((left, right) => {
    const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    const dateDelta = toMillis(right.createdAt) - toMillis(left.createdAt);

    if (dateDelta !== 0) {
      return dateDelta;
    }

    return String(left.name || "").localeCompare(String(right.name || ""));
  });

const loadFallbackProducts = async () => {
  const { products } = await import("../data/products");
  return products.map((product) => ({
    ...product,
    id: String(product.id),
  }));
};

const scheduleIdleTask = (callback) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, {
      timeout: 1200,
    });

    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, 250);
  return () => window.clearTimeout(id);
};

const getCurrentStepIndex = (status) => {
  const currentStatus = status || "Preparing";
  const index = DELIVERY_STEPS.indexOf(currentStatus);
  return index === -1 ? 0 : index;
};

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = value?.toDate
    ? value.toDate()
    : value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

function DeferredSection({
  id,
  minHeight = 720,
  rootMargin = "360px",
  render,
}) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (shouldRender) {
      return undefined;
    }

    const element = ref.current;

    if (!element || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div
      id={id}
      ref={ref}
      className="perf-deferred"
      style={{
        minHeight: shouldRender ? undefined : minHeight,
      }}
    >
      {shouldRender ? render() : null}
    </div>
  );
}

const FAQS = [
  {
    question: "Are the sweets freshly prepared?",
    answer:
      "Every order is freshly prepared only after receiving your order. We do not store previously prepared sweets, ensuring authentic taste, freshness, and premium quality.",
  },
  {
    question: "Do you store sweets before shipping?",
    answer:
      "No. We prepare sweets only after an order is placed. Our goal is to deliver freshly made traditional sweets directly to our customers.",
  },
  {
    question: "How long do Putharekulu stay fresh?",
    answer:
      "Putharekulu stay fresh for approximately 10 days when stored properly in a cool and dry place away from direct sunlight.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 3–5 business days depending on your location and courier service availability.",
  },
  {
    question: "What ingredients are used in your Putharekulu?",
    answer:
      "Our Putharekulu are prepared using premium-quality ingredients such as rice starch sheets, pure ghee, jaggery, sugar, dry fruits, and other traditional ingredients.",
  },
  {
    question: "Do you use pure ghee?",
    answer:
      "Yes. We use quality ingredients, including pure ghee in applicable varieties, to preserve the authentic traditional taste of Atreyapuram Putharekulu.",
  },
  {
    question: "Do you deliver across India?",
    answer:
      "Yes. We provide delivery services across India through trusted courier partners.",
  },
  {
    question: "Can I place bulk orders for events or gifting?",
    answer:
      "Yes. We accept bulk orders for festivals, weddings, corporate gifting, family functions, and other special occasions. For bulk orders and customized requirements, please contact us directly through WhatsApp or phone call and we will be happy to assist you.",
  },
  {
    question: "How can I track my order?",
    answer:
      "After placing an order, you can use your Order ID on the Order Tracking page to check the latest status of your order.",
  },
];

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-orange-600 shadow-sm backdrop-blur-xl">
          {eyebrow}
        </span>

        <h2 className="mt-4 text-[clamp(1.95rem,4vw,3.8rem)] font-black leading-[0.95] tracking-tight text-stone-950">
          {title}
        </h2>

        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function ProductSkeletonCard() {
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_18px_60px_rgba(249,115,22,0.08)] backdrop-blur-xl">
      <div className="p-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-orange-100" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-orange-50" />
        </div>

        <div className="mt-4 fluid-image-frame animate-pulse rounded-[24px] bg-gradient-to-br from-orange-100 via-orange-50 to-amber-100" />

        <div className="mt-5 space-y-3">
          <div className="h-6 w-3/4 animate-pulse rounded-full bg-stone-100" />
          <div className="h-4 w-full animate-pulse rounded-full bg-stone-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-stone-100" />

          <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded-full bg-orange-100" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-white" />
              <div className="h-5 w-5 animate-pulse rounded-full bg-orange-100" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-orange-100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 animate-pulse rounded-2xl bg-orange-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-orange-50" />
          </div>
        </div>
      </div>
    </article>
  );
}

const ProductCard = memo(function ProductCard({ product, quantity, onAdd, onDecrease, compact = false }) {
  const inStock = product.stock !== false;
  const isFeatured = Boolean(product.featured);
  const category = normalizeCategory(product.category);
  const imageSrc = optimizeCloudinarySquareImage(product.image || hero, compact ? 480 : 600);
  const sizeText = product.sizes || product.description || "Small & Big Size";

  return (
    <article
      className={`product-render-card group relative w-full overflow-hidden rounded-[30px] border border-orange-100 bg-white shadow-[0_10px_35px_rgba(249,115,22,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(249,115,22,0.18)] ${compact ? "h-full" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/50" />
      <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-orange-200/30 blur-3xl transition duration-500 group-hover:scale-110" />

      <div className={`relative ${compact ? "p-4 sm:p-5" : "p-4 sm:p-5"}`}>
        <div className={`absolute left-4 top-4 z-20 flex flex-wrap gap-2 ${compact ? "right-4" : ""}`}>
          {isFeatured ? (
            <span className="rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-orange-200 sm:px-4 sm:text-[11px]">
              Featured
            </span>
          ) : null}

          <span className="rounded-full border border-orange-100 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-700 shadow-sm backdrop-blur-xl">
            Handmade
          </span>

          <span className="rounded-full border border-orange-100 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-700 shadow-sm backdrop-blur-xl">
            Pure Ghee
          </span>

          {!inStock ? (
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-700 shadow-sm">
              Out of Stock
            </span>
          ) : null}
        </div>

        <button
          type="button"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-orange-500 shadow-lg backdrop-blur-md transition hover:scale-110"
        >
          ❤
        </button>

        <div className={`relative bg-linear-to-b from-orange-50 to-white ${compact ? "p-4" : "p-4"}`}>
          <div className="aspect-square overflow-hidden rounded-[24px] bg-white">
            <img
              src={imageSrc}
              srcSet={cloudinarySquareSrcSet(
                product.image,
                compact
                  ? [320, 420, 560]
                  : [480, 600, 768]
              )}
              sizes={compact
                ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 82vw"
                : "(min-width: 1024px) 33vw, 100vw"}
              alt={product.name || "Premium product"}
              loading="lazy"
              decoding="async"
              draggable="false"
              width="560"
              height="560"
              className={`h-full w-full object-cover transition-transform duration-700 ${compact ? "group-hover:scale-105" : "group-hover:scale-110"}` }
            />
          </div>
        </div>

        <div className={`${compact ? "space-y-4 p-5" : "space-y-5 p-5"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`font-black leading-tight text-stone-900 transition-colors duration-300 group-hover:text-orange-600 ${compact ? "text-[1.08rem] sm:text-[1.18rem]" : "text-[1.25rem]"}`}>
                {product.name || "Premium Putharekulu"}
              </h3>

              <p className={`mt-2 leading-6 text-stone-500 ${compact ? "text-[0.82rem] sm:text-[0.95rem]" : "text-sm"}`}>
                {sizeText}
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 px-3 py-2 text-right border border-green-100">
              <p className={`font-black text-green-700 ${compact ? "text-[0.75rem]" : "text-xs"}`}>
                {inStock ? "● In Stock" : "● Out of Stock"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              {category}
            </span>

            {PRODUCT_CARD_BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-orange-100 bg-white/80 px-3 py-1 text-xs font-bold text-orange-700"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className={`font-black text-orange-700 ${compact ? "text-[2rem] sm:text-[2.15rem]" : "text-3xl"}`}>
                ₹{formatPrice(product.price)}
              </p>

              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-stone-400">
                Freshly Prepared
              </p>
            </div>
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-orange-50 ${compact ? "px-4 py-3" : "px-4 py-3"}`}>
            <span className="text-sm font-bold text-stone-700">
              Quantity
            </span>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onDecrease(product.id)}
                disabled={quantity <= 0}
                aria-label={`Decrease ${product.name}`}
                className={`flex items-center justify-center rounded-full bg-white text-xl font-black text-orange-700 shadow-sm transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40 ${compact ? "h-11 w-11" : "h-11 w-11"}`}
              >
                −
              </button>

              <span className={`w-6 text-center font-black text-stone-900 ${compact ? "text-base" : "text-lg"}`}>
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => onAdd(product)}
                disabled={!inStock}
                aria-label={`Increase ${product.name}`}
                className={`flex items-center justify-center rounded-full bg-orange-600 text-xl font-black text-white shadow-md transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40 ${compact ? "h-11 w-11" : "h-11 w-11"}`}
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onAdd(product)}
              disabled={!inStock}
              className="btn btn-secondary w-full text-sm font-black"
            >
              Add To Cart
            </button>

            <Link
              to="/checkout"
              className="btn btn-primary w-full text-sm font-black"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
});

function HeroSection({ totalProducts, featuredCount, categoryCount, totalCartCount }) {
  const heroStats = [
    { value: totalProducts, label: "Live products" },
    { value: featuredCount, label: "Featured picks" },
    { value: categoryCount, label: "Auto categories" },
    { value: totalCartCount, label: "Items in cart" },
  ];

  return (
    <section className="relative isolate overflow-hidden py-10 lg:py-20">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_24%),linear-gradient(180deg,#fffaf5_0%,#fff7ef_55%,#fffdfb_100%)]" />
      <div className="absolute left-[-6rem] top-24 -z-10 h-56 w-56 rounded-full bg-orange-200/35 blur-3xl" />
      <div className="absolute right-[-5rem] top-10 -z-10 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />

      <div className="mx-auto grid w-full max-w-[1480px] gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 xl:gap-14">
        <div className="space-y-7 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-orange-700 shadow-sm backdrop-blur-xl">
            Authentic Atreyapuram Craftsmanship
          </span>

          <div className="space-y-4">
            <h1 className="max-w-4xl text-[clamp(2.75rem,8vw,6.3rem)] font-black leading-[0.9] tracking-tight text-stone-950">
              Handmade
              <span className="block bg-linear-to-r from-orange-700 via-orange-600 to-amber-500 bg-clip-text text-stone-950">
                Premium Pure
              </span>
              Putharekulu
            </h1>

            <p className="mx-auto max-w-2xl text-[clamp(1rem,1.5vw,1.2rem)] leading-8 text-stone-600 lg:mx-0">
              A premium realtime ecommerce homepage for handcrafted Andhra sweets, built for conversion, trust, and a polished startup-grade shopping experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#featured-products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-600 to-amber-500 px-5 py-2.5 text-sm font-black text-stone-950 shadow-[0_18px_35px_rgba(249,115,22,0.28)] transition duration-300 hover:-translate-y-0.5 hover:from-orange-500 hover:to-amber-400"
            >
              Shop Now
              <span aria-hidden="true">→</span>
            </a>

            <a
              href="#track-order"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-500 bg-orange-500/85 px-5 py-2.5 text-sm font-black text-white-700 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-orange-400 hover:bg-orange-50"
            >
              Track Order
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[22px] border border-white/70 bg-white/80 p-4 text-left shadow-[0_18px_50px_rgba(249,115,22,0.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1"
              >
                <p className="text-2xl font-black tracking-tight text-stone-950">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-10 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[0_16px_40px_rgba(249,115,22,0.1)] backdrop-blur-xl lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">
              Realtime sync
            </p>
            <p className="mt-1 text-sm font-black text-orange-700">
              Firestore live updates
            </p>
          </div>

          <div className="absolute -right-3 bottom-8 hidden rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-[0_16px_40px_rgba(249,115,22,0.1)] backdrop-blur-xl lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">
              Fast delivery
            </p>
            <p className="mt-1 text-sm font-black text-orange-700">
              Built for trust
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-3 shadow-[0_28px_90px_rgba(249,115,22,0.16)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_26%)]" />

            <div className="relative overflow-hidden rounded-[28px] border border-orange-100 bg-white">
              <img
                src={hero}
                alt="Premium Putharekulu"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width="960"
                height="720"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="fluid-image-frame w-full rounded-[28px] object-cover"
              />

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSection({ products, loading, cartMap, onAdd, onDecrease }) {
  if (loading) {
    return (
      <section id="featured-products" className="bg-white rounded-t-[50px] py-16">
        <div className={pageShell}>
          <SectionHeading
            eyebrow="Featured drops"
            title="Featured Products"
            description="High-conviction picks from the current catalog, surfaced in a premium carousel-style layout."
          />

          <div className="mt-8 -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide overscroll-x-contain sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] lg:overflow-visible lg:px-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-[min(82vw,18rem)] snap-start shrink-0 sm:w-[min(20rem,100%)] lg:w-full lg:shrink">
                <ProductSkeletonCard />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section id="featured-products" className="py-4 sm:py-6">
      <div className={pageShell}>
        <SectionHeading
          eyebrow="Featured drops"
          title="Featured Products"
          description="Premium spotlight products selected directly from Firestore using the featured flag."
          action={
            <a
              href="#track-order"
              className="inline-flex items-center gap-2 rounded-full border border-orange-500 bg-white/85 px-5 py-3 text-sm font-black text-orange-700 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-orange-400 hover:bg-orange-50"
            >
              Track an order
            </a>
          }
        />

        <div className="mt-8 -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide overscroll-x-contain sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] lg:overflow-visible lg:px-0">
          {products.map((product) => {
            const quantity = cartMap.get(product.id) || 0;

            return (
              <div key={product.id} className="w-[min(82vw,18rem)] snap-start shrink-0 sm:w-[min(20rem,100%)] lg:w-full lg:shrink">
                <ProductCard
                  product={product}
                  quantity={quantity}
                  onAdd={onAdd}
                  onDecrease={onDecrease}
                  compact
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategorySection({ category, products, cartMap, onAdd, onDecrease }) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="h-full rounded-[38px] border border-orange-100 bg-white/95 p-4 shadow-[0_20px_60px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:p-5 lg:p-6">
      
      {/* HEADER */}
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-orange-100 pb-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-orange-700">
            Shop by category
          </span>

          <h2 className="mt-3 text-[clamp(1.3rem,2vw,2rem)] font-black leading-tight tracking-tight text-stone-950">
            {category}
          </h2>

          <p className="mt-1 text-sm leading-6 text-stone-500">
            Browse premium products in this collection.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-center shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">
            Products
          </p>

          <p className="mt-1 text-xl font-black text-orange-700">
            {products.length}
          </p>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {products.map((product) => {
          const quantity = cartMap.get(product.id) || 0;

          return (
            <div key={product.id} className="h-full">
              <ProductCard
                product={product}
                quantity={quantity}
                onAdd={onAdd}
                onDecrease={onDecrease}
                compact
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TrackOrderSection({
  sectionId = "track-order",
  trackPhone,
  setTrackPhone,
  trackOrderId,
  setTrackOrderId,
  tracking,
  trackedOrder,
  trackError,
  hasSearched,
  onSearch,
}) {
  const currentStep = getCurrentStepIndex(trackedOrder?.status);
  const paymentBadgeClass = trackedOrder?.paymentStatus === "PAID"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : trackedOrder?.paymentStatus === "FAILED"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <section id={sectionId} className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-50 py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#fffaf5_0%,#fffdfb_18%,#fff7ef_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

      <div className={pageShell}>
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-orange-600 shadow-sm backdrop-blur-xl">
            Live tracking
          </span>

          <h2 className="mt-4 text-[clamp(2.2rem,5vw,4.4rem)] font-black leading-[0.92] tracking-tight text-stone-950">
            Track your order in real time
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
            Check payment status, delivery progress, and order details from the same premium homepage experience.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.45fr]">
          <aside className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_24px_70px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600">
                  Secure lookup
                </p>
                <h3 className="mt-2 text-[clamp(1.5rem,2.4vw,2.2rem)] font-black tracking-tight text-stone-950">
                  Find your parcel
                </h3>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">
                  Mobile friendly
                </p>
                <p className="mt-1 text-sm font-black text-orange-700">
                  Fast lookup
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-stone-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Phone number used at checkout"
                  value={trackPhone}
                  onChange={(event) => setTrackPhone(event.target.value)}
                  className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-stone-700">
                  Razorpay Order ID
                </label>
                <input
                  type="text"
                  placeholder="Order ID from payment"
                  value={trackOrderId}
                  onChange={(event) => setTrackOrderId(event.target.value)}
                  className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <button
                type="button"
                onClick={onSearch}
                disabled={tracking}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-orange-600 to-amber-500 px-6 py-4 text-lg font-black text-black shadow-lg shadow-orange-200 transition duration-300 hover:-translate-y-0.5 hover:from-orange-500 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {tracking ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Searching...
                  </>
                ) : (
                  "Track Order"
                )}
              </button>

              <p className="text-xs leading-6 text-stone-500">
                Enter the same phone number and Razorpay order ID used during checkout.
              </p>
            </div>

            {trackError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {trackError}
              </div>
            ) : null}

            {tracking ? (
              <div className="mt-6 space-y-3 rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-4">
                <div className="h-5 w-1/2 animate-pulse rounded-full bg-orange-200" />
                <div className="h-4 w-full animate-pulse rounded-full bg-orange-100" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-orange-100" />
                <div className="h-32 rounded-[1.25rem] bg-white/80" />
              </div>
            ) : null}

            {!tracking && !trackedOrder && !trackError ? (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-orange-200 bg-orange-50/60 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                  🧡
                </div>
                <h4 className="mt-4 text-lg font-black text-stone-950">
                  Ready to track
                </h4>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Your order timeline will appear here once a valid order is found.
                </p>
              </div>
            ) : null}
          </aside>

          <article className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_24px_70px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:p-6 lg:p-8">
            {tracking ? (
              <div className="space-y-5 rounded-[1.75rem] border border-orange-100 bg-gradient-to-b from-orange-50 to-white p-6">
                <div className="h-8 w-2/5 animate-pulse rounded-full bg-orange-100" />
                <div className="h-5 w-1/4 animate-pulse rounded-full bg-orange-100" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-20 animate-pulse rounded-2xl bg-white" />
                  <div className="h-20 animate-pulse rounded-2xl bg-white" />
                </div>
                <div className="h-44 animate-pulse rounded-[1.5rem] bg-white" />
              </div>
            ) : !trackedOrder ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-orange-200 bg-gradient-to-b from-orange-50/70 to-white p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-sm">
                  📍
                </div>
                <h3 className="mt-5 text-[clamp(1.5rem,2.8vw,2.2rem)] font-black text-stone-950">
                  {hasSearched ? "No Order Found" : "Search for an order"}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-stone-500">
                  {hasSearched
                    ? "Try again with the exact phone number and Razorpay order ID used at checkout."
                    : "Enter your phone number and Razorpay order ID to see the live delivery progress, order details, and products."}
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="overflow-hidden rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600">
                          Order overview
                        </p>
                        <h3 className="mt-2 text-[clamp(1.8rem,3vw,2.7rem)] font-black tracking-tight text-stone-950">
                          {trackedOrder.customerName || "Customer"}
                        </h3>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                            Phone Number
                          </p>
                          <p className="mt-1 text-sm font-semibold text-stone-950">
                            {trackedOrder.phone || "Not available"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-orange-100">
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                            Created Date
                          </p>
                          <p className="mt-1 text-sm font-semibold text-stone-950">
                            {formatDate(trackedOrder.createdAt)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-orange-100 sm:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                            Delivery Address
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-6 text-stone-950">
                            {trackedOrder.address || "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[260px] xl:grid-cols-1">
                      <div className="rounded-2xl bg-white/95 px-4 py-4 shadow-sm ring-1 ring-orange-100">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                          Order ID
                        </p>
                        <p className="mt-1 break-all text-sm font-black text-stone-950">
                          {trackedOrder.razorpayOrderId || trackedOrder.id}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/95 px-4 py-4 shadow-sm ring-1 ring-orange-100">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">
                          Order Amount
                        </p>
                        <p className="mt-1 text-3xl font-black tracking-tight text-orange-700">
                          ₹{formatPrice(trackedOrder.totalAmount)}
                        </p>
                      </div>

                      <div className={`rounded-2xl border px-4 py-4 shadow-sm ${paymentBadgeClass}`}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-70">
                          Payment Status
                        </p>
                        <p className="mt-1 text-sm font-black">
                          {trackedOrder.paymentStatus || "PENDING"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600">
                        Delivery progress
                      </p>
                      <h4 className="mt-2 text-[clamp(1.35rem,2.2vw,2rem)] font-black text-stone-950">
                        Live status
                      </h4>
                    </div>

                    <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                      Current: {trackedOrder.status || "Preparing"}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 right-4 top-4 hidden h-0.5 bg-stone-200 sm:block" />

                    <div className="grid gap-4 sm:grid-cols-4 sm:gap-2">
                      {DELIVERY_STEPS.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        const isFuture = index > currentStep;

                        return (
                          <div
                            key={step}
                            className="relative z-10 flex flex-col items-start gap-3 rounded-[1.25rem] border border-orange-100 bg-orange-50/30 p-4 sm:items-center sm:text-center"
                          >
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-black transition ${isCompleted
                                ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_0_8px_rgba(16,185,129,0.12)]"
                                : isActive
                                  ? "border-orange-600 bg-orange-600 text-white shadow-[0_0_0_8px_rgba(249,115,22,0.16)]"
                                  : "border-stone-300 bg-white text-stone-400"
                                }`}
                            >
                              {isCompleted ? "✓" : index + 1}
                            </div>

                            <div className="space-y-1 sm:max-w-[120px]">
                              <p className={`text-sm font-black ${isActive ? "text-stone-950" : isCompleted ? "text-emerald-700" : "text-stone-500"}`}>
                                {step}
                              </p>
                              <p className={`text-xs leading-5 ${isFuture ? "text-stone-400" : "text-stone-500"}`}>
                                {isCompleted ? "Completed" : isActive ? "In progress" : "Pending"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600">
                        Products
                      </p>
                      <h4 className="mt-2 text-[clamp(1.35rem,2.2vw,2rem)] font-black text-stone-950">
                        Ordered items
                      </h4>
                    </div>

                    <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                      {trackedOrder.products?.length || 0} item(s)
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                    {trackedOrder.products?.map((product, index) => (
                      <article
                        key={`${product.name || "item"}-${index}`}
                        className="group overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/60 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(249,115,22,0.12)]"
                      >
                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                          <div className="fluid-image-frame w-full overflow-hidden rounded-2xl bg-orange-100 sm:w-24 sm:flex-shrink-0">
                            <img
                              src={optimizeCloudinarySquareImage(
                                product.image || hero,
                                200
                              )}
                              srcSet={cloudinarySquareSrcSet(
                                product.image,
                                [160, 200, 320]
                              )}
                              sizes="(min-width: 640px) 6rem, 100vw"
                              alt={product.name || "Order item"}
                              loading="lazy"
                              decoding="async"
                              width="240"
                              height="180"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h5 className="text-lg font-black text-stone-950">
                                  {product.name}
                                </h5>
                                <p className="mt-1 text-sm text-stone-500">
                                  Quantity and item price
                                </p>
                              </div>

                              <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-700">
                                Qty {product.quantity}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-dashed border-orange-100 pt-3">
                              <p className="text-sm font-semibold text-stone-500">
                                Unit Price
                              </p>
                              <p className="text-xl font-black text-orange-700">
                                ₹{formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [trackPhone, setTrackPhone] = useState("");
  const [trackOrderId, setTrackOrderId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const cartMap = useMemo(
    () => new Map(cart.map((item) => [item.id, item.quantity])),
    [cart]
  );

  const totalCartCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    const cleanupPreload = setPreloadImage({
      id: "home-hero-preload",
      href: hero,
      type: "image/jpeg",
    });

    setSeoMeta({
      title: "Sita Rama Putharekulu | Authentic Atreyapuram Putharekulu Online",
      description:
        "Buy authentic handmade Atreyapuram Putharekulu online. Freshly prepared homemade sweets made only after order using pure ghee, jaggery, and premium ingredients.",
      path: "/",
      image: "/og-image.svg",
      keywords:
        "Atreyapuram Putharekulu, homemade sweets, Andhra sweets, traditional sweets, pure ghee sweets, online sweets delivery, handmade sweets, freshly prepared sweets, authentic Atreyapuram Putharekulu, traditional handmade sweets",
    });

    return () => cleanupPreload();
  }, []);

  const normalizedProducts = useMemo(() => sortProducts(products), [products]);

  const featuredProducts = useMemo(
    () => normalizedProducts.filter((product) => product.featured),
    [normalizedProducts]
  );

  const categorySections = useMemo(() => {
    const grouped = new Map();

    normalizedProducts.forEach((product) => {
      const category = normalizeCategory(product.category);

      if (!grouped.has(category)) {
        grouped.set(category, []);
      }

      grouped.get(category).push(product);
    });

    return Array.from(grouped.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [normalizedProducts]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let isActive = true;
    let cancelIdleTask = () => {};

    const loadProducts = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "products")
        );

        if (!isActive) {
          return;
        }

        setProducts(
          snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );
      } catch (setupError) {
        console.error("Failed to load products:", setupError);

        const fallback = await loadFallbackProducts();

        if (isActive) {
          setProducts(fallback);
        }
      } finally {
        if (isActive) {
          setProductsLoading(false);
        }
      }
    };

    cancelIdleTask = scheduleIdleTask(loadProducts);

    return () => {
      isActive = false;
      cancelIdleTask();
    };
  }, []);

  const addToCart = useCallback((product) => {
    if (product.stock === false) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart((currentCart) => {
      const itemExists = currentCart.find((item) => item.id === id);

      if (!itemExists) {
        return currentCart;
      }

      return currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const searchTrackedOrder = async () => {
    try {
      const sanitizedPhone = trackPhone.trim();
      const sanitizedOrderId = trackOrderId.trim();

      if (!sanitizedPhone || !sanitizedOrderId) {
        setTrackedOrder(null);
        setTrackError("Enter both phone number and Razorpay order ID");
        setHasSearched(true);
        return;
      }

      setTracking(true);
      setTrackError("");
      setTrackedOrder(null);
      setHasSearched(true);

      const snapshot = await getDocs(
        query(
          collection(db, "orders"),
          where("phone", "==", sanitizedPhone),
          where("razorpayOrderId", "==", sanitizedOrderId)
        )
      );

      const foundOrder = snapshot.docs[0]
        ? {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          }
        : null;

      if (foundOrder) {
        setTrackedOrder(foundOrder);
      } else {
        setTrackError("Order not found");
      }
    } catch {
      setTrackError("Something went wrong");
    } finally {
      setTracking(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf5]">
      <header className="sticky top-0 z-50 border-b border-orange-100/80 bg-white/88 shadow-[0_10px_30px_rgba(249,115,22,0.06)] backdrop-blur-xl">
        <div className={`${pageShell} flex items-center justify-between py-4 sm:py-5`}>
          <Link to="/" className="leading-none transition hover:opacity-90">
            <h1 className="text-[clamp(1.1rem,2vw,1.75rem)] font-black tracking-tight text-stone-950">
              SITA RAMA
            </h1>

            <span className="text-[10px] font-black uppercase tracking-[0.34em] text-orange-600 sm:text-xs">
              Putharekulu
            </span>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#featured-products"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-orange-50 hover:text-orange-700 md:inline-flex"
            >
              Featured
            </a>

            <a
              href="#track-order"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-orange-50 hover:text-orange-700 md:inline-flex"
            >
              Track
            </a>

            <Link
              to="/reviews"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-stone-600 transition hover:bg-orange-50 hover:text-orange-700 lg:inline-flex"
            >
              Reviews
            </Link>

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-orange-600 to-amber-500 px-4 py-2.5 text-sm font-black text-stone-950 shadow-lg shadow-orange-200 transition duration-300 hover:-translate-y-0.5 hover:from-orange-500 hover:to-amber-400 sm:px-5"
            >
              Cart
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-orange-700">
                {totalCartCount}
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <HeroSection
        totalProducts={normalizedProducts.length}
        featuredCount={featuredProducts.length}
        categoryCount={categorySections.length}
        totalCartCount={totalCartCount}
      />

      <section className="py-8 sm:py-12 lg:py-16">
        <div className={pageShell}>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center xl:gap-10">
            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-[0_20px_70px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:p-4">
              <div className="fluid-image-frame overflow-hidden rounded-[1.5rem] bg-orange-50">
                <img
                  src={storyImage}
                  alt="Freshly prepared Atreyapuram Putharekulu sweets"
                  loading="lazy"
                  decoding="async"
                  width="960"
                  height="720"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </div>

            <div className="space-y-5 rounded-[2rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/60 to-amber-50/40 p-6 shadow-[0_20px_70px_rgba(249,115,22,0.08)] sm:p-8 lg:p-10">
              <SectionHeading
                eyebrow="Brand Story"
                title="Why Choose Sita Rama Putharekulu"
                description="At Sita Rama Putharekulu, every sweet is freshly prepared only after receiving your order to ensure authentic taste, freshness, and premium quality. We do not store previously prepared sweets. Our handmade Atreyapuram Putharekulu are crafted using traditional recipes, pure ingredients, and careful preparation methods passed through generations, making every order a fresh, premium homemade sweet experience."
              />

              <p className="text-sm leading-7 text-stone-600 sm:text-base">
                This is our promise for customers looking for authentic Atreyapuram Putharekulu, pure ghee sweets, and traditional homemade sweets delivered with care.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {BRAND_PILLARS.map((pillar) => (
                  <div
                    key={pillar}
                    className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white/90 px-4 py-4 shadow-sm"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-700">
                      ✓
                    </span>
                    <p className="text-sm font-semibold leading-6 text-stone-700">
                      {pillar}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main>
        <FeaturedSection
          products={featuredProducts}
          loading={productsLoading}
          cartMap={cartMap}
          onAdd={addToCart}
          onDecrease={decreaseQty}
        />

        <DeferredSection
          minHeight={900}
          render={() =>
            productsLoading ? (
          <section className="py-6 sm:py-8">
            <div className={pageShell}>
              <SectionHeading
                eyebrow="Shop by category"
                title="Signature Collection"
                description="Realtime Firestore-driven product categories with premium cards and conversion-focused spacing."
              />

              <div className="mt-8 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductSkeletonCard key={index} />
                ))}
              </div>
            </div>
          </section>
        ) : categorySections.length ? (
          <section className="py-6 sm:py-8">
            <div className={pageShell}>
              <SectionHeading
                eyebrow="Shop by category"
                title="Signature Collection"
                description="Browse products grouped by category in a side-by-side responsive grid for faster scanning and less scrolling."
              />

              <div className="mt-8 grid grid-cols-1 gap-8 2xl:grid-cols-2">
                {categorySections.map((section) => (
                    <CategorySection
                    key={section.category}
                    category={section.category}
                    products={section.items}
                    cartMap={cartMap}
                    onAdd={addToCart}
                    onDecrease={decreaseQty}
                    />
                ))}
            </div>
            </div>
          </section>
        ) : (
          <section className="py-10 sm:py-16">
            <div className={pageShell}>
              <div className="rounded-[2rem] border border-dashed border-orange-200 bg-white/85 p-8 text-center shadow-[0_20px_60px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl shadow-sm">
                  🍬
                </div>
                <h2 className="mt-5 text-2xl font-black text-stone-950">
                  No products available yet
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Add products in Firebase to automatically populate the featured and category sections.
                </p>
              </div>
            </div>
          </section>
            )
          }
        />

        <DeferredSection
          id="track-order"
          minHeight={760}
          render={() => (
            <TrackOrderSection
              sectionId={undefined}
          trackPhone={trackPhone}
          setTrackPhone={setTrackPhone}
          trackOrderId={trackOrderId}
          setTrackOrderId={setTrackOrderId}
          tracking={tracking}
          trackedOrder={trackedOrder}
          trackError={trackError}
          hasSearched={hasSearched}
              onSearch={searchTrackedOrder}
            />
          )}
        />
      </main>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-orange-50">
  <div className={pageShell}>
    <div className="mx-auto max-w-4xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-orange-600 shadow-sm">
        FAQ
      </span>

      <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-black text-stone-950">
        Frequently Asked Questions
      </h2>

      <p className="mt-4 text-stone-600 leading-7">
        Everything you need to know about our freshly prepared homemade
        Atreyapuram Putharekulu.
      </p>
    </div>

    <div className="mx-auto mt-10 max-w-5xl space-y-4">
      {FAQS.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-stone-900">
            <span>{faq.question}</span>

            <span className="text-2xl text-orange-600 transition group-open:rotate-45">
              +
            </span>
          </summary>

          <p className="mt-4 leading-7 text-stone-600">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  </div>
</section>

      <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-full border border-orange-100 bg-white/95 px-3 py-2 shadow-[0_18px_50px_rgba(249,115,22,0.18)] backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold text-stone-600">
          <a href="#" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">🏠</span>
            Home
          </a>

          <a href="#featured-products" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">⭐</span>
            Featured
          </a>

          <a href="#track-order" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">📦</span>
            Track
          </a>

          <Link to="/cart" className="flex flex-col items-center gap-1 rounded-full px-2 py-2 transition hover:bg-orange-50 hover:text-orange-700">
            <span className="text-base">🛒</span>
            Cart
          </Link>
        </div>
      </nav>

      

      <Footer />
    </div>
  );
}

export default HomePage;
