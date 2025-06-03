import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../src/context/AppContext';

export default function Home() {
  const { state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (state.isAuthenticated) {
      // User is authenticated, show the main app content
      // The Layout component will handle rendering the appropriate content
    }
  }, [state.isAuthenticated]);

  // The Layout component handles authentication state
  // If not authenticated, it shows LoginForm
  // If authenticated, it shows the main app interface
  return null;
}
