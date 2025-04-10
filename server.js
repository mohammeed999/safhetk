export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const version = "v3";
      
      if (url.pathname === '/' || url.pathname === '/index.html') {
        return new Response(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>صفحتك - لوحة التحكم</title>
    <link rel="stylesheet" href="/styles.css?v=${version}">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <header>
            <h1>لوحة تحكم صفحتك</h1>
            <div class="tabs">
                <button class="tab-btn active" data-tab="editor">محرر الصفحات</button>
                <button class="tab-btn" data-tab="pages">صفحاتي</button>
                <button class="tab-btn" data-tab="templates">قوالب جاهزة</button>
                <button class="tab-btn" data-tab="analytics">التحليلات</button>
            </div>
        </header>
        
        <main>
            <div id="editor-tab" class="tab-content active">
                <div class="editor-section">
                    <div class="form-group">
                        <label for="page-title">عنوان الصفحة:</label>
                        <input type="text" id="page-title" placeholder="أدخل عنوان الصفحة">
                    </div>
                    
                    <div class="form-group">
                        <label for="page-category">تصنيف الصفحة:</label>
                        <select id="page-category">
                            <option value="main">الصفحة الرئيسية</option>
                            <option value="blog">المدونة</option>
                            <option value="products">المنتجات</option>
                            <option value="services">الخدمات</option>
                            <option value="about">من نحن</option>
                            <option value="contact">اتصل بنا</option>
                            <option value="custom">تصنيف مخصص</option>
                        </select>
                        <input type="text" id="custom-category" placeholder="أدخل التصنيف المخصص" style="display: none;">
                    </div>
                    
                    <div class="form-group">
                        <label for="page-url">مسار الصفحة (URL):</label>
                        <input type="text" id="page-url" placeholder="مثال: about-us">
                    </div>
                    
                    <div class="form-group">
                        <label for="page-status">حالة النشر:</label>
                        <select id="page-status">
                            <option value="published">منشور</option>
                            <option value="draft">مسودة</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="page-privacy">خصوصية الصفحة:</label>
                        <select id="page-privacy">
                            <option value="public">عامة (مرئية للجميع)</option>
                            <option value="private">خاصة (فقط من لديه الرابط)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="html-editor">أدخل كود HTML:</label>
                        <textarea id="html-editor"></textarea>
                    </div>
                    
                    <div class="button-group">
                        <button id="preview-btn" class="btn primary">معاينة</button>
                        <button id="save-btn" class="btn success">حفظ ونشر</button>
                        <button id="clear-btn" class="btn danger">مسح</button>
                    </div>
                </div>
                
                <div class="preview-section">
                    <h2>معاينة الصفحة</h2>
                    <div class="preview-container">
                        <iframe id="preview-frame"></iframe>
                    </div>
                </div>
            </div>
            
            <div id="pages-tab" class="tab-content">
                <h2>الصفحات المحفوظة</h2>
                <div class="pages-grid" id="pages-list">
                    <!-- Pages will be listed here dynamically -->
                </div>
            </div>
            
            <div id="templates-tab" class="tab-content">
                <h2>قوالب جاهزة</h2>
                <p>اختر من مجموعة متنوعة من القوالب المصممة بعناية لتسريع إنشاء صفحاتك</p>
                
                <div class="templates-grid">
                    <div class="template-card" data-template="landing">
                        <div class="template-preview">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='10' fill='%23333'/%3E%3Crect y='15' width='100' height='30' fill='%23eee'/%3E%3Crect y='50' width='100' height='10' fill='%23ddd'/%3E%3C/svg%3E" alt="Landing Page">
                        </div>
                        <div class="template-info">
                            <h4>صفحة هبوط</h4>
                            <p>قالب مثالي للتسويق والعروض الترويجية</p>
                        </div>
                    </div>
                    
                    <div class="template-card" data-template="blog">
                        <div class="template-preview">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='65' height='10' fill='%23333'/%3E%3Crect y='15' width='100' height='5' fill='%23ddd'/%3E%3Crect y='25' width='100' height='5' fill='%23ddd'/%3E%3Crect y='35' width='80' height='5' fill='%23ddd'/%3E%3Crect y='45' width='100' height='5' fill='%23ddd'/%3E%3Crect y='55' width='90' height='5' fill='%23ddd'/%3E%3C/svg%3E" alt="Blog">
                        </div>
                        <div class="template-info">
                            <h4>مدونة</h4>
                            <p>قالب متكامل لكتابة ونشر المقالات</p>
                        </div>
                    </div>
                    
                    <div class="template-card" data-template="store">
                        <div class="template-preview">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='20' height='60' fill='%23eee'/%3E%3Crect x='25' width='75' height='25' fill='%23ddd'/%3E%3Crect x='25' y='30' width='22' height='30' fill='%23eee'/%3E%3Crect x='52' y='30' width='22' height='30' fill='%23eee'/%3E%3Crect x='79' y='30' width='21' height='30' fill='%23eee'/%3E%3C/svg%3E" alt="Online Store">
                        </div>
                        <div class="template-info">
                            <h4>متجر إلكتروني</h4>
                            <p>قالب جاهز لعرض وبيع منتجاتك</p>
                        </div>
                    </div>
                    
                    <div class="template-card" data-template="contact">
                        <div class="template-preview">
                            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Crect width='100' height='10' fill='%23333'/%3E%3Crect y='15' width='48' height='45' fill='%23eee'/%3E%3Crect x='52' y='15' width='48' height='10' fill='%23ddd'/%3E%3Crect x='52' y='30' width='48' height='10' fill='%23ddd'/%3E%3Crect x='52' y='45' width='48' height='10' fill='%23ddd'/%3E%3C/svg%3E" alt="Contact">
                        </div>
                        <div class="template-info">
                            <h4>اتصل بنا</h4>
                            <p>نموذج تواصل متكامل مع خريطة</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="analytics-tab" class="tab-content">
                <h2>تحليلات الموقع</h2>
                
                <div class="analytics-card">
                    <div class="analytics-header">
                        <h3>نظرة عامة</h3>
                        <div class="analytics-filter">
                            <button class="filter-btn active">7 أيام</button>
                            <button class="filter-btn">30 يوم</button>
                            <button class="filter-btn">هذا العام</button>
                        </div>
                    </div>
                    
                    <div class="stat-cards">
                        <div class="stat-card">
                            <div class="stat-value">1,245</div>
                            <div class="stat-label">زيارات</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">3:20</div>
                            <div class="stat-label">متوسط الوقت</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">845</div>
                            <div class="stat-label">زوار جدد</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">42%</div>
                            <div class="stat-label">معدل الارتداد</div>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <canvas id="visitsChart"></canvas>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <h3>أفضل الصفحات زيارة</h3>
                    <table class="analytics-table">
                        <thead>
                            <tr>
                                <th>الصفحة</th>
                                <th>الزيارات</th>
                                <th>معدل الارتداد</th>
                                <th>متوسط الوقت</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>الصفحة الرئيسية</td>
                                <td>450</td>
                                <td>35%</td>
                                <td>2:10</td>
                            </tr>
                            <tr>
                                <td>من نحن</td>
                                <td>280</td>
                                <td>40%</td>
                                <td>1:45</td>
                            </tr>
                            <tr>
                                <td>خدماتنا</td>
                                <td>220</td>
                                <td>28%</td>
                                <td>3:20</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js"></script>
    <script src="/script.js?v=${version}"></script>
</body>
</html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      if (url.pathname === '/styles.css') {
        return new Response(`
:root {
    --primary-color: #3498db;
    --success-color: #2ecc71;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
    --dark-color: #2c3e50;
    --light-color: #ecf0f1;
    --background-color: #f5f5f5;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Cairo', sans-serif;
    background-color: var(--background-color);
    color: #333;
    line-height: 1.6;
}

.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

header h1 {
    margin-bottom: 1rem;
    color: var(--dark-color);
}

/* Tabs */
.tabs {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #ddd;
    margin-bottom: 2rem;
}

.tab-btn {
    padding: 0.5rem 1.5rem;
    background: none;
    border: none;
    color: #555;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s;
}

.tab-btn.active {
    color: var(--primary-color);
    border-bottom: 3px solid var(--primary-color);
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

/* Layout */
main {
    width: 100%;
}

#editor-tab {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.editor-section {
    flex: 1;
    min-width: 400px;
}

.preview-section {
    flex: 1;
    min-width: 400px;
}

/* Form Styling */
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.form-group input, 
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: 'Cairo', sans-serif;
    font-size: 1rem;
}

.CodeMirror {
    height: 300px !important;
    border: 1px solid #ddd;
    border-radius: 4px;
    direction: ltr;
    text-align: left;
}

/* Buttons */
.button-group {
    display: flex;
    gap: 1rem;
    margin: 1.5rem 0;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-family: 'Cairo', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn.primary {
    background-color: var(--primary-color);
    color: white;
}

.btn.success {
    background-color: var(--success-color);
    color: white;
}

.btn.danger {
    background-color: var(--danger-color);
    color: white;
}

.btn.primary:hover {
    background-color: #2980b9;
}

.btn.success:hover {
    background-color: #27ae60;
}

.btn.danger:hover {
    background-color: #c0392b;
}

/* Preview */
.preview-container {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 500px;
    overflow: hidden;
}

#preview-frame {
    width: 100%;
    height: 100%;
    border: none;
}

/* Pages Grid */
.pages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.page-card {
    position: relative;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.page-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.page-status {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
}

.page-status.published {
    background-color: #d4edda;
    color: #155724;
}

.page-status.draft {
    background-color: #fff3cd;
    color: #856404;
}

.page-card h3 {
    margin-bottom: 0.5rem;
    color: var(--dark-color);
}

.page-card p {
    margin-bottom: 0.3rem;
    color: #555;
}

.page-card .page-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

/* Templates */
.templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

.template-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.template-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.template-preview {
    height: 120px;
    background-color: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
}

.template-info {
    padding: 1rem;
}

.template-info h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
}

.template-info p {
    margin: 0;
    font-size: 0.8rem;
    color: #6c757d;
}

/* Analytics */
.analytics-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.analytics-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.analytics-filter {
    display: flex;
    gap: 0.5rem;
}

.filter-btn {
    padding: 0.3rem 0.8rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
}

.filter-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.stat-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}

.stat-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 0.3rem;
}

.stat-label {
    font-size: 0.8rem;
    color: #6c757d;
}

.chart-container {
    height: 300px;
    margin-top: 1.5rem;
}

.analytics-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.analytics-table th, 
.analytics-table td {
    border-bottom: 1px solid #dee2e6;
    padding: 0.7rem;
    text-align: right;
}

.analytics-table th {
    background-color: #f8f9fa;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 1rem 0;
}

.empty-state p {
    margin: 0.5rem 0;
    color: #6c757d;
}

/* Responsive */
@media (max-width: 768px) {
    #editor-tab {
        flex-direction: column;
    }
    
    .editor-section, 
    .preview-section {
        min-width: 100%;
    }
    
    .tabs {
        flex-wrap: wrap;
    }
    
    .stat-cards {
        grid-template-columns: repeat(2, 1fr);
    }
}

.page-privacy {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
}

.page-privacy.public {
    background-color: #d1ecf1;
    color: #0c5460;
}

.page-privacy.private {
    background-color: #f8d7da;
    color: #721c24;
}

.page-card h3 {
    margin-bottom: 0.5rem;
    color: var(--dark-color);
}

.page-card p {
    margin-bottom: 0.3rem;
    color: #555;
}

.page-card .page-link {
    margin: 8px 0;
    font-size: 0.9rem;
    word-break: break-all;
    display: flex;
    align-items: center;
}

.page-card .page-link a {
    color: #3498db;
    text-decoration: none;
    margin-left: 8px;
}

.page-card .page-link .copy-link {
    background-color: #f1f1f1;
    border: none;
    color: #333;
    padding: 3px 8px;
    font-size: 0.8rem;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
}

.page-card .page-link .copy-link:hover {
    background-color: #e1e1e1;
}

.page-views {
    font-size: 0.8rem;
    color: #777;
    margin-top: 6px;
}

.page-card .page-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}
        `, {
          headers: { 'Content-Type': 'text/css' },
        });
      }

      if (url.pathname === '/script.js') {
        return new Response(`
document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror editor
    const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        lineWrapping: true
    });

    // Tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current tab
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Load data for specific tabs
            if (tabName === 'pages') {
                loadSavedPages();
            } else if (tabName === 'analytics') {
                initializeCharts();
            }
        });
    });

    // Custom category handling
    const categorySelect = document.getElementById('page-category');
    const customCategoryInput = document.getElementById('custom-category');
    
    categorySelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customCategoryInput.style.display = 'block';
        } else {
            customCategoryInput.style.display = 'none';
        }
    });

    // Preview functionality
    const previewBtn = document.getElementById('preview-btn');
    const previewFrame = document.getElementById('preview-frame');
    
    previewBtn.addEventListener('click', function() {
        const content = htmlEditor.getValue();
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        
        frameDoc.open();
        frameDoc.write(content);
        frameDoc.close();
    });

    // Save functionality
    const saveBtn = document.getElementById('save-btn');
    const pageTitle = document.getElementById('page-title');
    const pageUrl = document.getElementById('page-url');
    const pageStatus = document.getElementById('page-status');
    const pagePrivacy = document.getElementById('page-privacy');
    
    let currentEditingId = null;
    
    saveBtn.addEventListener('click', async function() {
        if (!pageTitle.value) {
            alert('يرجى إدخال عنوان الصفحة');
            return;
        }
        
        if (!pageUrl.value) {
            alert('يرجى إدخال مسار الصفحة');
            return;
        }
        
        const formData = {
            id: currentEditingId || generateUniqueId(),
            title: pageTitle.value,
            url: pageUrl.value,
            category: categorySelect.value === 'custom' ? customCategoryInput.value : categorySelect.value,
            published: pageStatus.value === 'published',
            privacy: pagePrivacy.value,
            htmlContent: htmlEditor.getValue(),
            updatedAt: new Date().toISOString()
        };
        
        try {
            // In a real app this would be an API call
            // For demo, we'll store in localStorage
            const pages = JSON.parse(localStorage.getItem('pages') || '[]');
            
            if (currentEditingId) {
                // Update existing page
                const index = pages.findIndex(p => p.id === currentEditingId);
                if (index !== -1) {
                    pages[index] = { ...pages[index], ...formData };
                }
            } else {
                // Add new page
                formData.views = 0;
                pages.push(formData);
            }
            
            localStorage.setItem('pages', JSON.stringify(pages));
            
            alert('تم حفظ الصفحة بنجاح!');
            clearForm();
            loadSavedPages();
            
            // Switch to pages tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            document.querySelector('[data-tab="pages"]').classList.add('active');
            document.getElementById('pages-tab').classList.add('active');
            
        } catch (error) {
            alert('حدث خطأ أثناء حفظ الصفحة');
            console.error(error);
        }
    });

    // Clear functionality
    const clearBtn = document.getElementById('clear-btn');
    
    clearBtn.addEventListener('click', clearForm);
    
    function clearForm() {
        pageTitle.value = '';
        pageUrl.value = '';
        categorySelect.selectedIndex = 0;
        customCategoryInput.style.display = 'none';
        pageStatus.selectedIndex = 0;
        pagePrivacy.selectedIndex = 0;
        htmlEditor.setValue('');
        
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write('');
        frameDoc.close();
        
        currentEditingId = null;
    }

    // Template selection
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            const templateType = this.getAttribute('data-template');
            loadTemplate(templateType);
            
            // Switch to editor tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            document.querySelector('[data-tab="editor"]').classList.add('active');
            document.getElementById('editor-tab').classList.add('active');
        });
    });
    
    function loadTemplate(templateType) {
        let templateHTML = '';
        let templateTitle = '';
        let templateUrl = '';
        
        switch(templateType) {
            case 'landing':
                templateTitle = 'صفحة الهبوط';
                templateUrl = 'landing-page';
                templateHTML = \`<div style="max-width:1200px;margin:0 auto;font-family:Arial,sans-serif">
                    <header style="background-color:#3498db;color:white;padding:40px 20px;text-align:center">
                        <h1>عنوان صفحتك الرئيسي</h1>
                        <p>وصف موجز لخدماتك أو منتجاتك</p>
                        <button style="background-color:#e74c3c;color:white;border:none;padding:10px 20px;font-size:16px;border-radius:5px;cursor:pointer">اطلب الآن</button>
                    </header>
                    <section style="padding:40px 20px;text-align:center">
                        <h2>مميزاتنا</h2>
                        <div style="display:flex;justify-content:space-between;max-width:800px;margin:0 auto;flex-wrap:wrap">
                            <div style="flex:1;min-width:200px;padding:20px">
                                <h3>ميزة 1</h3>
                                <p>وصف تفصيلي للميزة الأولى وكيف تفيد العملاء</p>
                            </div>
                            <div style="flex:1;min-width:200px;padding:20px">
                                <h3>ميزة 2</h3>
                                <p>وصف تفصيلي للميزة الثانية وكيف تفيد العملاء</p>
                            </div>
                            <div style="flex:1;min-width:200px;padding:20px">
                                <h3>ميزة 3</h3>
                                <p>وصف تفصيلي للميزة الثالثة وكيف تفيد العملاء</p>
                            </div>
                        </div>
                    </section>
                    <footer style="background-color:#2c3e50;color:white;padding:20px;text-align:center">
                        <p>جميع الحقوق محفوظة © 2023</p>
                    </footer>
                </div>\`;
                break;
                
            case 'blog':
                templateTitle = 'صفحة المدونة';
                templateUrl = 'blog';
                templateHTML = \`<div style="max-width:1000px;margin:0 auto;font-family:Arial,sans-serif;padding:20px">
                    <header style="margin-bottom:40px">
                        <h1>مدونتنا</h1>
                        <p>آخر الأخبار والمقالات</p>
                    </header>
                    <main>
                        <article style="margin-bottom:30px;border-bottom:1px solid #eee;padding-bottom:20px">
                            <h2>عنوان المقال الأول</h2>
                            <p style="color:#666">نشر بتاريخ: 15 يونيو 2023</p>
                            <p>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص...</p>
                            <a href="#" style="color:#3498db;text-decoration:none">اقرأ المزيد</a>
                        </article>
                        <article style="margin-bottom:30px;border-bottom:1px solid #eee;padding-bottom:20px">
                            <h2>عنوان المقال الثاني</h2>
                            <p style="color:#666">نشر بتاريخ: 10 يونيو 2023</p>
                            <p>هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص...</p>
                            <a href="#" style="color:#3498db;text-decoration:none">اقرأ المزيد</a>
                        </article>
                    </main>
                </div>\`;
                break;
                
            case 'contact':
                templateTitle = 'اتصل بنا';
                templateUrl = 'contact-us';
                templateHTML = \`<div style="max-width:800px;margin:0 auto;font-family:Arial,sans-serif;padding:20px">
                    <h1 style="text-align:center;margin-bottom:30px">اتصل بنا</h1>
                    <div style="display:flex;flex-wrap:wrap">
                        <div style="flex:1;min-width:300px;padding:20px">
                            <h2>معلومات التواصل</h2>
                            <p><strong>العنوان:</strong> شارع الرياض، المنطقة س، المدينة</p>
                            <p><strong>الهاتف:</strong> +966 12 345 6789</p>
                            <p><strong>البريد الإلكتروني:</strong> info@example.com</p>
                            <h3 style="margin-top:20px">ساعات العمل</h3>
                            <p>الأحد - الخميس: 9:00 ص - 5:00 م</p>
                            <p>الجمعة - السبت: مغلق</p>
                        </div>
                        <div style="flex:1;min-width:300px;padding:20px">
                            <h2>أرسل رسالة</h2>
                            <form>
                                <div style="margin-bottom:15px">
                                    <label style="display:block;margin-bottom:5px">الاسم</label>
                                    <input type="text" style="width:100%;padding:8px;border:1px solid #ddd" />
                                </div>
                                <div style="margin-bottom:15px">
                                    <label style="display:block;margin-bottom:5px">البريد الإلكتروني</label>
                                    <input type="email" style="width:100%;padding:8px;border:1px solid #ddd" />
                                </div>
                                <div style="margin-bottom:15px">
                                    <label style="display:block;margin-bottom:5px">الرسالة</label>
                                    <textarea style="width:100%;padding:8px;border:1px solid #ddd;height:100px"></textarea>
                                </div>
                                <button type="submit" style="background-color:#3498db;color:white;border:none;padding:10px 20px;cursor:pointer">إرسال</button>
                            </form>
                        </div>
                    </div>
                </div>\`;
                break;
                
            case 'store':
                templateTitle = 'متجر إلكتروني';
                templateUrl = 'store';
                templateHTML = \`<div style="max-width:1200px;margin:0 auto;font-family:Arial,sans-serif;padding:20px">
                    <header style="text-align:center;margin-bottom:40px">
                        <h1>متجرنا الإلكتروني</h1>
                        <p>تسوق أحدث المنتجات بأفضل الأسعار</p>
                    </header>
                    <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:20px">
                        <div style="border:1px solid #eee;border-radius:5px;overflow:hidden">
                            <div style="height:200px;background-color:#f5f5f5;display:flex;align-items:center;justify-content:center">
                                <div style="width:100px;height:100px;background-color:#ddd;border-radius:50%"></div>
                            </div>
                            <div style="padding:15px">
                                <h3>اسم المنتج</h3>
                                <p style="color:#777">وصف مختصر للمنتج</p>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:15px">
                                    <span style="font-weight:bold;font-size:18px">199 ريال</span>
                                    <button style="background-color:#3498db;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer">إضافة للسلة</button>
                                </div>
                            </div>
                        </div>
                        <div style="border:1px solid #eee;border-radius:5px;overflow:hidden">
                            <div style="height:200px;background-color:#f5f5f5;display:flex;align-items:center;justify-content:center">
                                <div style="width:100px;height:100px;background-color:#ddd;border-radius:50%"></div>
                            </div>
                            <div style="padding:15px">
                                <h3>اسم المنتج</h3>
                                <p style="color:#777">وصف مختصر للمنتج</p>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:15px">
                                    <span style="font-weight:bold;font-size:18px">299 ريال</span>
                                    <button style="background-color:#3498db;color:white;border:none;padding:8px 15px;border-radius:4px;cursor:pointer">إضافة للسلة</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>\`;
                break;
        }
        
        if (templateHTML) {
            pageTitle.value = templateTitle;
            pageUrl.value = templateUrl;
            htmlEditor.setValue(templateHTML);
            
            // Preview the template
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            frameDoc.open();
            frameDoc.write(templateHTML);
            frameDoc.close();
        }
    }

    // Function to load and display saved pages
    function loadSavedPages() {
        const pagesContainer = document.getElementById('pages-list');
        const pages = JSON.parse(localStorage.getItem('pages') || '[]');
        
        if (pages.length === 0) {
            pagesContainer.innerHTML = '<div class="empty-state"><p>لا توجد صفحات محفوظة بعد.</p><p>قم بإنشاء صفحة جديدة من تبويب المحرر.</p></div>';
            return;
        }
        
        const pagesHTML = pages.map(page => {
            const date = new Date(page.updatedAt);
            const formattedDate = date.toLocaleDateString('ar-SA');
            const privacyLabel = page.privacy === 'private' ? 'خاص' : 'عام';
            const privacyClass = page.privacy === 'private' ? 'private' : 'public';
            const statusClass = page.published ? 'published' : 'draft';
            const statusLabel = page.published ? 'منشور' : 'مسودة';
            
            return \`
            <div class="page-card">
                <div class="page-status \${statusClass}">\${statusLabel}</div>
                <h3>\${page.title}</h3>
                <p><strong>القسم:</strong> \${page.category}</p>
                <p><strong>تاريخ التحديث:</strong> \${formattedDate}</p>
                <p><strong>الخصوصية:</strong> <span class="privacy \${privacyClass}">\${privacyLabel}</span></p>
                <div class="page-views">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    \${page.views || 0} مشاهدة
                </div>
                <div class="page-actions">
                    <button class="btn" onclick="previewPage('\${page.id}')">معاينة</button>
                    <button class="btn success" onclick="editPage('\${page.id}')">تعديل</button>
                    <button class="btn danger" onclick="deletePage('\${page.id}')">حذف</button>
                    <button class="btn" onclick="copyPageLink('\${page.id}')">نسخ الرابط الدائم</button>
                </div>
            </div>
            \`;
        }).join('');
        
        pagesContainer.innerHTML = \`<div class="pages-grid">\${pagesHTML}</div>\`;
    }

    // Edit page
    window.editPage = function(pageId) {
        const pages = JSON.parse(localStorage.getItem('pages') || '[]');
        const page = pages.find(p => p.id === pageId);
        
        if (page) {
            pageTitle.value = page.title;
            pageUrl.value = page.url;
            
            // Set category
            const categoryExists = Array.from(categorySelect.options).some(opt => opt.value === page.category);
            if (categoryExists) {
                categorySelect.value = page.category;
                customCategoryInput.style.display = 'none';
            } else {
                categorySelect.value = 'custom';
                customCategoryInput.style.display = 'block';
                customCategoryInput.value = page.category;
            }
            
            pageStatus.value = page.published ? 'published' : 'draft';
            pagePrivacy.value = page.privacy || 'public';
            htmlEditor.setValue(page.htmlContent);
            
            // Preview
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            frameDoc.open();
            frameDoc.write(page.htmlContent);
            frameDoc.close();
            
            currentEditingId = pageId;
            
            // Switch to editor tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            document.querySelector('[data-tab="editor"]').classList.add('active');
            document.getElementById('editor-tab').classList.add('active');
        }
    };

    // Preview page in new window
    window.previewPage = function(pageId) {
        const pages = JSON.parse(localStorage.getItem('pages') || '[]');
        const page = pages.find(p => p.id === pageId);
        
        if (page) {
            // Increment views
            page.views = (page.views || 0) + 1;
            localStorage.setItem('pages', JSON.stringify(pages));
            
            // Open preview in new window
            const previewWindow = window.open('', '_blank');
            
            previewWindow.document.write(\`
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>\${page.title} - معاينة</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; }
                        .preview-bar { background-color: #2c3e50; color: white; padding: 10px; position: fixed; top: 0; left: 0; right: 0; z-index: 1000; display: flex; justify-content: space-between; align-items: center; }
                        .preview-bar .status { background-color: #f39c12; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 10px; }
                        .preview-actions button { background-color: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px; }
                        .preview-bar .close-btn { background-color: #e74c3c; }
                        .preview-content { margin-top: 50px; padding: 20px; }
                    </style>
                </head>
                <body>
                    <div class="preview-bar">
                        <div>
                            <span class="status">معاينة</span>
                            <span>مسار الصفحة: \${page.url}</span>
                        </div>
                        <div class="preview-actions">
                            <button onclick="window.opener.editPage('\${page.id}'); window.close();">تعديل</button>
                            <button class="close-btn" onclick="window.close()">إغلاق</button>
                        </div>
                    </div>
                    <div class="preview-content">\${page.htmlContent}</div>
                </body>
                </html>
            \`);
            
            previewWindow.document.close();
        }
    };

    // Copy page link to clipboard
    window.copyPageLink = function(pageId) {
        const pageUrl = \`\${window.location.origin}/p/\${pageId}\`;
        
        // Create a temporary input to copy the text
        const tempInput = document.createElement('input');
        tempInput.value = pageUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        alert('تم نسخ الرابط بنجاح');
    };

    // Delete page
    window.deletePage = function(pageId) {
        if (confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
            const pages = JSON.parse(localStorage.getItem('pages') || '[]');
            const filteredPages = pages.filter(p => p.id !== pageId);
            
            localStorage.setItem('pages', JSON.stringify(filteredPages));
            loadSavedPages();
        }
    };

    // Generate a unique ID for pages
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // Initialize analytics charts
    function initializeCharts() {
        const ctx = document.getElementById('visitsChart');
        
        if (ctx) {
            // Clear any existing chart
            if (window.visitsChart) {
                window.visitsChart.destroy();
            }
            
            // Sample data
            const data = {
                labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                datasets: [{
                    label: 'عدد الزيارات',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#3498db',
                    tension: 0.1
                }]
            };
            
            // Create chart
            window.visitsChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Filter buttons in analytics
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would fetch different date ranges of data
            // For demo, we'll just show different random data
            if (window.visitsChart) {
                const newData = Array.from({length: 7}, () => Math.floor(Math.random() * 100) + 20);
                window.visitsChart.data.datasets[0].data = newData;
                window.visitsChart.update();
            }
        });
    });

    // Initialize the app
    loadSavedPages();
});
        `, {
          headers: { 'Content-Type': 'application/javascript' },
        });
      }

      // API endpoints
      if (url.pathname === '/api/get-pages') {
        // In a real application, this would fetch from a database
        // For demonstration, returning sample data
        return new Response(JSON.stringify([
          {
            id: '1',
            title: 'الصفحة الرئيسية',
            url: 'home',
            category: 'main',
            published: true,
            views: 450,
            updatedAt: '2023-06-15T10:30:00.000Z',
            htmlContent: '<h1>مرحبًا بك في موقعنا</h1><p>هذا هو محتوى الصفحة الرئيسية</p>'
          },
          {
            id: '2',
            title: 'من نحن',
            url: 'about-us',
            category: 'about',
            published: true,
            views: 280,
            updatedAt: '2023-06-10T14:15:00.000Z',
            htmlContent: '<h1>من نحن</h1><p>معلومات عن الشركة</p>'
          },
          {
            id: '3',
            title: 'مقال جديد (مسودة)',
            url: 'new-article',
            category: 'blog',
            published: false,
            views: 0,
            updatedAt: '2023-06-20T09:45:00.000Z',
            htmlContent: '<h1>عنوان المقال</h1><p>محتوى المقال</p>'
          }
        ]), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      if (url.pathname.startsWith('/api/get-page/')) {
        const pageId = url.pathname.split('/').pop();
        
        // In a real application, this would fetch the specific page from a database
        // For demonstration, returning sample data based on the requested ID
        let pageData = {
          id: pageId,
          title: '',
          url: '',
          category: 'main',
          published: true,
          htmlContent: ''
        };
        
        // Sample data for demonstration
        if (pageId === '1') {
          pageData = {
            id: '1',
            title: 'الصفحة الرئيسية',
            url: 'home',
            category: 'main',
            published: true,
            views: 450,
            updatedAt: '2023-06-15T10:30:00.000Z',
            htmlContent: '<h1>مرحبًا بك في موقعنا</h1><p>هذا هو محتوى الصفحة الرئيسية</p>'
          };
        } else if (pageId === '2') {
          pageData = {
            id: '2',
            title: 'من نحن',
            url: 'about-us',
            category: 'about',
            published: true,
            views: 280,
            updatedAt: '2023-06-10T14:15:00.000Z',
            htmlContent: '<h1>من نحن</h1><p>معلومات عن الشركة</p>'
          };
        } else if (pageId === '3') {
          pageData = {
            id: '3',
            title: 'مقال جديد (مسودة)',
            url: 'new-article',
            category: 'blog',
            published: false,
            views: 0,
            updatedAt: '2023-06-20T09:45:00.000Z',
            htmlContent: '<h1>عنوان المقال</h1><p>محتوى المقال</p>'
          };
        }
        
        return new Response(JSON.stringify(pageData), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      if (url.pathname.startsWith('/pages/preview/')) {
        const pageId = url.pathname.split('/').pop();
        
        // In a real application, this would fetch the page content from a database
        // and serve it as a complete HTML page
        
        // For demonstration, serving a preview page
        return new Response(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>معاينة الصفحة</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Cairo', sans-serif;
            margin: 0;
            padding: 0;
        }
        .preview-bar {
            background-color: #2c3e50;
            color: white;
            padding: 10px;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .preview-bar .status {
            background-color: #f39c12;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-right: 10px;
        }
        .preview-actions button {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 5px;
        }
        .preview-bar .close-btn {
            background-color: #e74c3c;
        }
        .preview-content {
            margin-top: 50px;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="preview-bar">
        <div>
            <span class="status">معاينة</span>
            <span id="pagePath"></span>
        </div>
        <div class="preview-actions">
            <button onclick="window.location.href='/'">تعديل</button>
            <button class="close-btn" onclick="window.close()">إغلاق</button>
        </div>
    </div>
    <div class="preview-content" id="previewContent"></div>
    
    <script>
        // In a real application, this would fetch the page content from a database
        async function loadPreviewContent() {
            try {
                const response = await fetch('/api/get-page/${pageId}');
                const pageData = await response.json();
                
                document.title = pageData.title + ' - معاينة';
                document.getElementById('pagePath').textContent = 'مسار الصفحة: ' + pageData.url;
                document.getElementById('previewContent').innerHTML = pageData.htmlContent;
            } catch (error) {
                document.getElementById('previewContent').innerHTML = '<p>حدث خطأ أثناء تحميل المحتوى</p>';
            }
        }
        
        loadPreviewContent();
    </script>
</body>
</html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      if (url.pathname.startsWith('/api/delete-page/')) {
        const pageId = url.pathname.split('/').pop();
        // In a real application, this would delete from a database
        return new Response(JSON.stringify({ 
          success: true 
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      // Rest of the API endpoints remain the same
      if (url.pathname === '/api/save-page' && request.method === 'POST') {
        const data = await request.json();
        const { id, title, url: pageUrl, category, htmlContent, published } = data;
        
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

        // In a real application, this would save to a database
        const isNewPage = !id;
        const newId = id || Date.now().toString();

        return new Response(JSON.stringify({ 
          success: true,
          id: newId,
          isNewPage,
          path: `/pages/${category}/${pageUrl}.html`
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      }

      // Handle permanent page links
      if (url.pathname.startsWith('/p/')) {
        const pageId = url.pathname.replace('/p/', '');
        
        // In a real application, this would fetch the page from a database
        // For now, we'll use localStorage data that would be stored client-side
        return new Response(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحميل الصفحة...</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Cairo', sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .page-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .error-container {
            text-align: center;
            padding: 50px 20px;
        }
        .error-container h1 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        .loading {
            text-align: center;
            padding: 50px 0;
        }
        .loading-spinner {
            display: inline-block;
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .page-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 0.9rem;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="page-container">
        <div class="loading" id="loading">
            <div class="loading-spinner"></div>
            <p>يتم تحميل الصفحة...</p>
        </div>
        
        <div id="page-content" style="display: none;"></div>
        
        <div class="error-container" id="error-container" style="display: none;">
            <h1>عذراً، لم يتم العثور على الصفحة</h1>
            <p>قد تكون الصفحة غير موجودة أو تم حذفها أو أنها خاصة.</p>
            <a href="/" style="display: inline-block; padding: 10px 15px; background-color: #3498db; color: white; text-decoration: none; border-radius: 4px;">العودة للرئيسية</a>
        </div>
        
        <div class="page-footer">
            <p>تم إنشاء هذه الصفحة باستخدام <a href="/" style="color: #3498db; text-decoration: none;">صفحتك</a></p>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const pageId = '${pageId}';
            const pageContent = document.getElementById('page-content');
            const loading = document.getElementById('loading');
            const errorContainer = document.getElementById('error-container');
            
            // In a real application, this would be an API call to a database
            // For demo, we'll just try to load from localStorage
            function loadPage() {
                try {
                    // Try to get the page from localStorage
                    const pages = JSON.parse(localStorage.getItem('pages') || '[]');
                    const page = pages.find(p => p.id === pageId);
                    
                    setTimeout(() => {
                        if (page) {
                            // Page found, display it
                            document.title = page.title;
                            pageContent.innerHTML = page.htmlContent;
                            pageContent.style.display = 'block';
                            loading.style.display = 'none';
                            
                            // Increment view count
                            page.views = (page.views || 0) + 1;
                            localStorage.setItem('pages', JSON.stringify(pages));
                        } else {
                            // Page not found
                            errorContainer.style.display = 'block';
                            loading.style.display = 'none';
                        }
                    }, 1000); // Simulate loading delay
                } catch (error) {
                    console.error('Error loading page:', error);
                    errorContainer.style.display = 'block';
                    loading.style.display = 'none';
                }
            }
            
            // Call API to get page data 
            // Use fetch in a real application
            loadPage();
            
            // In a real application, we would use an API call instead
            // fetch('/api/pages/' + pageId)
            //     .then(response => {
            //         if (!response.ok) throw new Error('Page not found');
            //         return response.json();
            //     })
            //     .then(page => {
            //         document.title = page.title;
            //         pageContent.innerHTML = page.htmlContent;
            //         pageContent.style.display = 'block';
            //         loading.style.display = 'none';
            //     })
            //     .catch(error => {
            //         console.error('Error loading page:', error);
            //         errorContainer.style.display = 'block';
            //         loading.style.display = 'none';
            //     });
        });
    </script>
</body>
</html>
        `, {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      return new Response('الصفحة غير موجودة', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    } catch (error) {
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