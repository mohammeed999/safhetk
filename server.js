export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
      // Serve static files
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>HTML Content Management</title>
              <link rel="stylesheet" href="/styles.css">
          </head>
          <body>
              <div id="app">
                  <h1>HTML Content Management</h1>
                  <!-- Your HTML content -->
              </div>
              <script src="/script.js"></script>
          </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // Serve CSS file
      if (url.pathname === '/styles.css') {
        return new Response(`
          /* Your CSS content */
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
          }
        `, {
          headers: { 'Content-Type': 'text/css' },
        });
      }

      // Serve JavaScript file
      if (url.pathname === '/script.js') {
        return new Response(`
          // Your JavaScript content
          console.log('App initialized');
        `, {
          headers: { 'Content-Type': 'application/javascript' },
        });
      }

      // Handle API requests
      if (url.pathname === '/api/save-page' && request.method === 'POST') {
        const data = await request.json();
        const { title, url: pageUrl, category, customCategory, htmlContent } = data;
        
        if (!title || !pageUrl || !htmlContent) {
          return new Response(JSON.stringify({ 
            error: 'Missing required fields' 
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
          });
        }

        // In a real application, you would store this in Cloudflare KV
        // For now, we'll just return success
        return new Response(JSON.stringify({ 
          success: true,
          path: `/pages/${category}/${pageUrl}.html`
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      // Return 404 for unknown routes
      return new Response('Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (error) {
      // Return error response
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
  },
};