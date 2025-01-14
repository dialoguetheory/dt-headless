import { useEffect } from 'react';

export function useVH100() {
  useEffect(() => {
    let prevClientHeight;

    function setVH100(doc) {
      function handleResize() {
        const clientHeight = doc.clientHeight;
        if (clientHeight === prevClientHeight) return;

        requestAnimationFrame(() => {
          doc.style.setProperty('--vh100', `${clientHeight}px`);
          prevClientHeight = clientHeight;
        });
      }

      handleResize();
      return handleResize;
    }

    // Add event listeners
    const resizeHandler = () => setVH100(document.documentElement);
    window.addEventListener('resize', resizeHandler);

    // Run once on `load`
    setVH100(document.documentElement);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []); // Empty dependency array ensures this only runs on mount
}
