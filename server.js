export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve static files
    if (url.pathname === '/') {
      const response = await fetch(new URL('./index.html', import.meta.url));
      return new Response(response.body, {
        headers: { 'content-type': 'text/html' },
      });
    }

    if (url.pathname.startsWith('/pages/')) {
      const response = await fetch(new URL('.' + url.pathname, import.meta.url));
      return new Response(response.body, {
        headers: { 'content-type': 'text/html' },
      });
    }

    if (url.pathname === '/api/save-page' && request.method === 'POST') {
      const data = await request.json();
      const { title, url: pageUrl, category, customCategory, htmlContent } = data;
      
      if (!title || !pageUrl || !htmlContent) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }

      // Store in KV (you'll need to set up KV namespace in Cloudflare)
      const categoryPath = category === 'custom' ? customCategory : category;
      const path = `/pages/${categoryPath}/${pageUrl}.html`;
      
      return new Response(JSON.stringify({ 
        success: true, 
        path: path 
      }), {
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};