document.addEventListener('DOMContentLoaded', function() {
    // Initialize CodeMirror editor
    const editor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        lineWrapping: true
    });

    // Handle category selection
    const categorySelect = document.getElementById('page-category');
    const customCategoryInput = document.getElementById('custom-category');
    
    categorySelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customCategoryInput.style.display = 'block';
        } else {
            customCategoryInput.style.display = 'none';
        }
    });

    // Preview button functionality
    const previewBtn = document.getElementById('preview-btn');
    const previewFrame = document.getElementById('preview-frame');
    
    previewBtn.addEventListener('click', function() {
        const htmlContent = editor.getValue();
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
        
        previewDocument.open();
        previewDocument.write(htmlContent);
        previewDocument.close();
    });

    // Clear button functionality
    const clearBtn = document.getElementById('clear-btn');
    
    clearBtn.addEventListener('click', function() {
        editor.setValue('');
        document.getElementById('page-title').value = '';
        document.getElementById('page-url').value = '';
        categorySelect.value = 'main';
        customCategoryInput.style.display = 'none';
        customCategoryInput.value = '';
        
        const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
        previewDocument.open();
        previewDocument.write('');
        previewDocument.close();
    });

    // Save and publish functionality
    const saveBtn = document.getElementById('save-btn');
    const pagesList = document.getElementById('pages-list');
    
    // Load saved pages from localStorage
    let savedPages = JSON.parse(localStorage.getItem('savedPages')) || [];
    
    // Display saved pages
    function displaySavedPages() {
        pagesList.innerHTML = '';
        
        if (savedPages.length === 0) {
            pagesList.innerHTML = '<p>لا توجد صفحات محفوظة بعد.</p>';
            return;
        }
        
        savedPages.forEach((page, index) => {
            const pageCard = document.createElement('div');
            pageCard.className = 'page-card';
            
            pageCard.innerHTML = `
                <h3>${page.title}</h3>
                <p>التصنيف: ${page.category === 'custom' ? page.customCategory : getCategoryName(page.category)}</p>
                <p>المسار: /${page.url}</p>
                <div class="page-card-actions">
                    <button class="btn primary edit-btn" data-index="${index}">تعديل</button>
                    <button class="btn danger delete-btn" data-index="${index}">حذف</button>
                    <button class="btn success view-btn" data-index="${index}">عرض</button>
                </div>
            `;
            
            pagesList.appendChild(pageCard);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                editPage(index);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deletePage(index);
            });
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                viewPage(index);
            });
        });
    }
    
    // Helper function to get category name
    function getCategoryName(categoryValue) {
        const categories = {
            'main': 'الصفحة الرئيسية',
            'blog': 'المدونة',
            'products': 'المنتجات',
            'services': 'الخدمات',
            'about': 'من نحن',
            'contact': 'اتصل بنا'
        };
        
        return categories[categoryValue] || categoryValue;
    }
    
    // Edit page function
    function editPage(index) {
        const page = savedPages[index];
        
        document.getElementById('page-title').value = page.title;
        document.getElementById('page-url').value = page.url;
        document.getElementById('page-category').value = page.category;
        
        if (page.category === 'custom') {
            document.getElementById('custom-category').style.display = 'block';
            document.getElementById('custom-category').value = page.customCategory;
        } else {
            document.getElementById('custom-category').style.display = 'none';
        }
        
        editor.setValue(page.htmlContent);
        
        // Remove the page from the array (it will be re-added when saved)
        savedPages.splice(index, 1);
        localStorage.setItem('savedPages', JSON.stringify(savedPages));
        displaySavedPages();
    }
    
    // Delete page function
    function deletePage(index) {
        if (confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
            savedPages.splice(index, 1);
            localStorage.setItem('savedPages', JSON.stringify(savedPages));
            displaySavedPages();
        }
    }
    
    // View page function
    function viewPage(index) {
        const page = savedPages[index];
        
        // Create a temporary HTML file and open it in a new tab
        const blob = new Blob([page.htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        // If server is running, we can also try to view the actual saved file
        if (window.location.protocol !== 'file:') {
            const categoryPath = page.category === 'custom' ? page.customCategory : page.category;
            const pageUrl = `/pages/${categoryPath}/${page.url}.html`;
            
            // Check if the file exists on the server
            fetch(pageUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        window.open(pageUrl, '_blank');
                    }
                })
                .catch(() => {
                    // If error, we already opened the blob URL above
                });
        }
    }
    
    // Save button click handler
    saveBtn.addEventListener('click', function() {
        const title = document.getElementById('page-title').value;
        const url = document.getElementById('page-url').value;
        const category = document.getElementById('page-category').value;
        const customCategory = document.getElementById('custom-category').value;
        const htmlContent = editor.getValue();
        
        if (!title || !url || !htmlContent) {
            alert('يرجى ملء جميع الحقول المطلوبة (العنوان، المسار، والمحتوى)');
            return;
        }
        
        // Create page object
        const page = {
            title,
            url,
            category,
            customCategory: category === 'custom' ? customCategory : '',
            htmlContent,
            createdAt: new Date().toISOString()
        };
        
        // Add to saved pages
        savedPages.push(page);
        localStorage.setItem('savedPages', JSON.stringify(savedPages));
        
        // Update display
        displaySavedPages();
        
        // Clear form
        clearBtn.click();
        
        alert('تم حفظ الصفحة بنجاح!');
    });
    
    // Initial display of saved pages
    displaySavedPages();
});