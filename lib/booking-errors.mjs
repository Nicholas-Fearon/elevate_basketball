export function bookingErrorMessage(error) {
  const known = {
    CAMP_FULL: 'This camp has just filled up. Please choose another camp.',
    CAMP_CLOSED: 'Booking is now closed for this camp.',
    AGE_NOT_ELIGIBLE: 'Please check the participant’s age against this camp’s age range.',
    INVALID_DETAILS: 'Please check your details and guardian confirmation.',
    AUTH_REQUIRED: 'Your sign-in could not be verified for booking. Sign out and back in, then retry. If it continues, contact Elevate. (AUTH_REQUIRED)',
    INVALID_CONFIRMATION: 'The booking service returned an incomplete confirmation. Check My bookings before retrying; your place may already be reserved. (INVALID_CONFIRMATION)',
  };
  if (Object.hasOwn(known, error?.message)) return known[error.message];
  const code = typeof error?.code === 'string' && /^[A-Z0-9]{5,12}$/.test(error.code) ? error.code : null;
  if (['PGRST301','PGRST302','PGRST303'].includes(code) || error?.status === 401) {
    return `Your sign-in could not be verified by the booking service. Sign out and back in, then retry. If it continues, contact Elevate. (${code || 'AUTH_REJECTED'})`;
  }
  if (code === 'PGRST202') return 'The booking service is not ready. Please contact Elevate before trying again. (PGRST202)';
  if (code === '42501' || error?.status === 403) return `The booking service could not authorise this reservation. Please contact Elevate. (${code || 'ACCESS_DENIED'})`;
  return `We couldn’t confirm your booking. Check My bookings before retrying; if it was saved, the same booking will be returned.${code ? ` Error code: ${code}.` : ''}`;
}
