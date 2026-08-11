import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { WorkoutTemplateService } from './workout-template.service';
import { DayOfWeek, WeekSchedule, WorkoutTemplate } from '../models';

const DEFAULT_SCHEDULE: WeekSchedule = { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null };

@Injectable({ providedIn: 'root' })
export class WorkoutScheduleService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);
  private readonly workoutTemplateService = inject(WorkoutTemplateService);

  getSchedule(): Observable<WeekSchedule> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [DEFAULT_SCHEDULE];
        }
        const scheduleDoc = doc(this.firestore, 'users', currentUser.uid, 'settings', 'weekSchedule');
        return runInInjectionContext(this.injector, () => docData(scheduleDoc)).pipe(map((data) => (data as WeekSchedule) ?? DEFAULT_SCHEDULE));
      })
    );
  }

  assignDay(day: DayOfWeek, templateId: string | null): Promise<void> {
    return setDoc(this.getScheduleDocRef(), { [day]: templateId }, { merge: true });
  }

  async copyDay(sourceDay: DayOfWeek, targetDay: DayOfWeek): Promise<void> {
    const schedule = await this.getScheduleSnapshot();
    await this.assignDay(targetDay, schedule[sourceDay]);
  }

  async unassignTemplate(templateId: string): Promise<void> {
    const schedule = await this.getScheduleSnapshot();
    const changes: Partial<WeekSchedule> = {};
    for (const day of Object.keys(schedule) as DayOfWeek[]) {
      if (schedule[day] === templateId) {
        changes[day] = null;
      }
    }
    if (Object.keys(changes).length > 0) {
      await setDoc(this.getScheduleDocRef(), changes, { merge: true });
    }
  }

  getTemplateForDay(day: DayOfWeek): Observable<WorkoutTemplate | null> {
    return this.getSchedule().pipe(
      switchMap((schedule) => {
        const templateId = schedule[day];
        return templateId ? this.workoutTemplateService.getTemplate(templateId).pipe(map((template) => template ?? null)) : of(null);
      })
    );
  }

  private async getScheduleSnapshot(): Promise<WeekSchedule> {
    const snapshot = await getDoc(this.getScheduleDocRef());
    return (snapshot.data() as WeekSchedule) ?? DEFAULT_SCHEDULE;
  }

  private getScheduleDocRef() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return doc(this.firestore, 'users', uid, 'settings', 'weekSchedule');
  }
}
