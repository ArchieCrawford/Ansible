/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bridge Netlify Supabase extension env vars (server-only names)
  // to the NEXT_PUBLIC_* names our browser client expects.
  // Inlined at build time, so safe for client bundles.
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.SUPABASE_URL ||
      '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      ''
  }
}

export default nextConfig

