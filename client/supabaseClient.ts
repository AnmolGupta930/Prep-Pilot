import { createClient } from "@supabase/supabase-js";
const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

if (!PROJECT_URL || !API_KEY) {
  throw new Error('Missing Supabase environment variables');
}
export const supabase = createClient(
    PROJECT_URL,
    API_KEY,
);