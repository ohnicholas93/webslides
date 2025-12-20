import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const FALLBACK_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC43NSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaXJjbGUtcXVlc3Rpb24tbWFyay1pY29uIGx1Y2lkZS1jaXJjbGUtcXVlc3Rpb24tbWFyayI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNOS4wOSA5YTMgMyAwIDAgMSA1LjgzIDFjMCAyLTMgMy0zIDMiLz48cGF0aCBkPSJNMTIgMTdoLjAxIi8+PC9zdmc+";

export default function CustomImage({
  path,
  fallback_url = FALLBACK_DATA_URL,
  className,
}: {
  path: string;
  fallback_url?: string;
  className?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [source, setSource] = useState(path);

  useEffect(() => {
    setSource(path);
  }, [path]);

  const ensureFallback = () => {
    const fallbackSource = fallback_url ?? FALLBACK_DATA_URL;
    setSource((prev) => (prev === fallbackSource ? prev : fallbackSource));
  };

  useEffect(() => {
    const node = imgRef.current;
    if (node && node.complete && node.naturalWidth === 0) {
      ensureFallback();
    }
  }, [source]);

  return (
    <img
      ref={imgRef}
      src={source}
      alt={path}
      className={cn("figure border border-gray-500 rounded-xl object-contain", className)}
      onError={ensureFallback}
    />
  );
}
