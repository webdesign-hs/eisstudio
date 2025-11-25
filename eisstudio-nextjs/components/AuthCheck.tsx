'use client';

import { useEffect } from 'react';

export default function AuthCheck() {
  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined' && sessionStorage.getItem('eisstudioLoggedIn') !== 'true') {
      window.location.href = '/login';
    }
  }, []);

  return null;
}
