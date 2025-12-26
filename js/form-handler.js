// Form Handler for SmartProposal Landing Page
// Handles form submission to Formspree, GitHub Issues, and ClickUp

// Check if config is loaded
if (typeof CONFIG === 'undefined') {
    console.error('CONFIG is not defined. Please make sure config.js is loaded.');
}

/**
 * Send form data to Formspree
 */
async function sendToFormspree(formData) {
    if (!CONFIG.formspreeEndpoint) {
        console.warn('Formspree endpoint not configured');
        return { success: false, error: 'Formspree not configured' };
    }

    try {
        const response = await fetch(CONFIG.formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                company: formData.company,
                phone: formData.phone,
                proposalCount: formData.proposalCount,
                _subject: `درخواست تحلیل رایگان - ${formData.company}`
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.json();
            return { success: false, error: error.message || 'Formspree error' };
        }
    } catch (error) {
        console.error('Formspree error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create GitHub Issue
 */
async function createGitHubIssue(formData) {
    if (!CONFIG.githubToken || !CONFIG.githubRepo) {
        console.warn('GitHub not configured');
        return { success: false, error: 'GitHub not configured' };
    }

    const [owner, repo] = CONFIG.githubRepo.split('/');
    const issueTitle = `درخواست تحلیل رایگان - ${formData.company}`;
    const issueBody = `## اطلاعات تماس

**نام:** ${formData.name}
**شرکت:** ${formData.company}
**شماره تماس:** ${formData.phone}
**تعداد پروپوزال در ماه:** ${formData.proposalCount}

---
*این درخواست از طریق فرم تماس لندینگ پیج ثبت شده است.*`;

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${CONFIG.githubToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                title: issueTitle,
                body: issueBody,
                labels: CONFIG.githubLabels || ['contact-form', 'new-lead']
            })
        });

        if (response.ok) {
            const issue = await response.json();
            return { success: true, issueUrl: issue.html_url };
        } else {
            const error = await response.json();
            return { success: false, error: error.message || 'GitHub API error' };
        }
    } catch (error) {
        console.error('GitHub API error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Create ClickUp Task
 */
async function createClickUpTask(formData) {
    if (!CONFIG.clickupToken || !CONFIG.clickupListId) {
        console.warn('ClickUp not configured');
        return { success: false, error: 'ClickUp not configured' };
    }

    const taskName = `درخواست تحلیل رایگان - ${formData.company}`;
    const taskDescription = `## اطلاعات تماس

**نام:** ${formData.name}
**شرکت:** ${formData.company}
**شماره تماس:** ${formData.phone}
**تعداد پروپوزال در ماه:** ${formData.proposalCount}

---
*این درخواست از طریق فرم تماس لندینگ پیج ثبت شده است.*`;

    try {
        const response = await fetch(`https://api.clickup.com/api/v2/list/${CONFIG.clickupListId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': CONFIG.clickupToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: taskName,
                description: taskDescription,
                status: CONFIG.clickupStatus || 'to do',
                priority: CONFIG.clickupPriority || 3
            })
        });

        if (response.ok) {
            const task = await response.json();
            return { success: true, taskUrl: task.url };
        } else {
            const error = await response.json();
            return { success: false, error: error.err || error.message || 'ClickUp API error' };
        }
    } catch (error) {
        console.error('ClickUp API error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = {
        name: form.querySelector('input[name="name"]').value.trim(),
        company: form.querySelector('input[name="company"]').value.trim(),
        phone: form.querySelector('input[name="phone"]').value.trim(),
        proposalCount: form.querySelector('select[name="proposalCount"]').value
    };

    // Validate form
    if (!formData.name || !formData.company || !formData.phone) {
        showMessage('لطفاً تمام فیلدهای الزامی را پر کنید.', 'error');
        return;
    }

    // Disable form and show loading
    setFormLoading(form, submitButton, true);

    try {
        // Send to all services in parallel
        const results = await Promise.allSettled([
            sendToFormspree(formData),
            createGitHubIssue(formData),
            createClickUpTask(formData)
        ]);

        // Check results
        const formspreeResult = results[0].status === 'fulfilled' ? results[0].value : { success: false, error: results[0].reason };
        const githubResult = results[1].status === 'fulfilled' ? results[1].value : { success: false, error: results[1].reason };
        const clickupResult = results[2].status === 'fulfilled' ? results[2].value : { success: false, error: results[2].reason };

        // Count successful submissions
        const successCount = [formspreeResult, githubResult, clickupResult].filter(r => r.success).length;
        const totalServices = [formspreeResult, githubResult, clickupResult].filter(r => r.error !== 'not configured').length;

        if (successCount > 0) {
            // At least one service succeeded
            showMessage('درخواست شما با موفقیت ثبت شد! به زودی با شما تماس خواهیم گرفت.', 'success');
            form.reset();
        } else {
            // All services failed
            showMessage('متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید یا مستقیماً با ما تماس بگیرید.', 'error');
        }

        // Log results for debugging
        console.log('Form submission results:', {
            formspree: formspreeResult,
            github: githubResult,
            clickup: clickupResult
        });

    } catch (error) {
        console.error('Form submission error:', error);
        showMessage('خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.', 'error');
    } finally {
        setFormLoading(form, submitButton, false);
    }
}

/**
 * Set form loading state
 */
function setFormLoading(form, submitButton, isLoading) {
    if (isLoading) {
        form.style.opacity = '0.6';
        form.style.pointerEvents = 'none';
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="inline-flex items-center gap-2"><svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> در حال ارسال...</span>';
    } else {
        form.style.opacity = '1';
        form.style.pointerEvents = 'auto';
        submitButton.disabled = false;
        submitButton.innerHTML = 'ثبت درخواست مشاوره رایگان';
    }
}

/**
 * Show message to user
 */
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message mt-4 p-4 rounded-lg text-center font-medium ${
        type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
    }`;
    messageDiv.textContent = message;

    // Insert after form
    const form = document.querySelector('#contact-form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto remove after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.transition = 'opacity 0.3s';
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }, 5000);
        }
    }
}

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.warn('Contact form not found');
    }
});

