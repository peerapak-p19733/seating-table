import React, { useState, useRef } from "react";
import "./css/SlideToUnlock.css";

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

  const handleTouchStart = () => setDragging(true);

  const handleTouchMove = (e) => {
    if (!dragging) return;
    e.preventDefault(); // stop page from scrolling
    const rect = trackRef.current.getBoundingClientRect();
    let newOffset = e.touches[0].clientX - rect.left - 30; // use first finger
    const maxOffset = rect.width - 60;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxOffset) newOffset = maxOffset;
    setOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (!dragging) return;
    setDragging(false);

    const trackWidth = trackRef.current.offsetWidth;
    if (offset >= trackWidth * 0.8) {
      onUnlock?.(); // unlock success
    } else {
      setOffset(0); // snap back
    }
  };

  return (
    <div
      className="unlock-track-vertical"
      ref={trackRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="unlock-text-vertical">Slide up to continue</div>
      <div
        className="unlock-knob-vertical"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ bottom: `${offset}px` }}
      >
          <img
            src="/poker_chip.png"   // your image path
            alt="Poker Chip"
            style={{ width: "60px", height: "60px" }}
          />
      </div>
    </div>
  );
}
