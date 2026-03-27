import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, takeUntil } from 'rxjs';
import { Recommendation, RecommendationService } from '../../services/recommendation.service';

export interface CreateEvent {
  text: string;
  submitterName?: string;
}

@Component({
  selector: 'app-recommendation-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="form">
      <div class="input-row">
        <textarea
          [(ngModel)]="text"
          name="text"
          placeholder="What feature would make things better?"
          rows="2"
          class="textarea"
          required
          maxlength="250"
          (ngModelChange)="onTextChange($event)"
          (keydown.meta.Enter)="submit()"
          (keydown.control.Enter)="submit()"
        ></textarea>
      </div>
      @if (similar.length > 0) {
        <div class="similar">
          <span class="similar-label">Similar existing suggestions:</span>
          @for (rec of similar; track rec.id) {
            <button
              type="button"
              class="similar-item"
              [class.already-voted]="votedIds.has(rec.id)"
              [disabled]="votedIds.has(rec.id)"
              (click)="voteSimilar.emit(rec.id)"
            >
              <span class="similar-text">{{ rec.text }}</span>
              @if (votedIds.has(rec.id)) {
                <span class="similar-voted">voted</span>
              } @else {
                <span class="similar-action">vote · {{ rec.votes }}</span>
              }
            </button>
          }
        </div>
      }
      <div class="bottom-row">
        <input
          type="text"
          [(ngModel)]="name"
          name="name"
          placeholder="Name (optional)"
          class="name-input"
          maxlength="200"
        />
        <div class="actions">
          <span class="char-count" [class.warn]="text.length > 220" [class.critical]="text.length > 240">{{ text.length }}<span class="char-sep">/</span>250</span>
          <button type="submit" [disabled]="!text.trim()" class="submit-btn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Submit
          </button>
        </div>
      </div>
    </form>
  `,
  styles: [`
    .form {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 28px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: border-color 0.25s ease;
    }
    .form:focus-within {
      border-color: var(--border-focus);
    }
    .textarea {
      width: 100%;
      padding: 10px 12px;
      border: none;
      border-radius: 6px;
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      outline: none;
      box-sizing: border-box;
      background: transparent;
      color: var(--text-primary);
    }
    .textarea::placeholder {
      color: var(--text-muted);
    }

    /* Similar suggestions */
    .similar {
      padding: 8px 12px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .similar-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--highlight);
      letter-spacing: 0.03em;
      margin-bottom: 2px;
    }
    .similar-item {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      padding: 6px 10px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .similar-item:hover {
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    .similar-text {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .similar-action {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--accent);
      white-space: nowrap;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.15s;
    }
    .similar-item:hover .similar-action {
      opacity: 1;
    }
    .similar-voted {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 600;
      color: var(--accent);
      background: var(--accent-soft);
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .similar-item.already-voted {
      cursor: default;
      border-left: 2px solid var(--accent);
      background: var(--voted-bg);
    }
    .similar-item.already-voted .similar-text {
      color: var(--text-muted);
    }
    .similar-item.already-voted:hover {
      border-color: var(--border);
      border-left: 2px solid var(--accent);
      background: var(--voted-bg);
    }

    .bottom-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--border-subtle);
      margin-top: 4px;
    }
    .name-input {
      flex: 1;
      padding: 7px 10px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      outline: none;
      box-sizing: border-box;
      background: var(--bg-input);
      color: var(--text-secondary);
      transition: border-color 0.2s;
      min-width: 0;
    }
    .name-input::placeholder {
      color: var(--text-muted);
    }
    .name-input:focus {
      border-color: var(--border-focus);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .char-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      transition: color 0.2s;
    }
    .char-count.warn {
      color: var(--highlight);
    }
    .char-count.critical {
      color: #e85454;
    }
    .char-sep {
      opacity: 0.4;
      margin: 0 1px;
    }
    .submit-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      background: var(--accent);
      color: #060d18;
      border: none;
      border-radius: 7px;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .submit-btn:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px var(--accent-glow);
    }
    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .submit-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  `]
})
export class RecommendationFormComponent implements OnDestroy {
  text = '';
  name = '';
  similar: Recommendation[] = [];

  @Input() votedIds = new Set<number>();

  @Output() created = new EventEmitter<CreateEvent>();
  @Output() voteSimilar = new EventEmitter<number>();

  private textInput$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private service: RecommendationService) {
    this.textInput$.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      switchMap(query => {
        const trimmed = query.trim();
        if (trimmed.length < 3) return of([]);
        return this.service.search(trimmed);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.similar = results.slice(0, 3);
    });
  }

  onTextChange(value: string) {
    this.textInput$.next(value);
  }

  submit() {
    if (this.text.trim()) {
      this.created.emit({ text: this.text.trim(), submitterName: this.name.trim() || undefined });
      this.text = '';
      this.name = '';
      this.similar = [];
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
