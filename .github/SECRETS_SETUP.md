# راهنمای تنظیم GitHub Secrets

برای اینکه فرم تماس روی GitHub Pages کار کند، باید Secrets زیر را در GitHub تنظیم کنید.

## مراحل تنظیم Secrets

### 1. رفتن به تنظیمات Secrets

1. به ریپازیتوری خود بروید: `https://github.com/OmidShojaei10x/smart-proposal`
2. روی **Settings** کلیک کنید
3. در منوی سمت چپ، روی **Secrets and variables** > **Actions** کلیک کنید
4. روی **New repository secret** کلیک کنید

### 2. اضافه کردن Secrets

برای هر Secret زیر، این مراحل را تکرار کنید:

#### Secret 1: FORMSPREE_ENDPOINT
- **Name:** `FORMSPREE_ENDPOINT`
- **Value:** Endpoint فرم Formspree شما (مثال: `https://formspree.io/f/xvzoolnr`)

#### Secret 2: GITHUB_PAT
- **Name:** `GITHUB_PAT`
- **Value:** Personal Access Token گیت‌هاب شما
  - برای ساخت: https://github.com/settings/tokens
  - دسترسی‌های لازم: `repo`, `issues:write`

#### Secret 3: GITHUB_REPO
- **Name:** `GITHUB_REPO`
- **Value:** نام ریپازیتوری (مثال: `OmidShojaei10x/smart-proposal`)

#### Secret 4: GITHUB_LABELS (اختیاری)
- **Name:** `GITHUB_LABELS`
- **Value:** لیبل‌های GitHub Issues به صورت JSON (مثال: `["contact-form", "new-lead"]`)
- اگر تنظیم نکنید، مقدار پیش‌فرض استفاده می‌شود

#### Secret 5: CLICKUP_TOKEN
- **Name:** `CLICKUP_TOKEN`
- **Value:** API Token ClickUp شما
  - برای دریافت: https://app.clickup.com/settings/apps

#### Secret 6: CLICKUP_LIST_ID
- **Name:** `CLICKUP_LIST_ID`
- **Value:** List ID در ClickUp (مثال: `901519154681`)

#### Secret 7: CLICKUP_STATUS (اختیاری)
- **Name:** `CLICKUP_STATUS`
- **Value:** وضعیت پیش‌فرض برای Task جدید (مثال: `to do`)
- اگر تنظیم نکنید، مقدار پیش‌فرض `to do` استفاده می‌شود

#### Secret 8: CLICKUP_PRIORITY (اختیاری)
- **Name:** `CLICKUP_PRIORITY`
- **Value:** اولویت پیش‌فرض (مثال: `1` برای urgent، `3` برای normal)
- اگر تنظیم نکنید، مقدار پیش‌فرض `3` استفاده می‌شود

## فعال‌سازی Workflow

بعد از تنظیم همه Secrets:

1. به تب **Actions** در ریپازیتوری بروید
2. workflow **Build Config from Secrets** را پیدا کنید
3. روی **Run workflow** کلیک کنید
4. branch **main** را انتخاب کنید
5. روی **Run workflow** کلیک کنید

یا می‌توانید یک commit جدید push کنید تا workflow به صورت خودکار اجرا شود.

## بررسی نتیجه

بعد از اجرای workflow:

1. به تب **Actions** بروید و workflow را بررسی کنید
2. اگر موفق بود، فایل `config.js` در repository ایجاد می‌شود
3. GitHub Pages به صورت خودکار آپدیت می‌شود
4. فرم تماس روی سایت لایو کار می‌کند

## نکات امنیتی

- ✅ Secrets در GitHub محفوظ هستند و در لاگ‌ها نمایش داده نمی‌شوند
- ✅ فقط افراد با دسترسی به repository می‌توانند Secrets را ببینند
- ✅ `config.js` در repository commit می‌شود اما فقط برای GitHub Pages استفاده می‌شود
- ⚠️ اگر می‌خواهید `config.js` را از repository حذف کنید، باید `.gitignore` را آپدیت کنید
