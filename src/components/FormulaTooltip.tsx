import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface FormulaTooltipProps {
  formula: string;
  children: React.ReactNode;
}

export default function FormulaTooltip({ formula, children }: FormulaTooltipProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.top - 8, left: r.left + r.width / 2 });
  }, []);

  function handleEnter() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { place(); }, 300);
  }
  function handleLeave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPos(null);
  }

  return (
    <>
      <span
        ref={anchorRef}
        className="formula-host"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={() => { place(); }}
        onBlur={() => setPos(null)}
        tabIndex={0}
      >
        {children}
      </span>
      {pos && createPortal(
        <div
          className="formula-portal-tooltip"
          style={{ top: pos.top, left: pos.left }}
          role="tooltip"
        >
          <span className="formula-tooltip-label">Formula</span>
          <span className="formula-tooltip-body">{formula}</span>
        </div>,
        document.body
      )}
    </>
  );
}
