export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const version = "v1"; // Add version to avoid caching issues
      
      // Serve static files
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام إدارة المحتوى</title>
    <link rel="stylesheet" href="/styles.css?v=${version}">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="site-header">
            <h1>نظام إدارة المحتوى</h1>
            <p class="subtitle">قم بإنشاء وإدارة صفحات الموقع بسهولة</p>
        </header>
        
        <main class="main-content">
            <form id="pageForm" class="form-container">
                <div class="form-group">
                    <label for="title">عنوان الصفحة</label>
                    <input type="text" id="title" name="title" required 
                           placeholder="أدخل عنوان الصفحة">
                </div>

                <div class="form-group">
                    <label for="url">رابط الصفحة</label>
                    <input type="text" id="url" name="url" required
                           placeholder="مثال: about-us">
                    <small class="input-hint">استخدم الحروف الإنجليزية والأرقام والشرطة (-) فقط</small>
                </div>

                <div class="form-row">
                    <div class="form-group category-group">
                        <label for="category">التصنيف</label>
                        <select id="category" name="category">
                            <option value="general">عام</option>
                            <option value="news">أخبار</option>
                            <option value="articles">مقالات</option>
                            <option value="services">خدمات</option>
                            <option value="custom">تصنيف مخصص</option>
                        </select>
                    </div>

                    <div id="customCategoryContainer" class="form-group" style="display: none;">
                        <label for="customCategory">التصنيف المخصص</label>
                        <input type="text" id="customCategory" name="customCategory"
                               placeholder="أدخل اسم التصنيف">
                    </div>
                </div>

                <div class="form-group">
                    <label for="htmlContent">محتوى الصفحة (HTML)</label>
                    <div class="editor-toolbar">
                        <button type="button" class="toolbar-btn" onclick="insertHTML('<h2>', '</h2>')">عنوان</button>
                        <button type="button" class="toolbar-btn" onclick="insertHTML('<p>', '</p>')">فقرة</button>
                        <button type="button" class="toolbar-btn" onclick="insertHTML('<strong>', '</strong>')">عريض</button>
                        <button type="button" class="toolbar-btn" onclick="insertHTML('<em>', '</em>')">مائل</button>
                        <button type="button" class="toolbar-btn" onclick="insertHTML('<ul>\\n  <li>', '</li>\\n</ul>')">قائمة</button>
                    </div>
                    <textarea id="htmlContent" name="htmlContent" rows="12" required
                              placeholder="أدخل محتوى الصفحة باستخدام HTML"></textarea>
                </div>

                <div class="form-actions">
                    <button type="submit" class="submit-btn">
                        <span class="btn-text">حفظ الصفحة</span>
                        <span class="btn-icon">✓</span>
                    </button>
                    <button type="reset" class="reset-btn">
                        <span class="btn-text">مسح النموذج</span>
                        <span class="btn-icon">×</span>
                    </button>
                </div>
            </form>

            <div id="message" class="message"></div>
        </main>
    </div>
    <script src="/script.js?v=${version}"></script>
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
    font-family: 'Cairo', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    direction: rtl;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.site-header {
    text-align: center;
    margin-bottom: 40px;
    padding: 20px;
    background: linear-gradient(135deg, #2c3e50, #3498db);
    border-radius: 12px;
    color: white;
}

h1 {
    margin: 0;
    font-size: 2.5em;
    font-weight: 700;
}

.subtitle {
    margin: 10px 0 0;
    font-size: 1.1em;
    opacity: 0.9;
}

.main-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1em;
}

.input-hint {
    color: #666;
    font-size: 0.9em;
    margin-top: 4px;
}

input, select, textarea {
    padding: 12px;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-size: 1em;
    font-family: inherit;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

textarea {
    resize: vertical;
    min-height: 200px;
}

.editor-toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
}

.toolbar-btn {
    padding: 8px 15px;
    border: none;
    border-radius: 6px;
    background: #e1e8ed;
    color: #2c3e50;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9em;
    transition: all 0.3s;
}

.toolbar-btn:hover {
    background: #d1d8dd;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.submit-btn, .reset-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-family: inherit;
}

.submit-btn {
    background-color: #2ecc71;
    color: white;
    flex: 2;
}

.submit-btn:hover {
    background-color: #27ae60;
}

.reset-btn {
    background-color: #e74c3c;
    color: white;
    flex: 1;
}

.reset-btn:hover {
    background-color: #c0392b;
}

.btn-icon {
    font-size: 1.2em;
}

.message {
    margin-top: 25px;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    opacity: 0;
    transition: opacity 0.3s;
}

.message.show {
    opacity: 1;
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

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .container {
        padding: 10px;
    }
    
    .main-content {
        padding: 20px;
    }
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
        
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'جاري الحفظ...';
        
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
                showMessage('تم حفظ الصفحة بنجاح! ✓', 'success');
                form.reset();
            } else {
                showMessage(result.error || 'حدث خطأ أثناء حفظ الصفحة ✗', 'error');
            }
        } catch (error) {
            showMessage('حدث خطأ في الاتصال بالخادم ✗', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'حفظ الصفحة';
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type + ' show';
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    }
});

// HTML Editor Helper Functions
window.insertHTML = function(startTag, endTag) {
    const textarea = document.getElementById('htmlContent');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = startTag + selectedText + endTag;
    
    textarea.value = textarea.value.substring(0, start) + 
                    replacement + 
                    textarea.value.substring(end);
    
    textarea.focus();
    textarea.setSelectionRange(start + startTag.length, 
                             start + startTag.length + selectedText.length);
}
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