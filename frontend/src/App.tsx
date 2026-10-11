import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SmoothScrollProvider from './components/animation/SmoothScrollProvider';
import ScrollProgress from './components/animation/ScrollProgress';
import ErrorBoundary from './components/common/ErrorBoundary';
import { router } from './router';
import { kalariService } from './services/kalariService';
import './styles/globals.css';

export default function App() {
  useEffect(() => {
    // Proactively preload the entire site, tables, and warm browser media cache
    kalariService.preloadEntireSite();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <SmoothScrollProvider>
          <ScrollProgress />
          <RouterProvider router={router} />
        </SmoothScrollProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
