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