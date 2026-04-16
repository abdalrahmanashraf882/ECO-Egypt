// ========== 1. Smooth Scrolling للروابط الداخلية ==========
// هذا الجزء يقوم بعمل scroll سلس للقسم المختار عند الضغط على الروابط
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // تحقق من أن href ليس فقط "#" بدون ID
        if (href === '#' || href === '') {
            return; // تخطي الروابط الفارغة
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ============================================================
// 3. نظام تسجيل الدخول — Login Modal System
// ============================================================
// هذا القسم مسؤول عن كامل منطق نافذة تسجيل الدخول:
//   - فتح وإغلاق النافذة (مع animations)
//   - التحقق من صحة البيانات المُدخلة (Validation)
//   - محاكاة عملية تسجيل الدخول (Simulated Login)
//   - إدارة حالة زر الإرسال (Loading State)
//   - إغلاق النافذة بالضغط على الـ Escape أو خارج البطاقة
// ============================================================

// ---- الحصول على جميع العناصر المطلوبة من الـ DOM ----

/** زر فتح النافذة في الـ navbar */
const loginTriggerBtn = document.getElementById('loginTriggerBtn');

/** الطبقة الخلفية الداكنة التي تغطي الصفحة */
const loginOverlay = document.getElementById('loginOverlay');

/** بطاقة النافذة الداخلية */
const loginCard = document.getElementById('loginCard');

/** زر الإغلاق (X) */
const loginCloseBtn = document.getElementById('loginCloseBtn');

/** فورم تسجيل الدخول */
const loginForm = document.getElementById('loginForm');

/** حقل البريد الإلكتروني */
const loginEmail = document.getElementById('loginEmail');

/** حقل كلمة المرور */
const loginPassword = document.getElementById('loginPassword');

/** مجموعة حقل البريد (لإضافة/إزالة class الخطأ) */
const emailGroup = document.getElementById('emailGroup');

/** مجموعة حقل كلمة المرور */
const passwordGroup = document.getElementById('passwordGroup');

/** زر إظهار/إخفاء كلمة المرور */
const togglePassword = document.getElementById('togglePassword');

/** أيقونة العين لزر إظهار/إخفاء كلمة المرور */
const togglePassIcon = document.getElementById('togglePassIcon');

/** زر الإرسال الرئيسي */
const loginSubmitBtn = document.getElementById('loginSubmitBtn');

/** النص داخل زر الإرسال */
const loginBtnText = document.getElementById('loginBtnText');


// ============================================================
// دالة: openLoginModal — فتح نافذة تسجيل الدخول
// ============================================================
// تُضيف class "active" على الـ overlay مما يُشغّل الـ CSS transitions
// وتمنع تمرير الصفحة خلف النافذة المفتوحة
function openLoginModal() {
    loginOverlay.classList.add('active');
    // منع تمرير الصفحة الرئيسية أثناء فتح النافذة
    document.body.style.overflow = 'hidden';
    // نقل التركيز (focus) لحقل البريد بعد انتهاء الـ animation
    setTimeout(() => loginEmail.focus(), 400);
}


// ============================================================
// دالة: closeLoginModal — إغلاق نافذة تسجيل الدخول
// ============================================================
// تُزيل class "active" وتُعيد تمرير الصفحة
// وتُصفّي حالة الفورم (إزالة رسائل الخطأ)
function closeLoginModal() {
    loginOverlay.classList.remove('active');
    // إعادة تمرير الصفحة الرئيسية
    document.body.style.overflow = '';
    // تأخير التنظيف حتى تنتهي الـ animation (350ms)
    setTimeout(() => {
        clearFormErrors();              // إزالة رسائل الخطأ
        loginForm.reset();              // تفريغ الحقول
        resetSubmitButton();           // إعادة زر الإرسال لحالته الطبيعية
    }, 350);
}


// ============================================================
// ربط الأحداث لزر الفتح وزر الإغلاق
// ============================================================

// --- فتح النافذة عند الضغط على زر "تسجيل الدخول" في الـ navbar (Desktop) ---
if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', openLoginModal);
}

