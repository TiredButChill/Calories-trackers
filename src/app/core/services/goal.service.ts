import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Goal } from '../models';

const DEFAULT_GOAL: Goal = { calories: 2000, protein: 120, fat: 70, carb: 250 };

@Injectable({ providedIn: 'root' })
export class GoalService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  getGoal(): Observable<Goal> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [DEFAULT_GOAL];
        }
        const goalDoc = doc(this.firestore, 'users', currentUser.uid, 'goals', 'current');
        return runInInjectionContext(this.injector, () => docData(goalDoc)).pipe(map((data) => (data as Goal) ?? DEFAULT_GOAL));
      })
    );
  }

  setGoal(goal: Goal): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return setDoc(doc(this.firestore, 'users', uid, 'goals', 'current'), goal);
  }
}
