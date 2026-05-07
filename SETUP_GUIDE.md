# 🚀 دليل رفع منصة ACES التدريبية على GitHub + Firebase

## الخطوات المطلوبة (30 دقيقة فقط)

---

## الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى https://console.firebase.google.com
2. انقر **"Create a project"** → اسمه: `aces-training`
3. فعّل **Google Analytics** (اختياري)
4. من القائمة الجانبية → **Firestore Database** → **Create database**
   - اختر **"Start in test mode"**
   - اختر منطقة: `europe-west3` (الأقرب لقطر)
5. من **Project Settings** (⚙️) → **General** → انسخ هذه القيم:
   ```
   apiKey: "..."
   authDomain: "..."
   projectId: "..."
   storageBucket: "..."
   messagingSenderId: "..."
   appId: "..."
   ```

---

## الخطوة 2: تعديل ملفات المشروع

افتح الملفين وضع قيم Firebase:

### في `public/index.html` (لوحة المدرب):
```javascript
const firebaseConfig = {
  apiKey: "ضع_قيمتك_هنا",
  authDomain: "ضع_قيمتك_هنا",
  projectId: "ضع_قيمتك_هنا",
  storageBucket: "ضع_قيمتك_هنا",
  messagingSenderId: "ضع_قيمتك_هنا",
  appId: "ضع_قيمتك_هنا"
};
```

### في `public/trainee.html` (بوابة المتدرب):
نفس القيم أعلاه

---

## الخطوة 3: رفع المشروع على GitHub

```bash
# 1. أنشئ حساباً على github.com إذا لم يكن لديك

# 2. أنشئ Repository جديد باسم: aces-training
#    - اجعله Public
#    - لا تضف README

# 3. في Terminal أو CMD:
cd aces-training
git init
git add .
git commit -m "Initial: ACES Training Platform"
git branch -M main
git remote add origin https://github.com/USERNAME/aces-training.git
git push -u origin main
```

---

## الخطوة 4: تفعيل GitHub Pages

1. في الـ Repository → **Settings** → **Pages**
2. **Source**: اختر **"GitHub Actions"**
3. انتظر 2-3 دقائق
4. رابطك سيكون: `https://USERNAME.github.io/aces-training/`

---

## الخطوة 5: رفع قواعد Firestore

1. اذهب إلى Firebase Console → Firestore → **Rules**
2. الصق محتوى ملف `firestore.rules`
3. انقر **Publish**

---

## الخطوة 6: إضافة أول اختبار تجريبي

في Firebase Console → Firestore → **+ Start collection**:

### Collection: `trainees`
```
Document ID: T001
Fields:
  name: "أحمد محمود"
  department: "المختبرات"
  status: "active"
  testsCompleted: 0
```

---

## روابط المنصة النهائية

| الصفحة | الرابط |
|--------|--------|
| لوحة المدرب | `https://USERNAME.github.io/aces-training/` |
| بوابة المتدرب | `https://USERNAME.github.io/aces-training/trainee.html` |
| دخول بـ QR | `https://USERNAME.github.io/aces-training/trainee.html?code=T001` |

---

## كيف يعمل النظام؟

```
المدرب يضيف متدرباً → يُنشئ QR Code تلقائياً
     ↓
المتدرب يمسح QR → يدخل للمنصة مباشرة
     ↓
يبدأ الاختبار → يُحفظ كل إجابة فوراً في Firebase
     ↓
إذا خرج → يكمل من حيث توقف عند إعادة المسح
     ↓
ينهي الاختبار → تظهر النتيجة فوراً للمدرب
```

---

## الدعم

لأي مساعدة في الإعداد، تواصل مع فريق ACES.
