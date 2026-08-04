import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable, map, shareReplay } from 'rxjs';
import { AppUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);

  readonly currentUser$: Observable<AppUser | null> = user(this.auth).pipe(
    map((firebaseUser) =>
      firebaseUser
        ? {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          }
        : null
    ),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  readonly isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map((currentUser) => !!currentUser));

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
