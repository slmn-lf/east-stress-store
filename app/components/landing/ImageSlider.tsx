"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";

export default function ImageSlider({ images }: { images?: string[] }) {
  const imgs = images && images.length ? images : ["/placeholder.png"];
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pointerStart = useRef<number | null>(null);
  const pointerDelta = useRef(0);

  // autoplay
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % imgs.length), 4000);
    return () => clearInterval(t);
  }, [imgs.length]);

  // Swipe handlers (pointer events)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      pointerStart.current = e.clientX;
      pointerDelta.current = 0;
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch {}
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pointerStart.current === null) return;
      pointerDelta.current = e.clientX - pointerStart.current;
    };
    const onPointerUp = () => {
      if (pointerStart.current === null) return;
      const delta = pointerDelta.current;
      if (Math.abs(delta) > 50) {
        if (delta < 0) setIndex((i) => (i + 1) % imgs.length);
        else setIndex((i) => (i - 1 + imgs.length) % imgs.length);
      }
      pointerStart.current = null;
      pointerDelta.current = 0;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [imgs.length]);

  return (
    <div className={styles.sliderRoot} ref={rootRef}>
      {imgs.map((src, i) => (
        <div
          key={i}
          className={`${styles.slide} ${i === index ? styles.slideVisible : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={`slide-${i}`} />
        </div>
      ))}
    </div>
  );
}
