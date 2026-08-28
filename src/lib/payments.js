// Thin abstraction over the checkout provider.
//
// Stripe Payment Links（テストモード）が投げ銭・月額課金の両方で有効になっている。
// 投げ銭は src/lib/stripeLinks.js の固定金額リンク、月額課金は各タレントの
// talents.stripe_subscribe_link を使う。
export function isStripeConfigured() {
  return true;
}
