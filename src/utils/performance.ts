import type { DirectiveBinding } from 'vue'

export const lazyLoad = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding<string>): void {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = binding.value
            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px',
      },
    )

    el.classList.add('lazy')
    imageObserver.observe(el)
  },
}

export const preloadCriticalAssets = (): void => {
  // FontAwesome 已在 main.ts 中直接导入，无需预加载
}

export const loadNonCriticalCSS = (): void => {
  const nonCriticalCSS: string[] = ['@fortawesome/fontawesome-free/css/fontawesome.css']

  nonCriticalCSS.forEach((href) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.media = 'print'
    link.onload = function (this: HTMLLinkElement) {
      this.media = 'all'
    }
    document.head.appendChild(link)
  })
}
