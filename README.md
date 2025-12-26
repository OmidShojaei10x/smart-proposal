# SmartProposal - سیستم هوشمند پروپوزال

یک سیستم هوشمند برای تولید سریع و حرفه‌ای پروپوزال‌های فروش B2B.

## ویژگی‌ها
- کاهش زمان تهیه پروپوزال از ۷ روز به ۱ روز
- افزایش نرخ تبدیل تا ۴۰%
- قالب‌های هوشمند و برندینگ شده
- خروجی PDF حرفه‌ای

## راه‌اندازی فرم تماس

این لندینگ پیج شامل یک سیستم پیشرفته ذخیره‌سازی فرم تماس است که اطلاعات را به سه مکان ارسال می‌کند:
1. **Formspree** - ارسال به ایمیل
2. **GitHub Issues** - ایجاد Issue در ریپازیتوری
3. **ClickUp** - ایجاد Task برای پیگیری

### مراحل راه‌اندازی

#### 1. کپی کردن فایل تنظیمات

```bash
cp config.js.example config.js
```

**مهم:** فایل `config.js` در `.gitignore` قرار دارد و commit نمی‌شود. این فایل شامل توکن‌های امنیتی شماست.

#### 2. تنظیم Formspree (ارسال به ایمیل)

1. به [formspree.io](https://formspree.io) بروید و ثبت‌نام کنید
2. یک فرم جدید ایجاد کنید
3. Endpoint فرم را کپی کنید (مثال: `https://formspree.io/f/abc123xyz`)
4. در فایل `config.js`، مقدار `formspreeEndpoint` را تنظیم کنید

#### 3. تنظیم GitHub Issues

1. به [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) بروید
2. روی "Generate new token (classic)" کلیک کنید
3. نام توکن را وارد کنید (مثال: "SmartProposal Form Handler")
4. دسترسی‌های زیر را انتخاب کنید:
   - `repo` (دسترسی کامل به ریپازیتوری)
   - `issues:write` (ایجاد و ویرایش Issues)
5. توکن را کپی کنید (فقط یک بار نمایش داده می‌شود!)
6. در فایل `config.js`:
   - `githubToken` را با توکن خود جایگزین کنید
   - `githubRepo` را با نام ریپازیتوری خود تنظیم کنید (مثال: `OmidShojaei10x/smart-proposal`)
   - `githubLabels` را به دلخواه تنظیم کنید (اختیاری)

#### 4. تنظیم ClickUp

1. به [ClickUp Settings > Apps](https://app.clickup.com/settings/apps) بروید
2. در بخش "API" روی "Generate" کلیک کنید تا API Token ایجاد شود
3. Token را کپی کنید
4. برای پیدا کردن List ID:
   - به ClickUp بروید و List مورد نظر را باز کنید
   - URL را بررسی کنید: `https://app.clickup.com/123456/v/li/123456789`
   - عدد آخر (بعد از `/li/`) همان List ID است
   - یا از [ClickUp API](https://clickup.com/api) استفاده کنید
5. در فایل `config.js`:
   - `clickupToken` را با API Token خود جایگزین کنید
   - `clickupListId` را با List ID تنظیم کنید
   - `clickupStatus` و `clickupPriority` را به دلخواه تنظیم کنید (اختیاری)

### ساختار فایل config.js

```javascript
const CONFIG = {
    formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID',
    githubToken: 'YOUR_GITHUB_TOKEN',
    githubRepo: 'YOUR_USERNAME/smart-proposal',
    githubLabels: ['contact-form', 'new-lead'],
    clickupToken: 'YOUR_CLICKUP_TOKEN',
    clickupListId: 'YOUR_LIST_ID',
    clickupStatus: 'to do',
    clickupPriority: 3
};
```

### تست فرم

بعد از تنظیم همه موارد:
1. فایل `config.js` را ذخیره کنید
2. صفحه را در مرورگر باز کنید
3. فرم را پر کنید و ارسال کنید
4. بررسی کنید که:
   - ایمیل در Formspree دریافت شده باشد
   - Issue جدید در GitHub ایجاد شده باشد
   - Task جدید در ClickUp ایجاد شده باشد

### نکات امنیتی

- **هرگز** فایل `config.js` را commit نکنید
- توکن‌ها را با کسی به اشتراک نگذارید
- اگر توکنی لو رفت، فوراً آن را revoke کنید و یک توکن جدید بسازید
- برای production، می‌توانید از environment variables استفاده کنید

### گزینه‌های جایگزین

اگر یکی از سرویس‌ها را نمی‌خواهید استفاده کنید:
- **فقط Formspree**: `githubToken` و `clickupToken` را خالی بگذارید
- **فقط GitHub**: `formspreeEndpoint` و `clickupToken` را خالی بگذارید
- **فقط ClickUp**: `formspreeEndpoint` و `githubToken` را خالی بگذارید

سیستم به صورت خودکار فقط سرویس‌های پیکربندی شده را استفاده می‌کند.

## تماس
برای اطلاعات بیشتر با امید شجاعی تماس بگیرید.
