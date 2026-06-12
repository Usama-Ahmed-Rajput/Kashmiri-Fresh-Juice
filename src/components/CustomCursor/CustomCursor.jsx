import { useEffect, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const enter = (e) => {
      if (e.target.closest('a, button, .card, input, textarea')) {
        setActive(true);
      }
    };

    const leave = (e) => {
      if (e.target.closest('a, button, .card, input, textarea')) {
        setActive(false);
      }
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', enter);
    document.addEventListener('mouseout', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', enter);
      document.removeEventListener('mouseout', leave);
    };
  }, []);

  return (
    <>
      <div
        className={`cursor-ring ${active ? 'active' : ''}`}
        style={{
          left: pos.x,
          top: pos.y,
        }}
      />

      <div
        className={`cursor-drop ${active ? 'active' : ''}`}
        style={{
          left: pos.x,
          top: pos.y,
        }}
      />
    </>
  );
}
