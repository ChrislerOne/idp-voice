import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (visible) {
      <div class="toast" [class.leaving]="leaving">{{ message }}</div>
    }
  `,
  styles: [`
    .toast {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      background: var(--accent);
      color: #060d18;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      padding: 8px 18px;
      border-radius: 8px;
      z-index: 100;
      animation: toastIn 0.25s ease;
      box-shadow: 0 4px 20px var(--accent-glow);
    }
    .toast.leaving {
      animation: toastOut 0.2s ease forwards;
    }
    @keyframes toastIn {
      from { opacity: 0; transform: translateX(-50%) translateY(10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    @keyframes toastOut {
      from { opacity: 1; transform: translateX(-50%) translateY(0); }
      to { opacity: 0; transform: translateX(-50%) translateY(10px); }
    }
  `]
})
export class ToastComponent {
  visible = false;
  leaving = false;
  message = '';
  private timeout: any;

  show(message: string) {
    clearTimeout(this.timeout);
    this.leaving = false;
    this.message = message;
    this.visible = true;
    this.timeout = setTimeout(() => {
      this.leaving = true;
      setTimeout(() => { this.visible = false; this.leaving = false; }, 200);
    }, 1800);
  }
}
