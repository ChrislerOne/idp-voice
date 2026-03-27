import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Recommendation } from '../../services/recommendation.service';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-recommendation-list',
  standalone: true,
  imports: [TimeAgoPipe],
  template: `
    <div class="list">
      @if (recommendations.length === 0) {
        <div class="empty">
          <div class="empty-line"></div>
          <p class="empty-text">No recommendations yet</p>
          <p class="empty-sub">Submit one above to get started</p>
        </div>
      }
      @for (rec of recommendations; track rec.id; let i = $index) {
        <div
          class="card"
          [class.voted]="votedIds.has(rec.id)"
          [style.animation-delay]="i * 40 + 'ms'"
        >
          <button
            class="vote-btn"
            [class.voted]="votedIds.has(rec.id)"
            [disabled]="votedIds.has(rec.id)"
            (click)="onVote.emit(rec.id)"
          >
            <svg class="chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 6.5L6 1.5L11 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="count">{{ rec.votes }}</span>
          </button>
          <div class="content">
            <p class="text">{{ rec.text }}</p>
            <div class="meta">
              <span class="date">{{ rec.createdAt | timeAgo }}</span>
              @if (votedIds.has(rec.id)) {
                <span class="voted-dot"></span>
                <span class="voted-label">voted</span>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    /* Empty state */
    .empty {
      text-align: center;
      padding: 48px 16px;
    }
    .empty-line {
      width: 32px;
      height: 2px;
      background: var(--border);
      margin: 0 auto 16px;
      border-radius: 1px;
    }
    .empty-text {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .empty-sub {
      margin: 4px 0 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Card */
    .card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 14px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      animation: fadeUp 0.3s ease both;
    }
    .card:hover {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 1px var(--accent-glow), var(--shadow-md);
    }
    .card.voted {
      border-left: 2px solid var(--accent);
    }

    /* Vote button — fixed size, centered */
    .vote-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s ease;
    }
    .vote-btn:hover:not(:disabled) {
      color: var(--accent);
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    .vote-btn:active:not(:disabled) {
      transform: scale(0.95);
    }
    .vote-btn.voted {
      color: var(--accent);
      border-color: var(--voted-border);
      background: var(--voted-bg);
      cursor: default;
    }
    .vote-btn:disabled {
      cursor: default;
    }
    .chevron {
      transition: transform 0.15s ease;
    }
    .vote-btn:hover:not(:disabled) .chevron {
      transform: translateY(-1px);
    }
    .count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      line-height: 1;
    }

    /* Content */
    .content {
      flex: 1;
      min-width: 0;
    }
    .text {
      margin: 0 0 6px;
      font-size: 14px;
      color: var(--text-primary);
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .date {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--text-muted);
      letter-spacing: 0.02em;
    }
    .voted-dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--accent);
    }
    .voted-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--accent);
      letter-spacing: 0.04em;
    }
  `]
})
export class RecommendationListComponent {
  @Input() recommendations: Recommendation[] = [];
  @Input() votedIds = new Set<number>();
  @Output() onVote = new EventEmitter<number>();
}
