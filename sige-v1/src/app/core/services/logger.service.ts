import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private enabled = !!environment.enableDebugLogs;

  log(...args: any[]): void {
    if (this.enabled) console.log('[SIGE]', ...args);
  }
  info(...args: any[]): void {
    if (this.enabled) console.info('[SIGE]', ...args);
  }
  warn(...args: any[]): void {
    if (this.enabled) console.warn('[SIGE]', ...args);
  }
  error(...args: any[]): void {
    if (this.enabled) console.error('[SIGE]', ...args);
  }
  group(label: string): void {
    if (this.enabled) console.group(`[SIGE] ${label}`);
  }
  groupEnd(): void {
    if (this.enabled) console.groupEnd();
  }
}
