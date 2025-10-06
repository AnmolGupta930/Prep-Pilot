"use client"
import { useEffect } from 'react';
export default function DndTouch() {
 useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        require('drag-drop-touch');
        console.log('DragDropTouch polyfill loaded.');
      } catch (error) {
        console.error('Failed to load DragDropTouch polyfill:', error);
      }
    }
  }, []);
  return null;
}

