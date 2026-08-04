import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { DailyLog, DailyLogItem } from '../models';
import { toDateKey } from '../../shared/utils/date.util';

@Injectable({ providedIn: 'root' })
export class DailyLogService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  getToday(): Observable<DailyLog> {
    return this.getByDate(toDateKey());
  }

  getByDate(date: string): Observable<DailyLog> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [{ date, items: [] } as DailyLog];
        }
        const logDoc = doc(this.firestore, 'users', currentUser.uid, 'dailyLogs', date);
        return runInInjectionContext(this.injector, () => docData(logDoc)).pipe(map((data) => (data as DailyLog) ?? { date, items: [] }));
      })
    );
  }

  async addFood(item: DailyLogItem, date: string = toDateKey()): Promise<void> {
    const logDoc = this.getLogDocRef(date);
    const existing = await getDoc(logDoc);
    const items: DailyLogItem[] = existing.exists() ? (existing.data()['items'] ?? []) : [];
    const newItem: DailyLogItem = { ...item, id: item.id ?? crypto.randomUUID() };
    await setDoc(logDoc, { date, items: [...items, newItem] });
  }

  async removeFood(itemId: string, date: string = toDateKey()): Promise<void> {
    const logDoc = this.getLogDocRef(date);
    const existing = await getDoc(logDoc);
    if (!existing.exists()) {
      return;
    }
    const items: DailyLogItem[] = existing.data()['items'] ?? [];
    await setDoc(logDoc, { date, items: items.filter((entry) => entry.id !== itemId) });
  }

  async updateFood(itemId: string, changes: Partial<DailyLogItem>, date: string = toDateKey()): Promise<void> {
    const logDoc = this.getLogDocRef(date);
    const existing = await getDoc(logDoc);
    if (!existing.exists()) {
      return;
    }
    const items: DailyLogItem[] = existing.data()['items'] ?? [];
    await setDoc(logDoc, {
      date,
      items: items.map((entry) => (entry.id === itemId ? { ...entry, ...changes } : entry))
    });
  }

  private getLogDocRef(date: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return doc(this.firestore, 'users', uid, 'dailyLogs', date);
  }
}
