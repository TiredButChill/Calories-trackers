import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { SetLogFormat, WorkoutDisplaySettings } from '../models';

const DEFAULT_SETTINGS: WorkoutDisplaySettings = { setLogFormat: 'per_set' };

@Injectable({ providedIn: 'root' })
export class WorkoutDisplaySettingsService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  getSettings(): Observable<WorkoutDisplaySettings> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [DEFAULT_SETTINGS];
        }
        const settingsDoc = doc(this.firestore, 'users', currentUser.uid, 'settings', 'workoutDisplay');
        return runInInjectionContext(this.injector, () => docData(settingsDoc)).pipe(
          map((data) => (data as WorkoutDisplaySettings) ?? DEFAULT_SETTINGS)
        );
      })
    );
  }

  setFormat(setLogFormat: SetLogFormat): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    const settingsDoc = doc(this.firestore, 'users', uid, 'settings', 'workoutDisplay');
    return setDoc(settingsDoc, { setLogFormat }, { merge: true });
  }
}
