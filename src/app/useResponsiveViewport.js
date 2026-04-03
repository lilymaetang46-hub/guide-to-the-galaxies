import { useEffect, useState } from "react";

const FALLBACK_VIEWPORT = {
  width: 1280,
  height: 800,
  isCoarsePointer: false,
};

function readViewport() {
  if (typeof window === "undefined") {
    return FALLBACK_VIEWPORT;
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isCoarsePointer:
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches,
  };
}

export default function useResponsiveViewport() {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const coarsePointerQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: coarse)")
        : null;

    const updateViewport = () => {
      setViewport((current) => {
        const next = readViewport();
        if (
          current.width === next.width &&
          current.height === next.height &&
          current.isCoarsePointer === next.isCoarsePointer
        ) {
          return current;
        }

        return next;
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    if (coarsePointerQuery) {
      coarsePointerQuery.addEventListener("change", updateViewport);
    }

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);

      if (coarsePointerQuery) {
        coarsePointerQuery.removeEventListener("change", updateViewport);
      }
    };
  }, []);

  return viewport;
}
