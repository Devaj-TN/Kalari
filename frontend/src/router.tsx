import React, { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Gurukkal = lazy(() => import('./pages/Gurukkal'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0705',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '1.5px solid var(--color-gold-dim)',
          borderTop: '1.5px solid var(--color-gold)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ContinuousRouteWrapper({ targetSection }: { targetSection?: string }) {
  const location = useLocation();

  useEffect(() => {
    const sectionId = targetSection || (location.hash ? location.hash.replace('#', '') : null);
    if (sectionId) {
      setTimeout(() => {
        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: string | HTMLElement, options?: { offset?: number }) => void } }).__lenis;
        const target = document.getElementById(sectionId);
        if (lenis && target) {
          lenis.scrollTo(target, { offset: -30 });
        } else if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    }
  }, [location, targetSection]);

  return (
    <ErrorBoundary fallbackTitle="Home Arena Unavailable" fallbackMessage="Could not load the home arena view. Please retry.">
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Home />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ContinuousRouteWrapper />,
  },
  {
    path: '/about',
    element: (
      <ErrorBoundary fallbackTitle="About Page Error">
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <About />
          </Suspense>
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: '/programs',
    element: <ContinuousRouteWrapper targetSection="programs" />,
  },
  {
    path: '/programs/:slug',
    element: <ContinuousRouteWrapper targetSection="programs" />,
  },
  {
    path: '/schedule',
    element: <ContinuousRouteWrapper targetSection="programs" />,
  },
  {
    path: '/gallery',
    element: (
      <ErrorBoundary fallbackTitle="Gallery Error">
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <GalleryPage />
          </Suspense>
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: '/guru',
    element: (
      <ErrorBoundary fallbackTitle="Gurukkal Profile Error">
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Gurukkal />
          </Suspense>
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: '/gurukkal',
    element: (
      <ErrorBoundary fallbackTitle="Gurukkal Profile Error">
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Gurukkal />
          </Suspense>
        </Layout>
      </ErrorBoundary>
    ),
  },
  {
    path: '/news',
    element: <ContinuousRouteWrapper targetSection="news" />,
  },
  {
    path: '/location',
    element: <ContinuousRouteWrapper targetSection="contact-location" />,
  },
  {
    path: '/branches',
    element: <ContinuousRouteWrapper targetSection="contact-location" />,
  },
  {
    path: '/contact',
    element: <ContinuousRouteWrapper targetSection="contact-location" />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <AdminDashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/login',
    element: (
      <ErrorBoundary fallbackTitle="Admin Authentication Error">
        <Suspense fallback={<PageLoader />}>
          <AdminLogin />
        </Suspense>
      </ErrorBoundary>
    ),
  },
  {
    path: '*',
    element: <ContinuousRouteWrapper />,
  },
]);
