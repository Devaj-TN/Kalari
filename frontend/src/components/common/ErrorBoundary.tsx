import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Kalari Application Error Caught by Boundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-sans)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: 'rgba(20, 13, 8, 0.94)',
              border: '1.5px solid var(--color-gold)',
              borderRadius: '8px',
              padding: '2.5rem 2rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(201,147,42,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Warning Crest Badge */}
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(134, 18, 18, 0.25)',
                border: '1.5px solid var(--color-kalari-red)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '1.2rem',
              }}
            >
              🛡️
            </div>

            <p
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              System Safeguard
            </p>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                color: '#fff',
                margin: '0 0 1rem',
                fontWeight: 700,
              }}
            >
              {this.props.fallbackTitle || 'Something Went Unexpectedly'}
            </h2>

            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              {this.props.fallbackMessage ||
                'An unexpected rendering issue occurred in this section. Your data is safe, and you can reload or return to the main arena.'}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.9rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.4rem',
                  backgroundColor: 'var(--color-kalari-red)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(134,18,18,0.4)',
                }}
              >
                🔄 Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.4rem',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  color: 'var(--color-text)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reload Page
              </button>

              <Link
                to="/"
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.4rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-gold-dim)',
                  borderRadius: '4px',
                  color: 'var(--color-gold)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
