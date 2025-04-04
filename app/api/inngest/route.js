import { inngest } from "@/lib/inngest/client";

import { serve } from "inngest/next";
import { generateIndustryInsights } from "@/lib/inngest/function";



// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({  // here v create a api for get post put 
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    generateIndustryInsights,
  ],
});
