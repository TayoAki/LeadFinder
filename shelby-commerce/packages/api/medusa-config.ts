import { loadEnv } from '@medusajs/framework/utils'
import { withMercur } from '@mercurjs/core'
import fs from 'fs'
import path from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Stripe Connect (Mercur's @mercurjs/stripe-connector-plugin) switches on when STRIPE_SECRET_KEY and
// both webhook signing secrets are set: card payments for the whole multi-seller cart, Express accounts for sellers, per-order
// payouts minus commission, and nightly settlements to each seller's bank. Without the key the
// marketplace keeps the system (test) payment provider.
// All three are required by the plugin; Stripe stays off until every one is set.
const STRIPE_KEY =
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_OPERATOR_WEBHOOK_SECRET && process.env.STRIPE_SELLERS_WEBHOOK_SECRET
    ? process.env.STRIPE_SECRET_KEY
    : undefined
const PUBLIC_URL = process.env.MERCUR_BACKEND_URL || 'http://localhost:9000'
const stripe = STRIPE_KEY
  ? {
      plugins: [
        {
          resolve: '@mercurjs/stripe-connector-plugin',
          options: { apiKey: STRIPE_KEY, webhookSecret: process.env.STRIPE_SELLERS_WEBHOOK_SECRET },
        },
      ],
      modules: [
        {
          resolve: '@medusajs/medusa/payment',
          options: {
            providers: [
              {
                resolve: '@mercurjs/stripe-connector-plugin/providers/payment-stripe',
                id: 'stripe',
                options: { apiKey: STRIPE_KEY, webhookSecret: process.env.STRIPE_OPERATOR_WEBHOOK_SECRET },
              },
            ],
          },
        },
        {
          resolve: '@mercurjs/core/modules/payout',
          options: {
            providers: [
              {
                resolve: '@mercurjs/stripe-connector-plugin/providers/payout-stripe-connect',
                id: 'stripe',
                options: { apiKey: STRIPE_KEY, webhookSecret: process.env.STRIPE_SELLERS_WEBHOOK_SECRET, manualPayouts: true },
              },
            ],
            onboarding: {
              returnUrl: `${process.env.MERCUR_VENDOR_URL || `${PUBLIC_URL}/seller`}/stripe`,
              refreshBaseUrl: PUBLIC_URL,
            },
          },
        },
      ],
    }
  : {
      // The panels' Vite build reads this file to find plugin UI extensions (the operator's
      // Settings -> Stripe screens, the seller's payouts onboarding). List the plugin while the
      // panels build so those screens ship; the backend registers it only when the keys are set.
      plugins: process.argv.some((a) => /[\\/]vite([\\/]|\.js$|$)/.test(a)) ? [{ resolve: '@mercurjs/stripe-connector-plugin', options: {} }] : [],
      modules: [],
    }

// Resolves where a dashboard app lives:
// - in the source tree (development): ../../apps/<name>
// - in the production build artifact: hosts that deploy only `.medusa/server` (for example
//   Medusa Cloud) get the panels bundled into ./dashboards/<name> by
//   scripts/bundle-dashboards.mjs during `build`. The compiled config runs from the
//   artifact root, so __dirname points there.
const dashboardAppDir = (name: string) => {
  const bundled = path.join(__dirname, 'dashboards', name)
  return fs.existsSync(bundled) ? bundled : path.join(__dirname, `../../apps/${name}`)
}

module.exports = withMercur({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Optional: sessions and cache in Redis when REDIS_URL is set (production); in-memory otherwise.
    ...(process.env.REDIS_URL ? { redisUrl: process.env.REDIS_URL } : {}),
    // "shared" (default) runs the API and background jobs in one process; split into "server" and
    // "worker" instances when traffic needs it (see Mercur's self-host guide).
    workerMode: (process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server") || "shared",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      vendorCors: process.env.VENDOR_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  featureFlags: {
    seller_registration: true
  },
  plugins: stripe.plugins,
  modules: [
    ...stripe.modules,
    {
      resolve: '@mercurjs/core/modules/admin-ui',
      options: {
        appDir: dashboardAppDir('admin'),
        path: '/dashboard',
      }
    },
    {
      resolve: '@mercurjs/core/modules/vendor-ui',
      options: {
        appDir: dashboardAppDir('vendor'),
        path: '/seller',
      }
    },
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-local',
            id: 'local',
            options: {
              // The local provider bakes this into every uploaded file URL.
              // It must be the publicly reachable origin in production, or
              // images resolve to localhost and render broken.
              backend_url: process.env.FILE_BACKEND_URL || 'http://localhost:9000/static',
            },
          },
        ],
      },
    },
  ],
})
