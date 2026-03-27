import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const now = Date.now();
    const time = new Date(value).getTime();
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) {
      const m = Math.floor(diff / 60);
      return `${m}m ago`;
    }
    if (diff < 86400) {
      const h = Math.floor(diff / 3600);
      return `${h}h ago`;
    }
    if (diff < 604800) {
      const d = Math.floor(diff / 86400);
      return `${d}d ago`;
    }
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
