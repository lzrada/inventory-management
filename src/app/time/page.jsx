"use client";

import { useState, useEffect } from "react";

export default function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return <p>{time.toLocaleTimeString()}</p>;
}
