export function exportToPDF() {
  // 使用浏览器原生打印功能
  window.print()
}

// 添加打印样式
export function addPrintStyles() {
  const style = document.createElement('style')
  style.textContent = `
    @media print {
      .header-buttons, .restart-button, .share-button {
        display: none !important;
      }
      .results {
        padding: 0 !important;
      }
      .detail-grid {
        page-break-inside: avoid;
      }
    }
  `
  document.head.appendChild(style)
}
