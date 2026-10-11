/**
 * Kalari Web Security & Validation Utility
 * Provides XSS sanitization, URL safety checks, form validation, rate limiting, and secure session management.
 */

// ─── 1. XSS SANITIZATION & SAFE STRING UTILITIES ─────────────────────────────

/**
 * Strips dangerous HTML tags, script payloads, and malicious event handlers from user text.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '') // Removes onerror=, onclick=, etc.
    .replace(/javascript\s*:/gi, '')
    .trim();
}

/**
 * Validates and sanitizes URLs to prevent javascript: or unsafe data URIs.
 * Allows http, https, mailto, tel, and safe base64 image/video data URLs.
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Safe data URIs for user-uploaded images and videos
  if (
    trimmed.startsWith('data:image/jpeg;base64,') ||
    trimmed.startsWith('data:image/png;base64,') ||
    trimmed.startsWith('data:image/webp;base64,') ||
    trimmed.startsWith('data:image/avif;base64,') ||
    trimmed.startsWith('data:image/gif;base64,') ||
    trimmed.startsWith('data:video/mp4;base64,') ||
    trimmed.startsWith('data:video/webm;base64,')
  ) {
    return trimmed;
  }

  // Safe web protocols
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }

  // Reject javascript:, vbscript:, data:text/html, etc.
  return '';
}

// ─── 2. FORM VALIDATION RULES ────────────────────────────────────────────────

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email with RFC 5322 compliant regex.
 */
export function validateEmail(email: string): ValidationResult {
  const sanitized = sanitizeText(email);
  if (!sanitized) {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@domain.com).' };
  }
  return { isValid: true };
}

/**
 * Validates phone numbers (Supports Indian 10-digit formats with optional +91, 0, or international 10-15 digits).
 */
export function validatePhone(phone: string): ValidationResult {
  const sanitized = sanitizeText(phone).replace(/[\s\-()]/g, '');
  if (!sanitized) {
    return { isValid: false, error: 'Phone number is required.' };
  }
  // Accepts +91xxxxxxxxxx, 0xxxxxxxxxx, or international 10-15 digits
  const phoneRegex = /^(\+?[0-9]{1,4})?[0-9]{10,14}$/;
  if (!phoneRegex.test(sanitized)) {
    return { isValid: false, error: 'Please enter a valid 10-digit mobile number.' };
  }
  return { isValid: true };
}

/**
 * Validates student or patient age.
 */
export function validateAge(age: string | number): ValidationResult {
  const num = typeof age === 'number' ? age : parseInt(String(age).trim(), 10);
  if (isNaN(num) || num < 4 || num > 110) {
    return { isValid: false, error: 'Please enter a valid age between 4 and 110.' };
  }
  return { isValid: true };
}

/**
 * Validates full name (min 2 chars, letters and spaces only).
 */
export function validateName(name: string): ValidationResult {
  const sanitized = sanitizeText(name);
  if (!sanitized || sanitized.length < 2) {
    return { isValid: false, error: 'Full name must be at least 2 characters.' };
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(sanitized)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, and hyphens.' };
  }
  return { isValid: true };
}

/**
 * Validates required text with minimum length.
 */
export function validateRequired(value: string, fieldLabel: string, minLength = 2): ValidationResult {
  const sanitized = sanitizeText(value);
  if (!sanitized || sanitized.length < minLength) {
    return { isValid: false, error: `${fieldLabel} must be at least ${minLength} characters.` };
  }
  return { isValid: true };
}

/**
 * Validates password strength (min 6 characters).
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters.' };
  }
  return { isValid: true };
}

/**
 * Validates file upload type and size (Max 15MB for images/videos).
 */
export function validateMediaFile(file: File, maxSizeBytes = 15 * 1024 * 1024): ValidationResult {
  if (!file) {
    return { isValid: false, error: 'Please select a file to upload.' };
  }
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return { isValid: false, error: 'Only JPG, PNG, WebP, AVIF images and MP4/WebM videos are supported.' };
  }

  if (file.size > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    return { isValid: false, error: `File size exceeds the maximum limit of ${maxMb}MB.` };
  }

  return { isValid: true };
}

// ─── 3. RATE LIMITING & BRUTE-FORCE PROTECTION ───────────────────────────────

const RATE_LIMIT_STORAGE_PREFIX = 'kalari_rl_';

export function checkRateLimit(
  actionKey: string,
  maxAttempts = 5,
  windowMs = 60000
): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  try {
    const key = `${RATE_LIMIT_STORAGE_PREFIX}${actionKey}`;
    const raw = sessionStorage.getItem(key);
    const now = Date.now();

    let record: { attempts: number; firstAttempt: number } = raw
      ? JSON.parse(raw)
      : { attempts: 0, firstAttempt: now };

    // Reset window if expired
    if (now - record.firstAttempt > windowMs) {
      record = { attempts: 0, firstAttempt: now };
    }

    if (record.attempts >= maxAttempts) {
      const retryAfterSec = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSec: Math.max(1, retryAfterSec) };
    }

    record.attempts += 1;
    sessionStorage.setItem(key, JSON.stringify(record));

    return {
      allowed: true,
      remainingAttempts: Math.max(0, maxAttempts - record.attempts),
    };
  } catch {
    return { allowed: true, remainingAttempts: 1 };
  }
}

// ─── 4. SECURE ADMIN AUTH SESSION MANAGEMENT ─────────────────────────────────

const SESSION_KEY = 'kalari_admin_session';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSession {
  user: {
    email: string;
    id?: string;
  };
  timestamp: number;
  expiresAt: number;
}

export function getAdminSession(): { isValid: boolean; session?: AdminSession } {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { isValid: false };

    const parsed: AdminSession = JSON.parse(raw);
    if (!parsed?.user?.email || typeof parsed.user.email !== 'string') {
      clearAdminSession();
      return { isValid: false };
    }

    const now = Date.now();
    const expiresAt = parsed.expiresAt || (parsed.timestamp ? parsed.timestamp + SESSION_MAX_AGE_MS : 0);

    if (now > expiresAt) {
      clearAdminSession();
      return { isValid: false };
    }

    return { isValid: true, session: parsed };
  } catch {
    clearAdminSession();
    return { isValid: false };
  }
}

export function setAdminSession(user: { email: string; id?: string }, hours = 24): void {
  const now = Date.now();
  const session: AdminSession = {
    user: {
      email: sanitizeText(user.email).toLowerCase(),
      id: user.id,
    },
    timestamp: now,
    expiresAt: now + hours * 60 * 60 * 1000,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('kalari_admin_session');
  } catch {
    // Ignore storage clear errors
  }
}
