import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VoteTrackerService {
  private readonly storageKey = 'voted-recommendations';

  hasVoted(id: number): boolean {
    return this.getVotedIds().has(id);
  }

  markVoted(id: number): void {
    const ids = this.getVotedIds();
    ids.add(id);
    localStorage.setItem(this.storageKey, JSON.stringify([...ids]));
  }

  private getVotedIds(): Set<number> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }
}
