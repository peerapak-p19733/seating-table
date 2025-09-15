import React, { useState, useRef, useEffect } from "react";
import "./css/SlideToUnlock.css";

const CHIP_SIZE = 60;

export default function SlideToUnlock({ onComplete }) {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);

  const handleDrag = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    let newOffset = clientX - rect.left - CHIP_SIZE / 2;

    const maxOffset = rect.width - CHIP_SIZE;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxOffset) newOffset = maxOffset;

    setOffset(newOffset);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    handleDrag(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    handleDrag(e.touches[0].clientX);
  };

  const handleEnd = () => {
    if (!dragging) return;
    setDragging(false);

    const rect = trackRef.current.getBoundingClientRect();
    const maxOffset = rect.width - CHIP_SIZE;

    if (offset >= maxOffset - 5) {
      onComplete?.(); // ✅ Trigger complete
    } else {
      setOffset(0); // Snap back if not completed
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, offset]);

  // Calculate text fade (1 → 0 as chip slides)
  const rect = trackRef.current?.getBoundingClientRect();
  const maxOffset = rect ? rect.width - CHIP_SIZE : 1;
  const textOpacity = 1 - offset / maxOffset;

  return (
    <div ref={trackRef} className="slider-track">
      <div className="slider-text" style={{ opacity: textOpacity }}>
        ALLLLLLLLL-IN !!
      </div>

      <img
        src="/poker_chip.png"
        alt="poker chip"
        draggable={false}
        className={`slider-chip ${dragging ? "dragging" : ""}`}
        style={{ left: `${offset}px` }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      />
    </div>
  );
}
