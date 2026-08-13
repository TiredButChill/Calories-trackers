import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, deleteField, doc, docData, documentId, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { DayOfWeek, ScheduleOverride } from '../models';

@Injectable({ providedIn: 'root' })
export class ScheduleOverrideService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  getOverride(weekStart: string): Observable<ScheduleOverride> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [{} as ScheduleOverride];
        }
        const overrideDoc = doc(this.firestore, 'users', currentUser.uid, 'scheduleOverrides', weekStart);
        return runInInjectionContext(this.injector, () => docData(overrideDoc)).pipe(map((data) => (data as ScheduleOverride) ?? {}));
      })
    );
  }

  getOverridesInRange(startWeek: string, endWeek: string): Observable<Record<string, ScheduleOverride>> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return of([] as (ScheduleOverride & { weekStart: string })[]);
        }
        const overridesCollection = collection(this.firestore, 'users', currentUser.uid, 'scheduleOverrides');
        const rangeQuery = query(overridesCollection, where(documentId(), '>=', startWeek), where(documentId(), '<=', endWeek));
        return runInInjectionContext(this.injector, () => collectionData(rangeQuery, { idField: 'weekStart' })) as Observable<
          (ScheduleOverride & { weekStart: string })[]
        >;
      }),
      map((overrides) => {
        const byWeek: Record<string, ScheduleOverride> = {};
        for (const { weekStart, ...override } of overrides) {
          byWeek[weekStart] = override as ScheduleOverride;
        }
        return byWeek;
      })
    );
  }

  rescheduleDay(weekStart: string, fromDay: DayOfWeek, toDay: DayOfWeek): Promise<void> {
    return setDoc(this.getOverrideDocRef(weekStart), { [fromDay]: toDay }, { merge: true });
  }

  async cancelReschedule(weekStart: string, fromDay: DayOfWeek): Promise<void> {
    await updateDoc(this.getOverrideDocRef(weekStart), { [fromDay]: deleteField() });
  }

  private getOverrideDocRef(weekStart: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return doc(this.firestore, 'users', uid, 'scheduleOverrides', weekStart);
  }
}
