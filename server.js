export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      
      // Serve static files
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إدارة صفحات HTML</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="container">
        <h1>إدارة صفحات HTML</h1>
        
        <form id="pageForm" class="form-container">
            <div class="form-group">
                <label for="title">عنوان الصفحة:</label>
                <input type="text" id="title" name="title" required>
            </div>

            <div class="form-group">
                <label for="url">رابط الصفحة:</label>
                <input type="text" id="url" name="url" required>
            </div>

            <div class="form-group">
                <label for="category">التصنيف:</label>
                <select id="category" name="category">
                    <option value="general">عام</option>
                    <option value="news">أخبار</option>
                    <option value="articles">مقالات</option>
                    <option value="custom">تصنيف مخصص</option>
                </select>
            </div>

            <div id="customCategoryContainer" class="form-group" style="display: none;">
                <label for="customCategory">التصنيف المخصص:</label>
                <input type="text" id="customCategory" name="customCategory">
            </div>

            <div class="form-group">
                <label for="htmlContent">محتوى HTML:</label>
                <textarea id="htmlContent" name="htmlContent" rows="10" required></textarea>
            </div>

            <button type="submit" class="submit-btn">حفظ الصفحة</button>
        </form>

        <div id="message" class="message"></div>
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
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    direction: rtl;
}

.container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 30px;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-weight: bold;
    color: #34495e;
}

input, select, textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

textarea {
    resize: vertical;
    min-height: 150px;
}

.submit-btn {
    background-color: #3498db;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background-color: #2980b9;
}

.message {
    margin-top: 20px;
    padding: 10px;
    border-radius: 4px;
    text-align: center;
}

.message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
        `, {
          headers: { 'Content-Type': 'text/css' },
        });
      }

      // Serve JavaScript file
      if (url.pathname === '/script.js') {
        return new Response(`
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pageForm');
    const category = document.getElementById('category');
    const customCategoryContainer = document.getElementById('customCategoryContainer');
    const messageDiv = document.getElementById('message');

    // Show/hide custom category input
    category.addEventListener('change', function() {
        customCategoryContainer.style.display = 
            this.value === 'custom' ? 'block' : 'none';
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value,
            url: document.getElementById('url').value,
            category: category.value,
            customCategory: document.getElementById('customCategory').value,
            htmlContent: document.getElementById('htmlContent').value
        };

        try {
            const response = await fetch('/api/save-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showMessage('تم حفظ الصفحة بنجاح!', 'success');
                form.reset();
            } else {
                showMessage(result.error || 'حدث خطأ أثناء حفظ الصفحة', 'error');
            }
        } catch (error) {
            showMessage('حدث خطأ في الاتصال بالخادم', 'error');
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 5000);
    }
});
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
            error: 'جميع الحقول مطلوبة' 
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
          });
        }

        // In a real application, you would store this in Cloudflare KV
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
      return new Response('الصفحة غير موجودة', { 
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