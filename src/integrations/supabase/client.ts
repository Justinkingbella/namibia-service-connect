// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mdlhrwjaprpsjpgcbubl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbGhyd2phcHJwc2pwZ2NidWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0OTA4MjAsImV4cCI6MjA1OTA2NjgyMH0._2NFei6QA8flBMIm5FyJC6c7dkLgKfJ-9RAz-wNbaYE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);