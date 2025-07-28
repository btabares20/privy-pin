"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import debounce from "lodash.debounce";

interface Pin {
  name: string;
  lng: number;
  lat: number;
}

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map| null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const allPinsRef = useRef<Pin[]>([]);
  const dropPinModeRef = useRef(false); 
  const [, forceRerender] = useState(false); 

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const addVisibleMarkers = (map: maplibregl.Map) => {
    const bounds = map.getBounds();

    const visiblePins = allPinsRef.current.filter((pin: Pin) => {
      return (
        pin.lng >= bounds.getWest() &&
        pin.lng <= bounds.getEast() &&
        pin.lat >= bounds.getSouth() &&
        pin.lat <= bounds.getNorth()
      );
    });

    clearMarkers();

    visiblePins.forEach((pin: Pin) => {
      const marker = new maplibregl.Marker()
        .setLngLat([pin.lng, pin.lat])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<div style="font-weight: bold; color: #2f3542">${pin.name}</div>`
          )
        )
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    const initMap = (lng: number, lat: number) => {
      if (!mapContainerRef.current) return;
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`, 
        center: [lng, lat],
        zoom: 13,
      });

      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
        "top-right"
      );

      map.on("click", (e) => { if (!dropPinModeRef.current) return;

        const name = prompt("Enter a name for this pin:");
        if (!name) return;

        const newPin: Pin = {
          name,
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
        };

        allPinsRef.current.push(newPin);
        addVisibleMarkers(map);
        dropPinModeRef.current = false;
        forceRerender((prev) => !prev);
      });

      const updateMarkers = debounce(() => addVisibleMarkers(map), 300);
      map.on("moveend", updateMarkers);

      addVisibleMarkers(map);
    };
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            initMap(longitude, latitude);
        },
        (err) => {
            console.warn("Geolocation failed or denied:", err);
            initMap(120.9842, 14.5995); // Manila
        }
    );
  });

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      <button
        onClick={() => {
          dropPinModeRef.current = !dropPinModeRef.current;
          forceRerender((prev) => !prev); 
        }}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          padding: "10px 16px",
          background: dropPinModeRef.current ? "#2ecc71" : "#1e90ff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {dropPinModeRef.current ? "Click a spot…" : "Drop a Pin"}
      </button>
    </div>
  );
}
