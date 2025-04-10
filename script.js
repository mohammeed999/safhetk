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
            id: currentEditingId,
            title: pageTitle.value,
            url: pageUrl.value,
            category: categorySelect.value === 'custom' ? customCategoryInput.value : categorySelect.value,
            published: pageStatus.value === 'published',
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
                formData.id = Date.now().toString();
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
                templateHTML = `<div style="max-width:1200px;margin:0 auto;font-family:Arial,sans-serif">
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
                </div>`;
                break;
                
            case 'blog':
                templateTitle = 'صفحة المدونة';
                templateUrl = 'blog';
                templateHTML = `<div style="max-width:1000px;margin:0 auto;font-family:Arial,sans-serif;padding:20px">
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
                </div>`;
                break;
                
            case 'contact':
                templateTitle = 'اتصل بنا';
                templateUrl = 'contact-us';
                templateHTML = `<div style="max-width:800px;margin:0 auto;font-family:Arial,sans-serif;padding:20px">
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
                </div>`;
                break;
                
            case 'store':
                templateTitle = 'متجر إلكتروني';
                templateUrl = 'store';
                templateHTML = `<div style="max-width:1200px;margin:0 auto;font-family:Arial,sans-serif;padding:20px">
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
                </div>`;
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

    // Load saved pages
    function loadSavedPages() {
        const pagesList = document.getElementById('pages-list');
        const pages = JSON.parse(localStorage.getItem('pages') || '[]');
        
        if (pages.length === 0) {
            pagesList.innerHTML = '<div class="empty-state" style="text-align:center;padding:2rem;background:#f8f9fa;border-radius:8px;margin:1rem 0;"><p>لا توجد صفحات محفوظة حتى الآن</p><p>أنشئ أول صفحة وانطلق نحو النجاح!</p></div>';
            return;
        }
        
        let html = '';
        
        pages.forEach(page => {
            html += `
                <div class="page-card">
                    <div class="page-status ${page.published ? 'published' : 'draft'}">
                        ${page.published ? 'منشور' : 'مسودة'}
                    </div>
                    <h3>${page.title}</h3>
                    <p>المسار: ${page.url}</p>
                    <p>التصنيف: ${page.category}</p>
                    <p style="margin-top:0.5rem;font-size:0.8rem;color:#666">
                        <span>الزيارات: ${page.views || 0}</span> | 
                        <span>تحديث: ${new Date(page.updatedAt).toLocaleDateString('ar-SA')}</span>
                    </p>
                    <div class="page-actions">
                        <button onclick="editPage('${page.id}')" class="btn primary">تعديل</button>
                        <button onclick="previewPage('${page.id}')" class="btn success">معاينة</button>
                        <button onclick="deletePage('${page.id}')" class="btn danger">حذف</button>
                    </div>
                </div>
            `;
        });
        
        pagesList.innerHTML = html;
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
            
            previewWindow.document.write(`
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${page.title} - معاينة</title>
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
                            <span>مسار الصفحة: ${page.url}</span>
                        </div>
                        <div class="preview-actions">
                            <button onclick="window.opener.editPage('${page.id}'); window.close();">تعديل</button>
                            <button class="close-btn" onclick="window.close()">إغلاق</button>
                        </div>
                    </div>
                    <div class="preview-content">${page.htmlContent}</div>
                </body>
                </html>
            `);
            
            previewWindow.document.close();
        }
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

    // Initialize the page
    loadSavedPages();
});