export const setupErrorHandler = () => {
  window.addEventListener('error', (event) => {
    if (event.message.includes('runtime.lastError')) {
      event.preventDefault();
      return;
    }
  });
}; 