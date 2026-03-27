import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="controls">
      <div class="search-wrapper">
        <svg class="search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10.5 10.5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          type="text"
          [(ngModel)]="query"
          (ngModelChange)="onSearch()"
          placeholder="Search..."
          class="search-input"
        />
      </div>
      <div class="sort-group">
        @for (option of sortOptions; track option.value) {
          <button
            class="sort-btn"
            [class.active]="sort === option.value"
            (click)="setSort(option.value)"
          >
            {{ option.label }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .controls {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .search-wrapper {
      flex: 1;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 9px 12px 9px 34px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      outline: none;
      background: var(--bg-input);
      color: var(--text-primary);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-input::placeholder {
      color: var(--text-muted);
    }
    .search-input:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 2px var(--accent-glow);
    }
    .sort-group {
      display: flex;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 2px;
      gap: 1px;
      flex-shrink: 0;
    }
    .sort-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      padding: 6px 10px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      letter-spacing: 0.02em;
    }
    .sort-btn:hover {
      color: var(--text-secondary);
    }
    .sort-btn.active {
      background: var(--bg-secondary);
      color: var(--accent);
      box-shadow: var(--shadow-sm);
    }
  `]
})
export class SearchBarComponent {
  query = '';
  sort = 'newest';

  sortOptions = [
    { value: 'newest', label: 'New' },
    { value: 'most-voted', label: 'Top' },
    { value: 'oldest', label: 'Old' },
  ];

  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSearch() {
    this.searchChange.emit(this.query);
  }

  setSort(value: string) {
    this.sort = value;
    this.sortChange.emit(this.sort);
  }
}
