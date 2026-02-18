import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.4'
import { createClient } from 'jsr:@supabase/supabase-js@2'

// Preparation for Deno runtime
env.useBrowserCache = false
env.allowLocalModels = false

const supabase = createClient(
  'https://xyzcompany.supabase.co',
  'public-anon-key',
)

// Construct pipeline outside of serve for faster warm starts
const pipe = await pipeline(
  'feature-extraction',
  'Supabase/gte-small',
)

// Deno Handler
serve(async (req) => {

  const { input } = await req.json()

  // Generate the embedding from the user input
  const output = await pipe(input, {
    pooling: 'mean',
    normalize: true,
  })

  // Get the embedding output
  const embedding = Array.from(output.data)

  // Return the embedding
  return new Response(
    JSON.stringify({ embedding }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})

