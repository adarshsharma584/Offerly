export function generateQRData(offerId: string, userId: string) {
  const token = btoa(`${offerId}-${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const payload = { offerId, userId, token, generatedAt: Date.now(), expiresAt: Date.now() + 10 * 60 * 1000 };
  localStorage.setItem(`offerly_qr_${offerId}`, JSON.stringify(payload));
  return payload;
}

export function getQRPayload(offerId: string) {
  const raw = localStorage.getItem(`offerly_qr_${offerId}`);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function isQRExpired(payload: { expiresAt: number }) {
  return Date.now() > payload.expiresAt;
}

export function getRemainingSeconds(payload: { expiresAt: number }) {
  return Math.max(0, Math.floor((payload.expiresAt - Date.now()) / 1000));
}
