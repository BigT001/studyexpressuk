# Stripe Webhook Setup - Quick Guide

## What You Just Saw

The Stripe CLI dialog shows three steps for local testing:

```bash
# Step 1: Login to Stripe
stripe login

# Step 2: Forward webhook events to your local app
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Step 3: Test by triggering an event
stripe trigger payment_intent.succeeded
```

---

## For Local Development (What to Do Now)

### Option A: Using Stripe CLI (Recommended for Testing)

1. **Download Stripe CLI** from: https://stripe.com/docs/stripe-cli

2. **Login to your Stripe account:**
   ```bash
   stripe login
   ```

3. **Start the webhook listener:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook signing secret** that appears in terminal (starts with `whsec_test_`)

5. **Update `.env.local`:**
   ```
   STRIPE_WEBHOOK_SECRET="whsec_test_xxxxx"  # Paste the secret from step 4
   ```

---

## For Production Deployment

### In Stripe Dashboard:

1. Go to **Developers** → **Webhooks**

2. Click **Add endpoint**

3. Enter webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

4. Select events to listen for:
   - ✓ `checkout.session.completed`
   - ✓ `payment_intent.succeeded`
   - ✓ `payment_intent.payment_failed`

5. Click **Create endpoint**

6. Copy the **Signing secret** (starts with `whsec_`)

7. Add to production `.env`:
   ```
   STRIPE_WEBHOOK_SECRET="whsec_live_xxxxx"
   ```

---

## Testing the Payment Flow

### Test Card Numbers:

| Card | Status | Number |
|------|--------|--------|
| Success | ✓ | `4242 4242 4242 4242` |
| Decline | ✗ | `4000 0000 0000 0002` |
| 3D Secure | 🔐 | `4000 0025 0000 3155` |

**Any future expiry date & any 3-digit CVC**

---

## Files Created

✅ **Webhook Endpoint**: `/api/webhooks/stripe/route.ts`  
✅ **Checkout Endpoint**: `/api/memberships/checkout.ts`  
✅ **Payment UI Component**: `/components/MembershipCard.tsx`  
✅ **Public Memberships Page**: `/app/memberships/page.tsx`  
✅ **Success Page**: `/app/membership/success/page.tsx`  

---

## Next Steps

1. ✅ Install Stripe: `pnpm install stripe` (Already done!)
2. ⏳ Download Stripe CLI
3. ⏳ Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. ⏳ Copy webhook signing secret to `.env.local`
5. ⏳ Test payment with test card `4242 4242 4242 4242`

---

## Webhook Flow

```
User clicks "Choose Plan"
        ↓
API creates Stripe checkout session
        ↓
User redirected to Stripe checkout
        ↓
User enters payment details
        ↓
Payment processed by Stripe
        ↓
Stripe sends webhook event to your app
        ↓
Webhook handler updates user membership status in database
        ↓
User redirected to success page
```

---

## Need Help?

- Stripe CLI Docs: https://stripe.com/docs/stripe-cli
- Webhook Testing: https://stripe.com/docs/testing
- Contact: support@studyexpressuk.com
