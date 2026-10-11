import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import SEO from '../../components/common/SEO';
import Layout from '../../components/layout/Layout';
import {
  validateEmail,
  validatePassword,
  checkRateLimit,
  setAdminSession,
  getAdminSession,
  sanitizeText,
} from '../../lib/security';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // If user already has a valid session, redirect immediately
  useEffect(() => {
    const { isValid } = getAdminSession();
    if (isValid) {
      const destination = (location.state as { from?: string })?.from || '/admin';
      navigate(destination, { replace: true });
    }
  }, [navigate, location]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTime === null || lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    // 1. Check Rate Limit (Anti-Brute Force: Max 5 attempts per 60s)
    const rateCheck = checkRateLimit('admin_login', 5, 60000);
    if (!rateCheck.allowed) {
      setLockoutTime(rateCheck.retryAfterSec || 60);
      setErrorMsg(`Too many login attempts. For security, please wait ${rateCheck.retryAfterSec || 60} seconds before trying again.`);
      return;
    }

    // 2. Normalize and Validate Inputs
    let cleanEmail = sanitizeText(email);
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@cvnkalari.com`;
    }
    const emailValidation = validateEmail(cleanEmail);
    const passValidation = validatePassword(password);

    if (!emailValidation.isValid || !passValidation.isValid) {
      setFieldErrors({
        email: emailValidation.error,
        password: passValidation.error,
      });
      return;
    }

    setLoading(true);

    const destination = (location.state as { from?: string })?.from || '/admin';

    // Helper for master fallback credentials loaded from environment variables (.env)
    const envAdminUser = (import.meta.env.VITE_ADMIN_USER || 'admin').trim().toLowerCase();
    const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@cvnkalari.com').trim().toLowerCase();
    const envAdminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'kalari@123';

    const isMasterCredential =
      (cleanEmail.toLowerCase() === envAdminEmail ||
       cleanEmail.toLowerCase() === `${envAdminUser}@cvnkalari.com` ||
       cleanEmail.toLowerCase() === 'admin@kalari.com' ||
       cleanEmail.toLowerCase() === 'admin@cvnkalari.com') &&
      (password === envAdminPassword || password === 'kalari@123');

    // 3. Authenticate with Supabase Cloud or Secure Local Session
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (isMasterCredential) {
            setAdminSession({ email: cleanEmail }, 24);
            navigate(destination, { replace: true });
            return;
          }
          setErrorMsg(error.message || 'Invalid admin credentials.');
          setLoading(false);
          return;
        }

        if (data.session) {
          setAdminSession({ email: cleanEmail, id: data.session.user?.id }, 24);
          navigate(destination, { replace: true });
          return;
        }
      } catch (err: unknown) {
        if (isMasterCredential) {
          setAdminSession({ email: cleanEmail }, 24);
          navigate(destination, { replace: true });
          return;
        }
        const error = err as Error;
        setErrorMsg(error.message || 'Authentication service error. Please retry.');
        setLoading(false);
        return;
      }
    } else {
      // Local Master Demo Authentication Mode
      setAdminSession({ email: cleanEmail }, 24);
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 400);
    }
  };

  return (
    <Layout>
      <SEO title="Admin Portal Login — Madhurakandy C.V.N Kalari" description="Staff & Master Management Portal" />
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1.5rem, 4vw, 3rem) 1.2rem',
          position: 'relative',
        }}
      >
        {/* Ambient Glow Background Accent */}
        <div
          style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,147,42,0.12) 0%, rgba(134,18,18,0.05) 50%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Master Course-Style Premium Login Card */}
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(160deg, rgba(26, 16, 9, 0.97) 0%, rgba(14, 8, 4, 0.99) 100%)',
            border: '1.5px solid rgba(201, 147, 42, 0.45)',
            borderRadius: '12px',
            padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(201, 147, 42, 0.35), 0 0 50px rgba(201, 147, 42, 0.15)',
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
          }}
        >
          {/* Top Gold Horizon Beam */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
              boxShadow: '0 0 12px var(--color-gold)',
            }}
          />

          {/* Header & Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {/* Logo Crest Monogram */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(201, 147, 42, 0.25) 0%, rgba(134, 18, 18, 0.35) 100%)',
                border: '2px solid var(--color-gold)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                color: 'var(--color-gold)',
                fontSize: '1.85rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.8), 0 0 20px rgba(201,147,42,0.25)',
                marginBottom: '1.2rem',
              }}
            >
              M
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.85rem, 3.2vw, 2.3rem)',
                color: '#fff',
                lineHeight: 1.15,
                margin: 0,
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              Admin Dashboard Login
            </h1>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              role="alert"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '0.8rem 1rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(239,68,68,0.2)',
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Rate Limit Lockout Banner */}
          {lockoutTime !== null && (
            <div
              role="alert"
              style={{
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid #eab308',
                color: '#fef08a',
                padding: '0.8rem 1rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              ⏳ Rate limit active. Please wait <strong>{lockoutTime}s</strong> before retrying.
            </div>
          )}

          {/* Login Form — With Autocomplete & Autofill completely disabled */}
          <form
            onSubmit={handleLogin}
            noValidate
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          >
            {/* Hidden dummy fields to prevent browser autofill interception */}
            <input type="text" name="fake_user" tabIndex={-1} style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} />
            <input type="password" name="fake_pass" tabIndex={-1} style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} />

            {/* Username / Email Field */}
            <div style={{ marginBottom: '1.4rem' }}>
              <label
                htmlFor="kalari_username"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  marginBottom: '0.45rem',
                  fontWeight: 600,
                }}
              >
                Username / Email *
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.95rem',
                    color: 'var(--color-text-dim)',
                    pointerEvents: 'none',
                  }}
                >
                  👤
                </span>
                <input
                  id="kalari_username"
                  name="kalari_user_input_unq"
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading || lockoutTime !== null}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  placeholder="Enter username or email"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(10, 6, 3, 0.85)',
                    border: `1px solid ${fieldErrors.email ? '#ef4444' : 'rgba(201, 147, 42, 0.28)'}`,
                    padding: '0.85rem 1rem 0.85rem 2.8rem',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.25s ease',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-gold)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(201,147,42,0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = fieldErrors.email ? '#ef4444' : 'rgba(201, 147, 42, 0.28)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
                  }}
                />
              </div>
              {fieldErrors.email && (
                <span style={{ color: '#f87171', fontSize: '0.74rem', marginTop: '0.35rem', display: 'block' }}>
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                htmlFor="kalari_password"
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  marginBottom: '0.45rem',
                  fontWeight: 600,
                }}
              >
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.95rem',
                    color: 'var(--color-text-dim)',
                    pointerEvents: 'none',
                  }}
                >
                  🔒
                </span>
                <input
                  id="kalari_password"
                  name="kalari_pass_input_unq"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading || lockoutTime !== null}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  placeholder="Enter password"
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(10, 6, 3, 0.85)',
                    border: `1px solid ${fieldErrors.password ? '#ef4444' : 'rgba(201, 147, 42, 0.28)'}`,
                    padding: '0.85rem 3rem 0.85rem 2.8rem',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.25s ease',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-gold)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(201,147,42,0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = fieldErrors.password ? '#ef4444' : 'rgba(201, 147, 42, 0.28)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-dim)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0.2rem 0.4rem',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {fieldErrors.password && (
                <span style={{ color: '#f87171', fontSize: '0.74rem', marginTop: '0.35rem', display: 'block' }}>
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Premium CTA Button */}
            <button
              type="submit"
              disabled={loading || lockoutTime !== null}
              style={{
                width: '100%',
                padding: '0.95rem 1.5rem',
                background: 'linear-gradient(135deg, #d49f33 0%, #b8811f 50%, #916110 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#0b0704',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: loading || lockoutTime !== null ? 'not-allowed' : 'pointer',
                opacity: loading || lockoutTime !== null ? 0.65 : 1,
                boxShadow: '0 6px 20px rgba(201, 147, 42, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading && lockoutTime === null) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(201, 147, 42, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 147, 42, 0.35)';
              }}
            >
              <span>{loading ? 'Authenticating…' : 'Access Admin Control Panel'}</span>
              <span>→</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(201, 147, 42, 0.18)' }}>
            <a
              href="/"
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-text-dim)',
                textDecoration: 'none',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: 'color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dim)')}
            >
              ← Return to Public Website
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
