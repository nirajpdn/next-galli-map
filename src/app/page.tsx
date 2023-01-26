"use client";
import styles from "./page.module.css";

import Image from "next/image";
import { ChangeEvent, useCallback, useState } from "react";
import { LatLngExpression } from "leaflet";
import { useDisclosure } from "@/hooks/useDisclosure";
import dynamic from "next/dynamic";
const GalliMap = dynamic(() => import("@/components/GallliMap"), {
  ssr: false,
}) as any;

const suggestions = [
  {
    label: "Lazimpat, Kathmandu",
    latlng: {
      lat: 27.72275882633604,
      lng: 85.32112777233124,
    },
  },
  {
    label: "Amrit Science Campus, Ascol",
    latlng: {
      lat: 27.717606440342966,
      lng: 85.31279146671295,
    },
  },
];

export default function Home() {
  const center: LatLngExpression = [27.715953, 85.31675];
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [address, setAddress] = useState<string>("");
  const [marker, setMarker] = useState<LatLngExpression>(center);
  const fetchLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarker([lat, lng]);
        },
        (e) => {
          alert("Location access denied. Please enable your location.");
        }
      );
    } else {
      return alert("Geolocation is not supported by this browser.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className={styles.main}>
      <GalliMap center={marker}>
        <GalliMap.ChangeView center={marker} setCenter={setMarker} />
      </GalliMap>
      <div className={styles.searchBoxContainer}>
        <div className={styles.searchBoxWrapper}>
          <input
            type="text"
            placeholder="Search your favourite places"
            onFocus={onOpen}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAddress(e.target.value)
            }
            value={address}
          />
          <button onClick={fetchLocation}>
            <Image
              src="/current-location.svg"
              alt="Current Location"
              layout="fixed"
              height={25}
              width={20}
            />
          </button>
          {isOpen && (
            <div className={styles.suggestionContainer}>
              <ul>
                {suggestions.map((suggeston, index) => (
                  <li
                    onClick={() => {
                      setMarker([suggeston.latlng.lat, suggeston.latlng.lng]);
                      setAddress(suggeston.label);
                      onClose();
                    }}
                    key={index}
                    className={styles.suggestion}
                  >
                    <Image
                      src="/pin.svg"
                      alt="pin"
                      height={15}
                      width={15}
                      layout="fixed"
                    />
                    <span>{suggeston.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
