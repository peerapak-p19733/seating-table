import React, { useState, useRef } from "react";
import "./css/SlideToUnlock.css";
import pokerI from "../assets/poker_chip.png";

export default function SlideToUnlock({ onUnlock }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0); // distance from bottom
  const trackRef = useRef(null);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);

    const trackHeight = trackRef.current.offsetHeight;
    if (offset >= trackHeight * 0.8) {
      // fully unlocked
      onUnlock();
    } else {
      // snap back
      setOffset(0);
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = trackRef.current.getBoundingClientRect();
    // distance from bottom
    let newOffset = rect.bottom - e.clientY - 30; // 30 = knob radius
    const maxOffset = rect.height - 60;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxOffset) newOffset = maxOffset;
    setOffset(newOffset);
  };

  return (
    <div
      className="unlock-track-vertical"
      ref={trackRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div className="unlock-text-vertical">Slide up to continue</div>
      <div
        className="unlock-knob-vertical"
        onMouseDown={handleMouseDown}
        style={{ bottom: `${offset}px` }}
      >
          <img
            src={pokerI}   // your image path
            alt="Poker Chip"
            style={{ width: "60px", height: "60px" }}
          />
      </div>
    </div>
  );
}
