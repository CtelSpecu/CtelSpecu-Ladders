<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-text">
        <span class="copyright">© 2025 </span>
        <a 
          href="https://ctelspecu.hxcn.top" 
          target="_blank" 
          rel="noopener noreferrer"
          class="brand-link"
        >
          ✨ 星空之镜 (CtelSpecu)
        </a>
        <span class="divider">|</span>
        <span class="powered-by">
          ⚡ Vite + Vue.js
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer组件 - 无需额外逻辑
</script>

<style scoped>
.app-footer {
  width: 100%;
  margin-top: auto;
  padding: var(--spacing-xl) 0;
  background: var(--background-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-primary);
  position: relative;
  overflow: hidden;
}

.app-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0.05;
  pointer-events: none;
  z-index: -1;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  justify-content: center;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.copyright {
  color: var(--text-tertiary);
  font-weight: 500;
}

.divider {
  color: var(--text-quaternary);
  font-weight: 300;
}

.brand-link {
  color: var(--text-accent);
  text-decoration: none;
  font-weight: 600;
  position: relative;
  transition: all var(--transition-normal);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 6px;
}

.brand-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sub-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal);
  border-radius: 6px;
  z-index: -1;
}

.brand-link:hover {
  color: var(--text-accent);
  transform: translateY(-1px);
  box-shadow: var(--soft-shadow);
}

.brand-link:hover::before {
  opacity: 0.2;
}

.powered-by {
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app-footer {
    padding: var(--spacing-lg) 0;
  }
  
  .footer-content {
    padding: 0 var(--spacing-lg);
  }
  
  .footer-text {
    font-size: var(--font-size-xs);
    gap: var(--spacing-xs);
    text-align: center;
  }
  
  .brand-link {
    padding: var(--spacing-xs);
  }
  
  .divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: var(--spacing-md) 0;
  }
  
  .footer-content {
    padding: 0 var(--spacing-md);
  }
  
  .footer-text {
    flex-direction: column;
    gap: var(--spacing-xs);
    line-height: 1.4;
  }
  
  .powered-by {
    margin-top: var(--spacing-xs);
  }
}
</style>