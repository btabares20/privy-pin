"use client";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import debounce from "lodash.debounce";

// Define types based on your API response
interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

interface ApiPin {
  location: Location;
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Pin {
  name: string;
  lng: number;
  lat: number;
  id: string; // Added ID for better tracking
}

type ApiResponse = ApiPin[]; // Your API returns an array directly

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const allPinsRef = useRef<Pin[]>([]);
  const [dropPinMode, setDropPinMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dropPinModeRef = useRef<boolean>(false);

  useEffect(() => {
    dropPinModeRef.current = dropPinMode;
  }, [dropPinMode]);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  // API call function
  const fetchPinsFromAPI = async (swLong: number, swLat: number, neLong: number, neLat: number) => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Replace this URL with your actual API endpoint
      const apiUrl = `http://192.168.6.196:3001/api/toilets/nearby?swLong=${swLong}&swLat=${swLat}&neLong=${neLong}&neLat=${neLat}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
          // 'Authorization': 'Bearer your-token-here'
        }
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }
      else if (response.status == 404){
        return [];
      }
      

      const data: ApiResponse = await response.json();
      
      // Transform API response to your Pin format
      const transformedPins: Pin[] = data.map((apiPin: ApiPin) => ({
        name: apiPin.name,
        lng: apiPin.location.coordinates[0], // longitude is first in GeoJSON
        lat: apiPin.location.coordinates[1], // latitude is second in GeoJSON
        id: apiPin._id
      }));
      
      // Update the pins from API response
      allPinsRef.current = transformedPins;
      
      console.log(`Received ${allPinsRef.current.length} pins from API`);
      
      return data;
    } catch (error) {
      console.error('Error fetching pins from API:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to fetch pins');
      // Keep existing pins on error
      return null;
    } finally {
      setLoading(false);
    }
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

  // Function to handle map movement and API calls
  const handleMapMove = async (map: maplibregl.Map) => {
    const bounds = map.getBounds(); // Get current map bounds
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Call your live API with center coordinates and max distance
    await fetchPinsFromAPI(sw.lng, sw.lat, ne.lng, ne.lat);
    
    // Update markers after getting new data
    addVisibleMarkers(map);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initMap = (lng: number, lat: number) => {
      const map = new maplibregl.Map({
        container: mapContainerRef.current as HTMLDivElement,
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

      map.on("click", (e: maplibregl.MapMouseEvent) => {
        if (!dropPinModeRef.current) return;

        const name = prompt("Enter a name for this pin:");
        if (!name) return;

        const newPin: Pin = {
          name,
          lng: e.lngLat.lng,
          lat: e.lngLat.lat,
          id: `user_pin_${Date.now()}`, // Generate a temporary ID
        };

        // Add to local pins (you might want to also save this to your API)
        allPinsRef.current.push(newPin);
        addVisibleMarkers(map);
        setDropPinMode(false);
      });

      // Debounced function to handle map movement
      const debouncedMapMove = debounce(() => handleMapMove(map), 500);
      // Call API on map movement
      map.on("moveend", debouncedMapMove);

      // Initial API call when map loads
      handleMapMove(map);
    };

    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        const { latitude, longitude } = pos.coords;
        initMap(longitude, latitude);
      },
      (err: GeolocationPositionError) => {
        console.warn("Geolocation failed or denied:", err);
        initMap(120.9842, 14.5995); // Manila
      }
    );
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      
      <button
        onClick={() => setDropPinMode(!dropPinMode)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 1,
          padding: "10px 16px",
          background: dropPinMode ? "#2ecc71" : "#1e90ff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {dropPinMode ? "Click a spot…" : "Drop a Pin"}
      </button>

      {/* Loading indicator */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1,
            padding: "8px 12px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          Loading pins...
        </div>
      )}

      {/* Error indicator */}
      {apiError && (
        <div
          style={{
            position: "absolute",
            top: 70,
            right: 20,
            zIndex: 1,
            padding: "8px 12px",
            background: "rgba(255, 0, 0, 0.9)",
            color: "#fff",
            borderRadius: "4px",
            fontSize: "14px",
            maxWidth: "200px",
          }}
        >
          Error: {apiError}
        </div>
      )}
    </div>
  );
}