// --- فتح النافذة عند الضغط على زر "تسجيل الدخول" في القائمة المحمولة (Mobile) ---
// هذا الزر يظهر فقط على الشاشات الصغيرة داخل #mobileMenu
const loginTriggerBtnMobile = document.getElementById('loginTriggerBtnMobile');
if (loginTriggerBtnMobile) {
    loginTriggerBtnMobile.addEventListener('click', function() {
        // إغلاق القائمة المحمولة أولاً قبل فتح modal تسجيل الدخول
        const mobileMenuEl = document.querySelector('#mobileMenu');
        if (mobileMenuEl && mobileMenuEl.classList.contains('show')) {
            const collapse = new bootstrap.Collapse(mobileMenuEl, { toggle: false });
            collapse.hide();
        }
        // فتح نافذة تسجيل الدخول بعد إغلاق القائمة
        setTimeout(openLoginModal, 200);
    });
}

// --- إغلاق النافذة عند الضغط على زر الـ X ---
if (loginCloseBtn) {
    loginCloseBtn.addEventListener('click', closeLoginModal);
}

// --- إغلاق النافذة عند الضغط على الخلفية الداكنة (خارج البطاقة) ---
// نتحقق أن الضغطة كانت على الـ overlay نفسه وليس على البطاقة
if (loginOverlay) {
    loginOverlay.addEventListener('click', function(e) {
        // إذا كانت الضغطة مباشرة على الـ overlay (وليس على عناصره الداخلية)
        if (e.target === loginOverlay) {
            closeLoginModal();
        }
    });
}

// --- إغلاق النافذة بمفتاح Escape من لوحة المفاتيح ---
// يُحسّن تجربة المستخدم على سطح المكتب
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && loginOverlay && loginOverlay.classList.contains('active')) {
        closeLoginModal();
    }
});


// ============================================================
// وظيفة: إظهار/إخفاء كلمة المرور
// ============================================================
// عند الضغط على أيقونة العين يتبدّل نوع الحقل بين password و text
if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        // قراءة النوع الحالي لحقل كلمة المرور
        const currentType = loginPassword.getAttribute('type');

        if (currentType === 'password') {
            // تحويل لـ text لإظهار كلمة المرور
            loginPassword.setAttribute('type', 'text');
            // تغيير الأيقونة من "عين" إلى "عين مشطوبة"
            togglePassIcon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            // إعادة إخفاء كلمة المرور
            loginPassword.setAttribute('type', 'password');
            // إعادة أيقونة العين العادية
            togglePassIcon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
}


// ============================================================
// دوال مساعدة للتحقق من الصحة (Validation Helpers)
// ============================================================

/**
 * validateEmail — التحقق من صحة صيغة البريد الإلكتروني
 * يستخدم Regex بسيط للتحقق من وجود @ والنقطة
 * @param {string} email - البريد المُدخل
 * @returns {boolean} - true إذا كان صحيحاً
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * validatePassword — التحقق من طول كلمة المرور
 * الحد الأدنى 6 أحرف
 * @param {string} password - كلمة المرور المُدخلة
 * @returns {boolean} - true إذا كانت صحيحة
 */
function validatePassword(password) {
    return password.length >= 6;
}

/**
 * showFieldError — إظهار حالة الخطأ لحقل معين
 * يُضيف class "has-error" على مجموعة الحقل مما يُظهر رسالة الخطأ ببوردر أحمر
 * @param {HTMLElement} group - عنصر المجموعة (.login-field-group)
 */
function showFieldError(group) {
    group.classList.add('has-error');
    group.classList.remove('is-valid');
}

/**
 * clearFieldError — إزالة حالة الخطأ من حقل معين
 * @param {HTMLElement} group - عنصر المجموعة
 */
function clearFieldError(group) {
    group.classList.remove('has-error');
}

/**
 * clearFormErrors — إزالة جميع رسائل الخطأ من الفورم
 * تُستدعى عند إغلاق النافذة لتنظيف الحالة
 */
function clearFormErrors() {
    clearFieldError(emailGroup);
    clearFieldError(passwordGroup);
}


// ============================================================
// التحقق الفوري أثناء الكتابة (Live Validation)
// ============================================================
// يُزيل رسالة الخطأ فور أن يبدأ المستخدم بالكتابة بشكل صحيح
// هذا يُحسّن تجربة المستخدم ويُقلل الإحباط

if (loginEmail) {
    loginEmail.addEventListener('input', function() {
        // إذا كان الحقل صحيحاً الآن، أزِل رسالة الخطأ فوراً
        if (validateEmail(this.value)) {
            clearFieldError(emailGroup);
        }
    });
}

if (loginPassword) {
    loginPassword.addEventListener('input', function() {
        if (validatePassword(this.value)) {
            clearFieldError(passwordGroup);
        }
    });
}


