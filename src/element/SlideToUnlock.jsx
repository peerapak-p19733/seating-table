import React, { useState, useRef } from "react";
import "./css/SlideToUnlock.css";

export default function SlideToUnlock({ onUnlock }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef(null);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);

    const trackWidth = trackRef.current.offsetWidth;
    if (offset >= trackWidth * 0.8) {
      onUnlock(); // fully unlocked
    } else {
      setOffset(0); // snap back
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = trackRef.current.getBoundingClientRect();
    let newOffset = e.clientX - rect.left - 30; // 30 = half of knob width
    const maxOffset = rect.width - 60;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxOffset) newOffset = maxOffset;

    window.requestAnimationFrame(() => setOffset(newOffset));
    // setOffset(newOffset);
  };

  return (
    <div
      className="unlock-track-horizontal"
      ref={trackRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div className="unlock-text-horizontal">Slide to continue</div>
      <div
        className="unlock-knob-horizontal"
        onMouseDown={handleMouseDown}
        style={{ 
          left: `${offset}px`,
          transform: `translateY(-50%) scale(${1 + offset / 300})` 
        }}
      >
        <img
          src="/image/poker_chip.png"
          alt="Poker Chip"
          style={{ width: "100px", height: "100px" }}
        />
      </div>
    </div>
  );
}
