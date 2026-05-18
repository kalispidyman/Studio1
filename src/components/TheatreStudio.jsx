'use client';

import { useEffect } from 'react';
import studio from '@theatre/studio';
import extension from '@theatre/r3f/dist/extension';

// Initialize immediately if in development and on client
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  studio.initialize();
  studio.extend(extension);
  if (studio.ui) studio.ui.hide();
}

export default function TheatreStudio({ visible }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && studio.ui) {
      if (visible) {
        studio.ui.restore();
      } else {
        studio.ui.hide();
      }
    }
  }, [visible]);

  return null;
}
