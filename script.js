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

    // =================== Animations and UI Enhancements ===================
    // Add animation to cards and sections
    const animateElements = document.querySelectorAll('.editor-section, .preview-section, #saved-pages, .templates-section, .analytics-section, .code-viewer-section, .page-card, .template-card, .project-card');
    
    animateElements.forEach(element => {
        // Add subtle entrance animation
        element.classList.add('animated');
        
        // Add hover effects through CSS classes already defined
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // Check for saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            this.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            this.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('darkMode', 'disabled');
        }
        
        // Add animation effect
        this.classList.add('rotate-animation');
        setTimeout(() => {
            this.classList.remove('rotate-animation');
        }, 500);
    });

    // Preview Device Controls
    const previewDeviceBtns = document.querySelectorAll('.preview-device-btn');
    const previewContainer = document.querySelector('.preview-container');
    
    previewDeviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            previewDeviceBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update preview container based on device
            const device = this.getAttribute('data-device');
            
            switch(device) {
                case 'desktop':
                    previewContainer.style.width = '100%';
                    previewContainer.style.height = '400px';
                    break;
                case 'tablet':
                    previewContainer.style.width = '768px';
                    previewContainer.style.height = '500px';
                    previewContainer.style.margin = '0 auto';
                    break;
                case 'mobile':
                    previewContainer.style.width = '375px';
                    previewContainer.style.height = '600px';
                    previewContainer.style.margin = '0 auto';
                    break;
            }
        });
    });

    // Tab navigation with enhanced animation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all tabs with animation
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.style.opacity = '0';
                setTimeout(() => {
                    content.classList.remove('active');
                }, 300);
            });
            
            // Add active class to current tab with animation
            button.classList.add('active');
            setTimeout(() => {
                document.getElementById(`${tabName}-tab`).classList.add('active');
                document.getElementById(`${tabName}-tab`).style.opacity = '1';
            }, 310);
            
            // Load data for specific tabs
            if (tabName === 'pages') {
                loadSavedPages();
            } else if (tabName === 'codeviewer') {
                loadSavedProjects();
            }
        });
    });

    // Custom category handling with animation
    const categorySelect = document.getElementById('page-category');
    const customCategoryInput = document.getElementById('custom-category');
    
    categorySelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customCategoryInput.style.display = 'block';
            customCategoryInput.style.opacity = '0';
            
            // Animate appearance
            setTimeout(() => {
                customCategoryInput.style.opacity = '1';
            }, 10);
        } else {
            // Animate disappearance
            customCategoryInput.style.opacity = '0';
            
            setTimeout(() => {
                customCategoryInput.style.display = 'none';
            }, 300);
        }
    });

    // =================== Core Functionality ===================
    // Preview functionality with loading animation
    const previewBtn = document.getElementById('preview-btn');
    const previewFrame = document.getElementById('preview-frame');
    
    previewBtn.addEventListener('click', function() {
        // Show loading animation
        previewContainer.classList.add('loading');
        
        // Short timeout to show the loading effect
        setTimeout(() => {
            const content = htmlEditor.getValue();
            const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            
            frameDoc.open();
            frameDoc.write(content);
            frameDoc.close();
            
            // Remove loading animation
            previewContainer.classList.remove('loading');
        }, 300);
    });

    // Save functionality with enhanced UI feedback
    const saveBtn = document.getElementById('save-btn');
    const pageTitle = document.getElementById('page-title');
    const pageUrl = document.getElementById('page-url');
    const pageStatus = document.getElementById('page-status');
    
    let currentEditingId = null;
    
    saveBtn.addEventListener('click', async function() {
        if (!pageTitle.value) {
            showNotification('يرجى إدخال عنوان الصفحة', 'warning');
            pageTitle.focus();
            return;
        }
        
        if (!pageUrl.value) {
            showNotification('يرجى إدخال مسار الصفحة', 'warning');
            pageUrl.focus();
            return;
        }
        
        // Show saving animation
        this.disabled = true;
        this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
        
        const formData = {
            id: currentEditingId || Date.now().toString(),
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
                formData.views = 0;
                pages.push(formData);
            }
            
            localStorage.setItem('pages', JSON.stringify(pages));
            
            // Reset button state after saving
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> حفظ ونشر';
                showNotification('تم حفظ الصفحة بنجاح!', 'success');
                clearForm();
                loadSavedPages();
                
                // Switch to pages tab with animation
                const pagesTabBtn = document.querySelector('[data-tab="pages"]');
                pagesTabBtn.click();
            }, 800);
        } catch (error) {
            showNotification('حدث خطأ أثناء حفظ الصفحة', 'error');
            console.error(error);
            
            // Reset button state
            this.disabled = false;
            this.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> حفظ ونشر';
        }
    });

    // Clear functionality with animation
    const clearBtn = document.getElementById('clear-btn');
    
    clearBtn.addEventListener('click', function() {
        // Add confirmation dialog
        if (htmlEditor.getValue() || pageTitle.value || pageUrl.value) {
            if (!confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
                return;
            }
        }
        
        clearForm();
        showNotification('تم مسح النموذج', 'info');
    });
    
    function clearForm() {
        pageTitle.value = '';
        pageUrl.value = '';
        categorySelect.selectedIndex = 0;
        customCategoryInput.style.display = 'none';
        if (pageStatus) pageStatus.selectedIndex = 0;
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

    // Load saved pages with enhanced UI and search functionality
    function loadSavedPages() {
        const pagesListEl = document.getElementById('pages-list');
        const pagesSearchInput = document.getElementById('pages-search-input');
        const pagesFilter = document.getElementById('pages-filter');
        
        if (!pagesListEl) return;
        
        const pages = JSON.parse(localStorage.getItem('pages') || '[]');
        pagesListEl.innerHTML = '';
        
        if (pages.length === 0) {
            pagesListEl.innerHTML = '<div class="empty-state"><i class="fa-solid fa-file-circle-xmark fa-3x"></i><p>لا توجد صفحات محفوظة، قم بإنشاء صفحة جديدة من خلال المحرر</p></div>';
            return;
        }
        
        // Search and filter functionality
        const filterPages = () => {
            const searchTerm = pagesSearchInput.value.toLowerCase();
            const filterValue = pagesFilter.value;
            
            // Clear list before adding filtered items
            pagesListEl.innerHTML = '';
            
            let filteredPages = pages.filter(page => {
                // First check category filter
                if (filterValue !== 'all' && page.category !== filterValue) {
                    return false;
                }
                
                // Then check search term
                return page.title.toLowerCase().includes(searchTerm) || 
                       page.url.toLowerCase().includes(searchTerm);
            });
            
            if (filteredPages.length === 0) {
                pagesListEl.innerHTML = '<div class="empty-state"><i class="fa-solid fa-filter-circle-xmark fa-3x"></i><p>لا توجد نتائج مطابقة للبحث</p></div>';
                return;
            }
            
            // Sort by update date - newest first
            filteredPages.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            
            filteredPages.forEach(renderPageCard);
        };
        
        // Add event listeners for search and filter
        pagesSearchInput.addEventListener('input', filterPages);
        pagesFilter.addEventListener('change', filterPages);
        
        // Initial load of all pages
        pages.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        pages.forEach(renderPageCard);
        
        // Function to render a single page card
        function renderPageCard(page) {
            const date = new Date(page.updatedAt);
            const formattedDate = date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const pageEl = document.createElement('div');
            pageEl.className = 'page-card animated';
            
            // Status indicator
            let statusClass = 'status-published';
            let statusText = 'منشورة';
            
            if (!page.published) {
                statusClass = 'status-draft';
                statusText = 'مسودة';
            }
            
            pageEl.innerHTML = `
                <div class="page-card-header">
                    <h3><i class="fa-solid fa-file-lines"></i> ${page.title}</h3>
                    <span class="page-status ${statusClass}"><i class="fa-solid fa-circle"></i> ${statusText}</span>
                </div>
                <p><i class="fa-solid fa-link"></i> /${page.url}</p>
                <p><i class="fa-solid fa-tag"></i> ${page.category}</p>
                <p><i class="fa-solid fa-clock-rotate-left"></i> ${formattedDate}</p>
                <div class="page-card-actions">
                    <button class="btn primary edit-page-btn" data-id="${page.id}"><i class="fa-solid fa-pen-to-square"></i> تعديل</button>
                    <button class="btn danger delete-page-btn" data-id="${page.id}"><i class="fa-solid fa-trash"></i> حذف</button>
                </div>
            `;
            
            const editBtn = pageEl.querySelector('.edit-page-btn');
            editBtn.addEventListener('click', function() {
                editPage(page.id);
            });
            
            const deleteBtn = pageEl.querySelector('.delete-page-btn');
            deleteBtn.addEventListener('click', function() {
                deletePage(page.id);
            });
            
            pagesListEl.appendChild(pageEl);
        }
    }
    
    // Edit page
    function editPage(pageId) {
        const pages = JSON.parse(localStorage.getItem('pages') || '[]');
        const page = pages.find(p => p.id === pageId);
        
        if (!page) {
            showNotification('صفحة غير موجودة', 'error');
            return;
        }
        
        // Set form values
        pageTitle.value = page.title;
        pageUrl.value = page.url;
        
        if (page.category === 'custom') {
            categorySelect.value = 'custom';
            customCategoryInput.style.display = 'block';
            customCategoryInput.value = page.customCategory || '';
        } else {
            categorySelect.value = page.category;
            customCategoryInput.style.display = 'none';
        }
        
        if (pageStatus) {
            pageStatus.value = page.published ? 'published' : 'draft';
        }
        
        htmlEditor.setValue(page.htmlContent);
        
        // Update preview
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(page.htmlContent);
        frameDoc.close();
        
        // Set current editing ID
        currentEditingId = pageId;
        
        // Show success notification
        showNotification('تم تحميل الصفحة للتعديل', 'info');
        
        // Switch to editor tab
        const editorTabBtn = document.querySelector('[data-tab="editor"]');
        editorTabBtn.click();
    }
    
    // Delete page with confirmation
    function deletePage(pageId) {
        if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟ لا يمكن التراجع عن هذه العملية.')) {
            return;
        }
        
        const pages = JSON.parse(localStorage.getItem('pages') || '[]');
        const newPages = pages.filter(p => p.id !== pageId);
        
        localStorage.setItem('pages', JSON.stringify(newPages));
        
        // Reload pages list
        loadSavedPages();
        
        // Show success notification
        showNotification('تم حذف الصفحة بنجاح', 'success');
    }

    // =================== Code Viewer Functionality ===================
    // Initialize the upload area
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/zip') {
                fileInput.files = files;
                processZipFile(files[0]);
            } else {
                showNotification('يرجى اختيار ملف ZIP صالح', 'warning');
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                processZipFile(fileInput.files[0]);
            }
        });
    }
    
    // Process ZIP file
    function processZipFile(file) {
        const projectInfo = document.getElementById('project-info');
        const fileExplorer = document.getElementById('file-explorer');
        const fileTree = document.getElementById('file-tree');
        const fileContent = document.getElementById('file-content');
        const processingSpinner = document.getElementById('processing-spinner');
        const projectName = document.getElementById('project-name');
        
        // Show processing spinner
        processingSpinner.style.display = 'block';
        
        // Generate project name from file name
        const fileName = file.name.replace('.zip', '');
        projectName.value = fileName;
        
        // Use JSZip to read the file
        const reader = new FileReader();
        
        reader.onload = function(e) {
            JSZip.loadAsync(e.target.result)
                .then(function(zip) {
                    // Store file contents
                    const files = {};
                    const fileTree = {};
                    
                    // Process files
                    const promises = [];
                    
                    zip.forEach(function(relativePath, zipEntry) {
                        if (!zipEntry.dir) {
                            const promise = zipEntry.async('string').then(function(content) {
                                files[relativePath] = content;
                                
                                // Add to file tree
                                const pathParts = relativePath.split('/');
                                let currentLevel = fileTree;
                                
                                pathParts.forEach(function(part, index) {
                                    if (index === pathParts.length - 1) {
                                        // This is a file
                                        currentLevel[part] = relativePath;
                                    } else {
                                        // This is a directory
                                        if (!currentLevel[part]) {
                                            currentLevel[part] = {};
                                        }
                                        currentLevel = currentLevel[part];
                                    }
                                });
                            });
                            
                            promises.push(promise);
                        }
                    });
                    
                    Promise.all(promises).then(function() {
                        // Hide spinner
                        processingSpinner.style.display = 'none';
                        
                        // Show project info and file explorer
                        projectInfo.style.display = 'block';
                        fileExplorer.style.display = 'block';
                        
                        // Store project data
                        currentProject = {
                            name: fileName,
                            files: files,
                            fileTree: fileTree
                        };
                        
                        // Render file tree
                        renderFileTree(fileTree, document.getElementById('file-tree'));
                        
                        // Show notification
                        showNotification('تم معالجة الملفات بنجاح!', 'success');
                    });
                })
                .catch(function(error) {
                    processingSpinner.style.display = 'none';
                    showNotification('حدث خطأ أثناء معالجة الملف: ' + error.message, 'error');
                });
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    // Render file tree
    function renderFileTree(obj, container) {
        container.innerHTML = '';
        
        for (const item in obj) {
            // Check if it's a file or folder
            if (typeof obj[item] === 'object') {
                // It's a folder
                const folderItem = document.createElement('div');
                folderItem.className = 'file-tree-item';
                folderItem.innerHTML = 
                    '<span class="file-tree-icon">📁</span>' +
                    '<span>' + item + '</span>';
                
                const folderContent = document.createElement('div');
                folderContent.className = 'file-tree-content';
                folderContent.style.paddingRight = '15px';
                
                // Add click event to toggle folder
                folderItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.classList.toggle('expanded');
                    folderContent.style.display = folderContent.style.display === 'none' ? 'block' : 'none';
                });
                
                // Recursively render folder contents
                renderFileTree(obj[item], folderContent);
                
                container.appendChild(folderItem);
                container.appendChild(folderContent);
                
                // Hide folder contents by default
                folderContent.style.display = 'none';
            } else {
                // It's a file
                const fileEl = document.createElement('div');
                fileEl.className = 'file-tree-item';
                fileEl.setAttribute('data-path', obj[item]);
                
                // Determine icon based on file extension
                let fileIcon = '📄';
                const extension = item.split('.').pop().toLowerCase();
                if (extension === 'html') fileIcon = '🌐';
                else if (extension === 'css') fileIcon = '🎨';
                else if (extension === 'js') fileIcon = '⚙️';
                else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) fileIcon = '🖼️';
                
                fileEl.innerHTML = 
                    '<span class="file-tree-icon">' + fileIcon + '</span>' +
                    '<span>' + item + '</span>';
                
                fileEl.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const path = this.getAttribute('data-path');
                    
                    // Highlight selected file
                    document.querySelectorAll('.file-tree-item.selected').forEach(item => {
                        item.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    
                    // Show file content
                    showFileContent(path);
                });
                
                container.appendChild(fileEl);
            }
        }
    }
    
    // Show file content
    function showFileContent(path) {
        const fileContent = document.getElementById('file-content');
        const content = currentProject.files[path];
        
        const extension = path.split('.').pop().toLowerCase();
        
        let displayContent = '';
        
        if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
            // It's an image
            displayContent = `<div class="image-preview">
                <p>لا يمكن عرض الصورة مباشرة، استخدم زر المعاينة لتحميل الصفحة التي تستخدم هذه الصورة.</p>
            </div>`;
        } else if (extension === 'html') {
            // It's HTML
            displayContent = `<pre><code class="language-html">${escapeHtml(content)}</code></pre>`;
        } else if (extension === 'css') {
            // It's CSS
            displayContent = `<pre><code class="language-css">${escapeHtml(content)}</code></pre>`;
        } else if (extension === 'js') {
            // It's JavaScript
            displayContent = `<pre><code class="language-javascript">${escapeHtml(content)}</code></pre>`;
        } else {
            // Other text files
            displayContent = `<pre><code>${escapeHtml(content)}</code></pre>`;
        }
        
        fileContent.innerHTML = `
            <div class="file-header">
                <span class="file-path">${path}</span>
            </div>
            <div class="file-view">
                ${displayContent}
            </div>
        `;
        
        // Store the currently selected file path
        currentProject.selectedFile = path;
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Initialize variables for project management
    let currentProject = null;
    
    // Generate preview functionality
    const generatePreviewBtn = document.getElementById('generate-preview-btn');
    if (generatePreviewBtn) {
        generatePreviewBtn.addEventListener('click', function() {
            if (!currentProject || !currentProject.selectedFile) {
                showNotification('يرجى اختيار ملف HTML أولاً', 'warning');
                return;
            }
            
            const path = currentProject.selectedFile;
            const extension = path.split('.').pop().toLowerCase();
            
            if (extension !== 'html') {
                showNotification('يرجى اختيار ملف HTML للمعاينة', 'warning');
                return;
            }
            
            // Get HTML content
            const htmlContent = currentProject.files[path];
            
            // Switch to editor tab
            const editorTabBtn = document.querySelector('[data-tab="editor"]');
            editorTabBtn.click();
            
            // Set title and URL
            pageTitle.value = currentProject.name + ' - ' + path.split('/').pop().replace('.html', '');
            pageUrl.value = path.split('/').pop().replace('.html', '');
            
            // Set HTML content
            htmlEditor.setValue(htmlContent);
            
            // Trigger preview
            previewBtn.click();
            
            showNotification('تم إنشاء المعاينة بنجاح!', 'success');
        });
    }
    
    // Save project functionality
    const saveProjectBtn = document.getElementById('save-project-btn');
    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', function() {
            if (!currentProject) {
                showNotification('لا يوجد مشروع نشط للحفظ', 'warning');
                return;
            }
            
            const projectNameInput = document.getElementById('project-name');
            if (!projectNameInput.value) {
                showNotification('يرجى إدخال اسم المشروع', 'warning');
                projectNameInput.focus();
                return;
            }
            
            // Show saving animation
            this.disabled = true;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';
            
            // Create project object
            const project = {
                id: currentProject.id || Date.now().toString(),
                name: projectNameInput.value,
                files: currentProject.files,
                fileTree: currentProject.fileTree,
                date: new Date().toISOString()
            };
            
            // Save to localStorage
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            
            if (currentProject.id) {
                // Update existing project
                const index = projects.findIndex(p => p.id === currentProject.id);
                if (index !== -1) {
                    projects[index] = project;
                }
            } else {
                // Add new project
                projects.push(project);
            }
            
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // Update current project
            currentProject = project;
            
            // Reset button state after saving
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> حفظ المشروع';
                showNotification('تم حفظ المشروع بنجاح!', 'success');
                loadSavedProjects();
            }, 800);
        });
    }
    
    // Load saved projects
    function loadSavedProjects() {
        const projectsList = document.getElementById('projects-list');
        
        if (!projectsList) return;
        
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projectsList.innerHTML = '';
        
        if (projects.length === 0) {
            projectsList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-folder-open fa-3x"></i><p>لا توجد مشاريع محفوظة، قم برفع ملف ZIP جديد</p></div>';
            return;
        }
        
        // Sort by date - newest first
        projects.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        projects.forEach(project => {
            const date = new Date(project.date);
            const html = 
                '<div class="project-card">' +
                '<h4>' + project.name + '</h4>' +
                '<p>عدد الملفات: ' + Object.keys(project.files).length + '</p>' +
                '<p>تاريخ الحفظ: ' + date.toLocaleDateString('ar-SA') + '</p>' +
                '<div class="project-card-actions">' +
                '<button class="btn primary" onclick="loadProject(\'' + project.id + '\')">فتح</button>' +
                '<button class="btn danger" onclick="deleteProject(\'' + project.id + '\')">حذف</button>' +
                '</div>' +
                '</div>';
                
            projectsList.innerHTML += html;
        });
    }
    
    // Initialize page
    const init = () => {
        // Load saved pages
        if (document.getElementById('pages-list')) {
            loadSavedPages();
        }
        
        // Load saved projects
        if (document.getElementById('projects-list')) {
            loadSavedProjects();
        }
        
        // Initially select the first tab
        document.querySelector('.tab-btn.active').click();
    };
    
    init();
    
    // Global functions
    window.loadProject = function(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            showNotification('مشروع غير موجود', 'error');
            return;
        }
        
        // Set current project
        currentProject = project;
        
        // Update UI
        const projectInfo = document.getElementById('project-info');
        const fileExplorer = document.getElementById('file-explorer');
        const projectName = document.getElementById('project-name');
        
        projectInfo.style.display = 'block';
        fileExplorer.style.display = 'block';
        projectName.value = project.name;
        
        // Render file tree
        renderFileTree(project.fileTree, document.getElementById('file-tree'));
        
        // Show notification
        showNotification('تم تحميل المشروع بنجاح!', 'success');
    };
    
    window.deleteProject = function(projectId) {
        if (!confirm('هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذه العملية.')) {
            return;
        }
        
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const newProjects = projects.filter(p => p.id !== projectId);
        
        localStorage.setItem('projects', JSON.stringify(newProjects));
        
        // Reload projects list
        loadSavedProjects();
        
        // Show success notification
        showNotification('تم حذف المشروع بنجاح', 'success');
    };

    // Create notification system
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notificationsContainer = document.querySelector('.notifications-container');
        
        if (!notificationsContainer) {
            notificationsContainer = document.createElement('div');
            notificationsContainer.className = 'notifications-container';
            document.body.appendChild(notificationsContainer);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .notifications-container {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    z-index: 9999;
                }
                .notification {
                    background-color: white;
                    border-right: 4px solid #5e35b1;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    padding: 15px 20px;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    transform: translateX(-120%);
                    animation: slide-in 0.3s forwards;
                    max-width: 300px;
                }
                .notification.success { border-right-color: #2ecc71; }
                .notification.warning { border-right-color: #f39c12; }
                .notification.error { border-right-color: #e74c3c; }
                .notification.info { border-right-color: #5e35b1; }
                .notification-icon {
                    margin-left: 15px;
                    font-size: 20px;
                }
                .notification.success .notification-icon { color: #2ecc71; }
                .notification.warning .notification-icon { color: #f39c12; }
                .notification.error .notification-icon { color: #e74c3c; }
                .notification.info .notification-icon { color: #5e35b1; }
                .notification-message {
                    flex: 1;
                }
                .notification-close {
                    margin-right: 10px;
                    cursor: pointer;
                    opacity: 0.6;
                }
                .notification-close:hover {
                    opacity: 1;
                }
                @keyframes slide-in {
                    to { transform: translateX(0); }
                }
                @keyframes slide-out {
                    to { transform: translateX(-120%); }
                }
                .dark-mode .notification {
                    background-color: #2d2d2d;
                    color: white;
                }
                .rotate-animation {
                    animation: rotate 0.5s ease;
                }
                @keyframes rotate {
                    from { transform: rotate(0); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set icon based on type
        let icon;
        switch(type) {
            case 'success':
                icon = 'fa-circle-check';
                break;
            case 'warning':
                icon = 'fa-triangle-exclamation';
                break;
            case 'error':
                icon = 'fa-circle-xmark';
                break;
            default:
                icon = 'fa-circle-info';
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <div class="notification-close">
                <i class="fa-solid fa-times"></i>
            </div>
        `;
        
        notificationsContainer.appendChild(notification);
        
        // Close notification
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slide-out 0.3s forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slide-out 0.3s forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
});