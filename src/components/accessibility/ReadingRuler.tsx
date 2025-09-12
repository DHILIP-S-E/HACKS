import React, { useEffect, useRef } from 'react';
import { useAccessibilityStore } from '@/stores/accessibilityStore';

export const ReadingRuler: React.FC = () => {
  const { readingRuler, readingRulerPosition, setReadingRulerPosition } = useAccessibilityStore();
  const rulerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setReadingRulerPosition(e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [readingRuler, setReadingRulerPosition]);

  if (!readingRuler) return null;

  return (
    <div
      ref={rulerRef}
      className="reading-ruler"
      style={{ top: readingRulerPosition }}
      role="presentation"
      aria-hidden="true"
    />
  );
};