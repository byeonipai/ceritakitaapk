export default class NotFoundView {
    constructor(container) {
      this.container = container;
    }
  
    render() {
      this.container.innerHTML = this.generateNotFoundHTML();
    }
  
    generateNotFoundHTML() {
      return `
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist.</p>
        <a href="#/">Kembali ke Beranda</a>

      `;
    }
  }
