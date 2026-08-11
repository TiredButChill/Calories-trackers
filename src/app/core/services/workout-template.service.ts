import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { WorkoutTemplate, WorkoutTemplateExercise } from '../models';

@Injectable({ providedIn: 'root' })
export class WorkoutTemplateService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  getTemplates(): Observable<WorkoutTemplate[]> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [[] as WorkoutTemplate[]];
        }
        const templatesCollection = collection(this.firestore, 'users', currentUser.uid, 'workoutTemplates');
        return runInInjectionContext(this.injector, () => collectionData(templatesCollection, { idField: 'id' })) as Observable<WorkoutTemplate[]>;
      })
    );
  }

  getTemplate(id: string): Observable<WorkoutTemplate | undefined> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [undefined];
        }
        const templateDoc = doc(this.firestore, 'users', currentUser.uid, 'workoutTemplates', id);
        return runInInjectionContext(this.injector, () => docData(templateDoc, { idField: 'id' })) as Observable<WorkoutTemplate | undefined>;
      })
    );
  }

  async addTemplate(template: Omit<WorkoutTemplate, 'id'>): Promise<string> {
    const templatesCollection = collection(this.firestore, 'users', this.requireUid(), 'workoutTemplates');
    const ref = await addDoc(templatesCollection, template);
    return ref.id;
  }

  updateTemplate(id: string, changes: Partial<Pick<WorkoutTemplate, 'name'>>): Promise<void> {
    return updateDoc(doc(this.firestore, 'users', this.requireUid(), 'workoutTemplates', id), changes);
  }

  deleteTemplate(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'users', this.requireUid(), 'workoutTemplates', id));
  }

  async addExerciseToTemplate(templateId: string, exercise: WorkoutTemplateExercise): Promise<void> {
    const template = await this.getTemplateSnapshot(templateId);
    await this.reorderExercises(templateId, [...template.exercises, exercise]);
  }

  async removeExerciseFromTemplate(templateId: string, rowId: string): Promise<void> {
    const template = await this.getTemplateSnapshot(templateId);
    await this.reorderExercises(
      templateId,
      template.exercises.filter((exercise) => exercise.id !== rowId)
    );
  }

  reorderExercises(templateId: string, orderedExercises: WorkoutTemplateExercise[]): Promise<void> {
    return updateDoc(doc(this.firestore, 'users', this.requireUid(), 'workoutTemplates', templateId), { exercises: orderedExercises });
  }

  private async getTemplateSnapshot(templateId: string): Promise<WorkoutTemplate> {
    const templateDoc = doc(this.firestore, 'users', this.requireUid(), 'workoutTemplates', templateId);
    const snapshot = await getDoc(templateDoc);
    return (snapshot.data() as WorkoutTemplate) ?? { name: '', exercises: [] };
  }

  private requireUid(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return uid;
  }
}
