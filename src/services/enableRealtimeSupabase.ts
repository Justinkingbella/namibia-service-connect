
import { supabase } from '@/integrations/supabase/client';

/**
 * Enable Supabase realtime for specific tables
 */
export async function enableSupabaseRealtime() {
  try {
    console.log('Enabling Supabase realtime for tables...');
    
    // Tables that require realtime updates
    const tables = [
      'profiles',
      'services',
      'bookings',
      'service_providers',
      'customers',
      'favorite_services',
      'reviews'
    ];
    
    // Enable realtime for each table
    for (const table of tables) {
      try {
        // Using direct channel subscriptions instead of RPC
        const channel = supabase.channel(`table-${table}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: table
          }, (payload) => {
            console.log(`Change in ${table}:`, payload);
          })
          .subscribe();
          
        console.log(`Realtime enabled for ${table}`);
      } catch (tableError) {
        console.error(`Error enabling realtime for ${table}:`, tableError);
      }
    }
    
    // Set up table replication if needed
    await supabase.from('services').select('id').limit(1);
    await supabase.from('bookings').select('id').limit(1);
    await supabase.from('profiles').select('id').limit(1);
    
    console.log('Supabase realtime setup completed');
    return true;
  } catch (error) {
    console.error('Error in enableSupabaseRealtime:', error);
    return false;
  }
}
