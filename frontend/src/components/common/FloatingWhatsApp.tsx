import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { kalariService, KalariContactSettings } from '../../services/kalariService';

export default function FloatingWhatsApp() {
  const [settings, setSettings] = useState<KalariContactSettings | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const loadSettings = () => {
    kalariService.getContactSettings().then((data) => {
      setSettings(data);
    });
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('kalari_content_updated', loadSettings);
    return () => {
      window.removeEventListener('kalari_content_updated', loadSettings);
    };
  }, []);

  const rawNumber = settings?.whatsapp || '+91 99471 39696';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '') || '919947139696';
  const defaultMessage = encodeURIComponent(
    'Hello, I would like to enquire about Kalaripayattu training and services at Madhurakandy C.V.N Kalari.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultMessage}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        right: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        zIndex: 95,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        pointerEvents: 'none',
      }}
    >
      {/* Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: 'rgba(20, 13, 8, 0.95)',
              border: '1px solid rgba(201, 147, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              padding: '0.5rem 0.9rem',
              borderRadius: '24px',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(37, 211, 102, 0.2)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                boxShadow: '0 0 8px #25D366',
                display: 'inline-block',
              }}
            />
            <span>Enquire on WhatsApp</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enquire on WhatsApp"
        initial={{ scale: 0, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.4 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: 'clamp(50px, 4vw, 60px)',
          height: 'clamp(50px, 4vw, 60px)',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.5), 0 4px 12px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          textDecoration: 'none',
          cursor: 'pointer',
          pointerEvents: 'auto',
          outline: 'none',
        }}
      >
        {/* Continuous Soft Pulse Ripple Ring */}
        <motion.span
          animate={{ scale: [1, 1.48], opacity: [0.65, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: '#25D366',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="none"
          style={{ display: 'block' }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2C8.268 2 2 8.268 2 16c0 2.658.742 5.143 2.03 7.264L2.3 29.7l6.634-1.706A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.556a11.5 11.5 0 01-5.856-1.6l-.42-.25-4.35 1.118 1.162-4.148-.274-.436A11.51 11.51 0 014.444 16c0-6.382 5.174-11.556 11.556-11.556 6.382 0 11.556 5.174 11.556 11.556 0 6.382-5.174 11.556-11.556 11.556zm6.33-8.674c-.347-.174-2.053-1.013-2.37-1.13-.318-.116-.55-.174-.781.174-.232.348-.897 1.13-1.1 1.362-.203.232-.406.26-.753.087-.348-.174-1.468-.541-2.796-1.725-1.033-.921-1.73-2.06-1.933-2.407-.203-.348-.022-.536.152-.709.156-.156.348-.406.521-.609.174-.203.232-.348.348-.58.116-.231.058-.434-.029-.608-.087-.174-.782-1.883-1.071-2.578-.282-.676-.568-.584-.782-.595l-.666-.012c-.232 0-.608.087-.927.435-.318.348-1.216 1.188-1.216 2.897 0 1.71 1.245 3.36 1.419 3.593.174.232 2.45 3.74 5.935 5.244.829.358 1.476.572 1.98.732.833.265 1.591.228 2.19.138.669-.1 2.053-.84 2.342-1.652.29-.811.29-1.506.203-1.651-.087-.145-.319-.232-.666-.406z"
            fill="#FFFFFF"
          />
        </svg>
      </motion.a>
    </div>
  );
}
