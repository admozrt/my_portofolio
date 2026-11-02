/**
 * Tautan "kirim email" yang benar-benar membuka sesuatu.
 *
 * `mailto:` diam saja di perangkat tanpa aplikasi email bawaan (umum di laptop
 * Windows), jadi di desktop dipakai jendela tulis Gmail web. Ponsel dan tablet
 * selalu punya aplikasi email, jadi di sana `mailto:` langsung membukanya.
 */

export const gmailUrl = (to: string, subject: string, body: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}` +
  `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const mailtoUrl = (to: string, subject: string, body: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** iPadOS mengaku "Macintosh", jadi dikenali dari layar sentuhnya. */
export const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
};

/** Href + atribut target untuk tautan email sesuai perangkat. */
export const mailLink = (to: string, subject: string, body: string) => {
  const mobile = isMobileDevice();
  return {
    href: mobile ? mailtoUrl(to, subject, body) : gmailUrl(to, subject, body),
    target: mobile ? undefined : '_blank',
    rel: mobile ? undefined : 'noopener noreferrer',
  };
};
