import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { RecommendationFormComponent, CreateEvent } from './components/recommendation-form/recommendation-form.component';
import { RecommendationListComponent } from './components/recommendation-list/recommendation-list.component';
import { ToastComponent } from './components/toast/toast.component';
import { Recommendation, RecommendationService } from './services/recommendation.service';
import { VoteTrackerService } from './services/vote-tracker.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchBarComponent, RecommendationFormComponent, RecommendationListComponent, ToastComponent],
  template: `
    <div class="bookmark-tab" aria-label="Bookmark this page" (click)="onBookmarkClick()">
      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
        <path d="M2 2h10v12.5L7 10.5 2 14.5V2z" fill="currentColor"/>
      </svg>
      <span class="bookmark-label">I exist forever — bookmark me for future feature requests :)</span>
    </div>
    <div class="page">
      <header class="header">
        <div class="header-inner">
          <div class="brand">
            <div class="brand-mark"></div>
            <h1 class="title">IDP Voice</h1>
          </div>
          <button
            class="theme-toggle"
            (click)="theme.toggle()"
            [attr.aria-label]="theme.dark() ? 'Light mode' : 'Dark mode'"
          >
            @if (theme.dark()) {
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 9.2A6.5 6.5 0 016.8 2 6 6 0 1014 9.2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            }
          </button>
        </div>
      </header>
      <main class="container">
        <app-search-bar
          (searchChange)="onSearch($event)"
          (sortChange)="onSortChange($event)"
        />
        <app-recommendation-form [votedIds]="votedIds" (created)="onCreate($event)" (voteSimilar)="onVote($event)" />
        <app-recommendation-list
          [recommendations]="recommendations"
          [votedIds]="votedIds"
          (onVote)="onVote($event)"
        />
      </main>
    </div>
    <app-toast />
  `,
  styles: [`
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to   { transform: translateY(0);     opacity: 1; }
    }
    .bookmark-tab {
      position: fixed;
      left: 24px;
      top: 54px;
      z-index: 50;
      width: 34px;
      padding: 10px 0 12px;
      background: var(--accent);
      border-radius: 3px 3px 0 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      color: #060d18;
      box-shadow: 0 4px 16px rgba(0, 214, 114, 0.35);
      animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .bookmark-tab::after {
      content: '';
      position: absolute;
      bottom: -13px;
      left: 0;
      right: 0;
      height: 13px;
      background:
        linear-gradient(135deg,  var(--accent) 50%, transparent 50%),
        linear-gradient(-135deg, var(--accent) 50%, transparent 50%);
      background-size: 50% 100%;
      background-position: left, right;
      background-repeat: no-repeat;
    }
    .bookmark-tab:hover {
      transform: translateY(3px);
      box-shadow: 0 6px 20px rgba(0, 214, 114, 0.45);
    }
    .bookmark-tab:hover .bookmark-label {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
    .bookmark-label {
      position: absolute;
      left: calc(100% + 10px);
      top: 50%;
      transform: translateX(-6px) translateY(-50%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      background: var(--accent);
      color: #060d18;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      padding: 5px 10px;
      border-radius: 20px;
      box-shadow: 0 2px 10px rgba(0, 214, 114, 0.3);
    }
    :host { display: block; position: relative; z-index: 1; }
    .page {
      min-height: 100vh;
    }
    .header {
      position: sticky;
      top: 0;
      z-index: 10;
      background: var(--header-bg);
      backdrop-filter: blur(16px) saturate(1.2);
      -webkit-backdrop-filter: blur(16px) saturate(1.2);
      border-bottom: 1px solid var(--border-subtle);
    }
    .header-inner {
      max-width: 640px;
      margin: 0 auto;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-mark {
      width: 8px;
      height: 8px;
      border-radius: 2px;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent-glow);
    }
    .title {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.2px;
    }
    .theme-toggle {
      background: none;
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 34px;
      height: 34px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      transition: all 0.2s ease;
    }
    .theme-toggle:hover {
      color: var(--text-primary);
      border-color: var(--text-muted);
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
      padding: 28px 20px 80px;
    }
  `]
})
export class AppComponent implements OnInit {
  recommendations: Recommendation[] = [];
  votedIds = new Set<number>();
  private currentSort = 'newest';
  private currentQuery = '';

  @ViewChild(ToastComponent) toast!: ToastComponent;

  constructor(
    private service: RecommendationService,
    private voteTracker: VoteTrackerService,
    public theme: ThemeService
  ) {}

  ngOnInit() {
    this.theme.apply();
    this.load();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === '/' && !this.isInputFocused()) {
      e.preventDefault();
      document.querySelector<HTMLInputElement>('.search-input')?.focus();
    }
  }

  onSearch(query: string) {
    this.currentQuery = query;
    this.load();
  }

  onSortChange(sort: string) {
    this.currentSort = sort;
    this.load();
  }

  onCreate(event: CreateEvent) {
    this.service.create(event.text, event.submitterName).subscribe(rec => {
      this.voteTracker.markVoted(rec.id);
      this.load();
      this.toast.show('Submitted!');
    });
  }

  onVote(id: number) {
    if (this.voteTracker.hasVoted(id)) return;
    this.voteTracker.markVoted(id);
    this.votedIds = new Set(this.votedIds).add(id);
    this.service.vote(id).subscribe(() => {
      this.load();
      this.toast.show('Voted!');
    });
  }

  private load() {
    const handler = (data: Recommendation[]) => {
      this.recommendations = data;
      this.votedIds = new Set(data.map(r => r.id).filter(id => this.voteTracker.hasVoted(id)));
    };
    if (this.currentQuery.trim()) {
      this.service.search(this.currentQuery).subscribe(handler);
    } else {
      this.service.list(this.currentSort).subscribe(handler);
    }
  }

  onBookmarkClick() {
    const key = navigator.platform.toUpperCase().includes('MAC') ? '⌘D' : 'Ctrl+D';
    this.toast.show(`Press ${key} to bookmark`);
  }

  private isInputFocused(): boolean {
    const tag = document.activeElement?.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  }
}
