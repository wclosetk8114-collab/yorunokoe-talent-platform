// Thin abstraction over the checkout provider.
//
// STRIPE_SECRET_KEY が未設定の間は「デモ決済」にフォールバックし、
// /checkout/demo で疑似的に決済を完了させる（実際の課金は発生しない）。
// STRIPE_SECRET_KEY を設定したら、この関数の中身を Stripe Checkout Session
// 作成処理に差し替えるだけで本番決済に切り替えられる。
export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
