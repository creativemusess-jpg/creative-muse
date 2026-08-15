import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface InfiniteCarouselOptions {
  /** pixels per second while auto-scrolling */
  speed?: number;
  /** delay after user interaction before auto-scroll resumes */
  resumeDelayMs?: number;
}

export const useInfiniteCarousel = <T extends HTMLElement>({
  speed = 60,
  resumeDelayMs = 1500,
}: InfiniteCarouselOptions = {}) => {
  const elRef = useRef<T | null>(null);
  const [el, setEl] = useState<T | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number>(0);
  const reducedMotion = !!useReducedMotion();
  const [duplicateContent, setDuplicateContent] = useState(false);

  /** becomes active once the element mounts (allows late mounting, e.g. render-after-load) */
  const scrollerRef = useCallback((node: T | null) => {
    elRef.current = node;
    setEl(node);
  }, []);

  /** distance between the start of set 1 and the start of set 2 (0 when a single set is rendered) */
  const measureSetWidth = (current: T): number => {
    const count = current.children.length;
    if (count < 2) return 0;
    const a = current.children[0] as HTMLElement;
    const mid = current.children[Math.floor(count / 2)] as HTMLElement;
    return mid.getBoundingClientRect().left - a.getBoundingClientRect().left;
  };

  /* duplicateContent detection — keep running as content/viewport change */
  useEffect(() => {
    if (!el) return;
    const check = () => {
      const count = el.children.length;
      if (count < 2) {
        setDuplicateContent(el.scrollWidth > el.clientWidth + 1);
        return;
      }
      const W = measureSetWidth(el);
      setDuplicateContent(W > el.clientWidth + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, subtree: false });
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", check);
    };
  }, [el]);

  /* auto-scroll + interaction pause */
  useEffect(() => {
    if (!el) return;

    let raf = 0;
    let last = performance.now();
    let visible = true;

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
    });
    io.observe(el);

    const pause = () => {
      pausedRef.current = true;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = 0;
    };
    const scheduleResume = () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      if (!pausedRef.current) return;
      resumeTimerRef.current = window.setTimeout(() => {
        pausedRef.current = false;
      }, resumeDelayMs);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") pause();
    };
    const onPointerUp = scheduleResume;
    const onTouchStart = pause;

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", scheduleResume);
    el.addEventListener("pointerleave", scheduleResume);
    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", scheduleResume);
    el.addEventListener("touchcancel", scheduleResume);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || pausedRef.current || reducedMotion) return;
      const dt = Math.min((now - last) / 1000, 0.5);
      last = now;
      if (el.scrollWidth <= el.clientWidth + 1) return;
      const W = measureSetWidth(el);
      if (W <= 0 || W <= el.clientWidth + 1) return;
      let next = el.scrollLeft + speed * dt;
      if (next >= W) next -= W;
      el.scrollLeft = next;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = 0;
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", scheduleResume);
      el.removeEventListener("pointerleave", scheduleResume);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", scheduleResume);
      el.removeEventListener("touchcancel", scheduleResume);
    };
  }, [el, reducedMotion, speed, resumeDelayMs]);

  const scrollByStep = (direction: -1 | 1) => {
    const current = elRef.current;
    if (!current || current.scrollWidth <= current.clientWidth + 1) return;
    const W = measureSetWidth(current);
    if (W <= 0) return;
    const step = Math.max(current.clientWidth * 0.75, 280);
    const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
    const cur = current.scrollLeft;
    const target = cur + direction * step;
    const wraps = target >= W || target < 0;
    if (wraps) {
      /* instant jump to the pixel-identical position, then animate the remainder */
      current.style.scrollBehavior = "auto";
      current.scrollLeft = cur - direction * W;
      current.style.scrollBehavior = behavior;
      current.scrollLeft = cur + direction * step;
      current.style.scrollBehavior = "";
    } else {
      current.style.scrollBehavior = behavior;
      current.scrollLeft = target;
      current.style.scrollBehavior = "";
    }
    pausedRef.current = true;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, resumeDelayMs);
  };

  return { scrollerRef, duplicateContent, scrollByStep };
};