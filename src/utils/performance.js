// 图片懒加载指令
export const lazyLoad = {
  mounted(el, binding) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = binding.value;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px' // 提前50px开始加载
    });

    el.classList.add('lazy');
    imageObserver.observe(el);
  }
};

// 预加载关键资源
export const preloadCriticalAssets = () => {
  // 移除FontAwesome预加载，因为它已经在main.js中直接导入
  // 如果需要预加载其他关键资源，可以在这里添加
};

// 延迟加载非关键CSS
export const loadNonCriticalCSS = () => {
  const nonCriticalCSS = [
    '@fortawesome/fontawesome-free/css/fontawesome.css'
  ];

  nonCriticalCSS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function() {
      this.media = 'all';
    };
    document.head.appendChild(link);
  });
};
