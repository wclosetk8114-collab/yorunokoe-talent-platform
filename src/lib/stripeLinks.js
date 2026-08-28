// Stripe Payment Links (test mode) for one-time "投げ銭" tips.
// Created via the Stripe test-mode API; safe to keep in source since
// Payment Link URLs are meant to be shared/public (unlike secret keys).
//
// Subscriptions use a per-talent link stored in the `talents.stripe_subscribe_link`
// column instead (each talent has a different monthly price).
export const TIP_PAYMENT_LINKS = {
  300: "https://buy.stripe.com/test_eVq14n65h2dXgnY53m6g809",
  500: "https://buy.stripe.com/test_dRm7sLctF7yh7Rs0N66g80a",
  1000: "https://buy.stripe.com/test_28E00j0KX2dXdbM0N66g80c",
  3000: "https://buy.stripe.com/test_aFa8wP9ht7yh5JkfI06g80b",
};

export function getTipPaymentLink(amount) {
  return TIP_PAYMENT_LINKS[amount] || null;
}
