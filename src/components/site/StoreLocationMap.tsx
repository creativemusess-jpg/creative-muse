"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface StoreLocationMapProps {
  latitude: number;
  longitude: number;
  storeName: string;
  tagline?: string;
  address: string;
  className?: string;
}

export function getDirectionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

const MARKER_HTML = `
  <div class="cm-map-marker">
    <span class="cm-map-marker-pulse"></span>
    <svg viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17 1.2C8.9 1.2 2.2 7.7 2.2 15.4 2.2 24.6 17 42.8 17 42.8s14.8-18.2 14.8-27.4C31.8 7.7 25.1 1.2 17 1.2z" fill="#9C544D" stroke="#C9A96E" stroke-width="1.5"/>
      <circle cx="17" cy="15.3" r="5.3" stroke="#C9A96E" stroke-width="2" fill="none"/>
      <circle cx="17" cy="15.3" r="2.1" fill="#E8C98A"/>
    </svg>
  </div>
`;

export function StoreLocationMap({
  latitude,
  longitude,
  storeName,
  tagline,
  address,
  className,
}: StoreLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let map: LeafletMap | null = null;
    let resizeTimer = 0;
    let resizeObserver: ResizeObserver | null = null;

    const destroy = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeObserver?.disconnect();
      map?.remove();
      map = null;
    };

    const init = async () => {
      try {
        const L = await import("leaflet");
        if (cancelled || !container.isConnected) return;

        map = L.map(container, {
          center: [latitude, longitude],
          zoom: 16,
          minZoom: 3,
          maxZoom: 19,
          scrollWheelZoom: true,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
          subdomains: "abcd",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }).addTo(map);

        const icon = L.divIcon({
          className: "",
          html: MARKER_HTML,
          iconSize: [34, 44],
          iconAnchor: [17, 42],
          popupAnchor: [0, -40],
        });

        const popupHtml = `
          <div class="cm-map-popup">
            <p class="cm-map-popup-name">${storeName}</p>
            ${tagline ? `<p class="cm-map-popup-tag">${tagline}</p>` : ""}
            <p class="cm-map-popup-addr">${address.replace(/, /g, "<br/>")}</p>
            <a class="cm-map-popup-btn" href="${getDirectionsUrl(latitude, longitude)}" target="_blank" rel="noreferrer">Get Directions</a>
          </div>
        `;

        L.marker([latitude, longitude], { icon, keyboard: true })
          .addTo(map)
          .bindPopup(popupHtml, {
            maxWidth: 280,
            minWidth: 220,
            closeButton: true,
            autoPan: true,
          });

        resizeTimer = window.setTimeout(() => map?.invalidateSize({ pan: false }), 700);
        resizeObserver = new ResizeObserver(() => map?.invalidateSize({ pan: false }));
        resizeObserver.observe(container);
      } catch {
        /* map unavailable — the card keeps its neutral background */
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      init();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          init();
        },
        { rootMargin: "300px 0px" }
      );
      observer.observe(container);
    }

    return () => {
      cancelled = true;
      destroy();
    };
  }, [latitude, longitude]);

  return (
    <div
      ref={containerRef}
      className={className ? `cm-map ${className}` : "cm-map"}
      aria-label={`Map showing ${storeName} location`}
    />
  );
}
