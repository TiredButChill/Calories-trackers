import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query } from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { WeightEntry } from '../models';

@Injectable({ providedIn: 'root' })
export class WeightService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  getEntries(): Observable<WeightEntry[]> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [[] as WeightEntry[]];
        }
        const entriesQuery = query(collection(this.firestore, 'users', currentUser.uid, 'weights'), orderBy('date', 'desc'));
        return runInInjectionContext(this.injector, () => collectionData(entriesQuery, { idField: 'id' })) as Observable<WeightEntry[]>;
      })
    );
  }

  addEntry(entry: WeightEntry): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return addDoc(collection(this.firestore, 'users', uid, 'weights'), entry).then(() => undefined);
  }

  deleteEntry(id: string): Promise<void> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return deleteDoc(doc(this.firestore, 'users', uid, 'weights', id));
  }
}