// ============================================================
// دوال إدارة حالة زر الإرسال
// ============================================================

/**
 * setLoadingState — تحويل الزر لحالة "جاري التحميل"
 * يُظهر السبينر المتحرك ويُعطّل الزر لمنع الضغط المتكرر
 */
function setLoadingState() {
    loginSubmitBtn.classList.add('loading');
    loginSubmitBtn.disabled = true;
    loginBtnText.textContent = 'جارٍ تسجيل الدخول...';
}

/**
 * resetSubmitButton — إعادة الزر لحالته الطبيعية
 * يُزيل السبينر ويُعيد النص الأصلي ويُفعّل الزر مجدداً
 */
function resetSubmitButton() {
    loginSubmitBtn.classList.remove('loading');
    loginSubmitBtn.disabled = false;
    loginBtnText.textContent = 'تسجيل الدخول';
}


// ============================================================
// معالج حدث الإرسال (Form Submit Handler)
// ============================================================
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        // منع الإرسال الافتراضي للمتصفح (لا نريد تحديث الصفحة)
        e.preventDefault();

        // --- خطوة 1: التحقق من صحة البيانات ---
        // متغيرات لتتبع حالة الصحة لكل حقل
        let isEmailValid   = validateEmail(loginEmail.value);
        let isPasswordValid = validatePassword(loginPassword.value);
        let hasErrors = false;   // علَم يُشير إلى وجود أخطاء

        // إظهار الخطأ لحقل البريد إذا كان غير صحيح
        if (!isEmailValid) {
            showFieldError(emailGroup);
            hasErrors = true;
        }

        // إظهار الخطأ لحقل كلمة المرور إذا كانت قصيرة جداً
        if (!isPasswordValid) {
            showFieldError(passwordGroup);
            hasErrors = true;
        }

        // إذا كان هناك أخطاء، أوقف العملية هنا ولا ترسل
        if (hasErrors) return;

        // --- خطوة 2: محاكاة عملية تسجيل الدخول ---
        // في التطبيق الحقيقي هنا ستُرسل طلب API للسيرفر
        // حالياً نُحاكي التأخير بـ setTimeout (1.5 ثانية)
        setLoadingState();

        setTimeout(() => {
            // ---- نجاح تسجيل الدخول ----
            // في التطبيق الحقيقي: معالجة استجابة السيرفر هنا

            // إعادة الزر لحالته الطبيعية
            resetSubmitButton();

            // تغيير نص الزر لرسالة نجاح
            loginBtnText.textContent = '✓ تم تسجيل الدخول بنجاح!';
            loginSubmitBtn.style.background = 'linear-gradient(135deg, #1a7a4a, #4caf7d)';

            // إغلاق النافذة بعد 1.5 ثانية إضافية
            setTimeout(() => {
                closeLoginModal();
                // إعادة لون الزر للأصل بعد إغلاق النافذة
                loginSubmitBtn.style.background = '';
            }, 1500);

        }, 1500); // وقت المحاكاة: 1.5 ثانية
    });
}
// ========== 2. إغلاق قائمة المنيو المحمول عند الضغط خارجها ==========
// هذا الجزء يقوم بإغلاق القائمة تلقائياً عند الضغط على أي مكان في الصفحة

// الحصول على عنصر قائمة المنيو المحمول
const mobileMenu = document.querySelector('#mobileMenu');

// إذا كانت القائمة موجودة في الصفحة
if (mobileMenu) {
    // إضافة حدث الضغط على كل الصفحة
    document.addEventListener('click', function(event) {
        // التحقق من أن القائمة مفتوحة بالفعل
        // الفئة 'show' في Bootstrap تشير إلى أن العنصر مفتوح/مرئي
        const isMenuOpen = mobileMenu.classList.contains('show');
        
        // التحقق من أن الضغطة لم تكن على القائمة أو زر التبديل
        const isClickOnMenu = mobileMenu.contains(event.target);
        const isClickOnToggle = event.target.closest('.navbar-toggler');
        
        // إذا كانت القائمة مفتوحة والضغطة خارج القائمة والزر
        if (isMenuOpen && !isClickOnMenu && !isClickOnToggle) {
            // إغلاق القائمة باستخدام Bootstrap Collapse
            const collapse = new bootstrap.Collapse(mobileMenu, {
                toggle: false
            });
            collapse.hide();
        }
    });
}