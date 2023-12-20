import {useEffect, useState} from 'react';

export default function MouseMovement() {
  const [coords, setCoords] = useState({x: 0, y: 0});
  

  useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleWindowMouseMove,
      );
    };
  }, []);

  return coords;
}
