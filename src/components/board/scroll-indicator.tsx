'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollIndicatorProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ScrollIndicator({ containerRef }: ScrollIndicatorProps) {
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [visible, setVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const hasOverflow = scrollHeight > clientHeight;
      setVisible(hasOverflow);

      if (hasOverflow) {
        const trackHeight = trackRef.current?.clientHeight ?? clientHeight;
        const ratio = clientHeight / scrollHeight;
        const height = Math.max(ratio * trackHeight, 30);
        const top = (scrollTop / (scrollHeight - clientHeight)) * (trackHeight - height);
        setThumbHeight(height);
        setThumbTop(top);
      }
    };

    update();
    container.addEventListener('scroll', update);
    const observer = new ResizeObserver(update);
    observer.observe(container);
    // Also watch for content changes
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      container.removeEventListener('scroll', update);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [containerRef]);

  if (!visible) return null;

  return (
    <div
      ref={trackRef}
      className="absolute right-1 top-2 bottom-2 w-2 rounded-full bg-bg-elevated/80"
    >
      <div
        className="absolute w-full rounded-full bg-accent transition-[top] duration-75"
        style={{ top: `${thumbTop}px`, height: `${thumbHeight}px` }}
      />
    </div>
  );
}
