import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { ExerciseService } from '../../../core/services/exercise.service';
import { TranslationService } from '../../../core/services/translation.service';
import { WorkoutDisplaySettingsService } from '../../../core/services/workout-display-settings.service';
import { WorkoutSessionService } from '../../../core/services/workout-session.service';
import { SetLogFormat, WorkoutSessionExercise, WorkoutSet } from '../../../core/models';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { WORKOUT_STATUS_LABELS } from '../../../shared/constants/workout-labels.const';
import { toDateKey } from '../../../shared/utils/date.util';
import { compareExercises, detectPRs, sessionRepCount, sessionSetCount, sessionVolume } from '../../../shared/utils/workout-stats.util';

interface SetRow extends WorkoutSet {
  isDraft: boolean;
}

interface CompactSet {
  weight: number;
  reps: number;
  setCount: number;
}

interface ExerciseRow {
  exercise: WorkoutSessionExercise;
  previousExercise: WorkoutSessionExercise | null;
  rows: SetRow[];
  compact: CompactSet;
  comparison: ReturnType<typeof compareExercises>;
  prCount: number;
}

@Component({
  selector: 'app-workout-today',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    DialogModule,
    InputNumberModule,
    CheckboxModule,
    SelectModule,
    SelectButtonModule,
    TagModule,
    TranslatePipe
  ],
  templateUrl: './workout-today.html'
})
export class WorkoutToday {
  private readonly fb = inject(FormBuilder);
  private readonly workoutSessionService = inject(WorkoutSessionService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly workoutDisplaySettingsService = inject(WorkoutDisplaySettingsService);
  private readonly translationService = inject(TranslationService);

  readonly date = toDateKey();
  readonly statusLabels = WORKOUT_STATUS_LABELS;
  readonly showAddExerciseDialog = signal(false);
  readonly showFormatDialog = signal(false);
  readonly extraRows = signal<Record<string, number>>({});
  readonly addExerciseError = signal('');
  readonly loadError = signal('');

  // toObservable() requires an injection context, so it must be created here (a field
  // initializer runs during construction) rather than inside the viewModel$ switchMap below.
  private readonly extraRows$ = toObservable(this.extraRows);

  private exercisesList: { id?: string; name: string }[] = [];

  session$ = this.workoutSessionService.getByDate(this.date).pipe(
    tap(() => this.loadError.set('')),
    catchError((error) => {
      console.error('Failed to load today’s workout session', error);
      const code = (error as { code?: string })?.code;
      this.loadError.set(
        code === 'permission-denied'
          ? this.translationService.t('workout.today.loadErrorPermission')
          : `${this.translationService.t('workout.today.loadErrorGeneric')}${code ? ` (${code})` : ''}`
      );
      return of(null);
    })
  );

  exerciseOptions$ = this.exerciseService.getExercises().pipe(map((list) => list.map((exercise) => ({ label: exercise.name, value: exercise.id, name: exercise.name }))));

  addExerciseForm = this.fb.group({ exerciseId: ['', Validators.required] });

  displaySettings$ = this.workoutDisplaySettingsService.getSettings();

  constructor() {
    this.exerciseService.getExercises().subscribe((list) => (this.exercisesList = list));
  }

  getSetLogFormatOptions(): { label: string; value: SetLogFormat }[] {
    return [
      { label: this.translationService.t('workout.today.formatPerSet'), value: 'per_set' },
      { label: this.translationService.t('workout.today.formatWeightRepSet'), value: 'weight_rep_set' }
    ];
  }

  viewModel$ = this.session$.pipe(
    switchMap((session) => {
      if (!session) {
        return of(null);
      }
      if (session.exercises.length === 0) {
        return combineLatest([of([] as ExerciseRow[]), this.displaySettings$]).pipe(
          map(([exerciseRows, displaySettings]) => ({ session, exerciseRows, setLogFormat: displaySettings.setLogFormat }))
        );
      }
      const previous$ = combineLatest(
        session.exercises.map((exercise) => this.workoutSessionService.getMostRecentPrevious(exercise.exerciseId, session.date))
      );
      return combineLatest([previous$, this.extraRows$, this.displaySettings$]).pipe(
        map(([previousSessions, extra, displaySettings]) => ({
          session,
          setLogFormat: displaySettings.setLogFormat,
          exerciseRows: session.exercises.map((exercise, index) => {
            const previousSession = previousSessions[index];
            const previousExercise = previousSession?.exercises.find((candidate) => candidate.exerciseId === exercise.exerciseId) ?? null;
            const rowCount = Math.max(exercise.sets.length, previousExercise?.sets.length ?? 0, 1) + (extra[exercise.id] ?? 0);
            const rows: SetRow[] = [];
            for (let i = 1; i <= rowCount; i++) {
              const logged = exercise.sets.find((set) => set.setNumber === i);
              if (logged) {
                rows.push({ ...logged, isDraft: false });
              } else {
                const previousSet = previousExercise?.sets.find((set) => set.setNumber === i);
                rows.push({ setNumber: i, weight: previousSet?.weight ?? 0, reps: 0, isWarmup: false, completed: false, isDraft: true });
              }
            }
            return {
              exercise,
              previousExercise,
              rows,
              compact: this.compactFor(exercise, previousExercise),
              comparison: compareExercises(exercise, previousExercise),
              prCount: detectPRs(exercise, previousExercise).length
            };
          })
        }))
      );
    }),
    catchError((error) => {
      console.error('Failed to load comparison data for today’s workout', error);
      const code = (error as { code?: string })?.code;
      const message = (error as { message?: string })?.message ?? '';
      this.loadError.set(
        code === 'failed-precondition'
          ? `${this.translationService.t('workout.today.comparisonIndexError')} ${message}`
          : `${this.translationService.t('workout.today.comparisonGenericError')}${code ? ` (${code})` : ''} ${message}`
      );
      return of(null);
    })
  );

  sessionVolume = sessionVolume;
  sessionSetCount = sessionSetCount;
  sessionRepCount = sessionRepCount;

  async commitSet(exerciseRowId: string, row: SetRow, changes: Partial<WorkoutSet>): Promise<void> {
    const next: WorkoutSet = { ...row, ...changes };
    delete (next as Partial<SetRow>).isDraft;
    await this.workoutSessionService.logSet(this.date, exerciseRowId, next);
  }

  async removeSet(exerciseRowId: string, setNumber: number): Promise<void> {
    await this.workoutSessionService.removeSet(this.date, exerciseRowId, setNumber);
  }

  async commitCompact(exerciseRowId: string, current: CompactSet, changes: Partial<CompactSet>): Promise<void> {
    const next = { ...current, ...changes };
    const setCount = Math.max(1, Math.round(next.setCount));
    const sets: WorkoutSet[] = Array.from({ length: setCount }, (_, i) => ({
      setNumber: i + 1,
      weight: next.weight,
      reps: next.reps,
      isWarmup: false,
      completed: false
    }));
    await this.workoutSessionService.replaceSets(this.date, exerciseRowId, sets);
  }

  async setFormat(format: SetLogFormat): Promise<void> {
    await this.workoutDisplaySettingsService.setFormat(format);
    this.showFormatDialog.set(false);
  }

  private compactFor(exercise: WorkoutSessionExercise, previousExercise: WorkoutSessionExercise | null): CompactSet {
    const working = exercise.sets.filter((set) => !set.isWarmup);
    if (working.length > 0) {
      return { weight: working[0].weight, reps: working[0].reps, setCount: working.length };
    }
    const previousWorking = previousExercise?.sets.filter((set) => !set.isWarmup) ?? [];
    return { weight: previousWorking[0]?.weight ?? 0, reps: 0, setCount: 3 };
  }

  addSetRow(exerciseId: string): void {
    this.extraRows.update((current) => ({ ...current, [exerciseId]: (current[exerciseId] ?? 0) + 1 }));
  }

  async addExercise(): Promise<void> {
    if (this.addExerciseForm.invalid) {
      return;
    }
    this.addExerciseError.set('');
    const value = this.addExerciseForm.getRawValue();
    const exercise = this.exercisesList.find((candidate) => candidate.id === value.exerciseId);
    if (!exercise || !exercise.id) {
      this.addExerciseError.set(this.translationService.t('workout.today.addExerciseErrorSelect'));
      return;
    }
    try {
      await this.workoutSessionService.addExerciseToSession(this.date, { exerciseId: exercise.id, exerciseName: exercise.name });
      this.addExerciseForm.reset({ exerciseId: '' });
      this.showAddExerciseDialog.set(false);
    } catch {
      this.addExerciseError.set(this.translationService.t('workout.today.addExerciseErrorGeneric'));
    }
  }

  async complete(): Promise<void> {
    await this.workoutSessionService.completeSession(this.date);
  }

  async reopen(): Promise<void> {
    await this.workoutSessionService.reopenSession(this.date);
  }

  previousSetsSummary(previousExercise: WorkoutSessionExercise | null): string {
    if (!previousExercise || previousExercise.sets.length === 0) {
      return this.translationService.t('workout.today.noData');
    }
    return previousExercise.sets.map((set) => `${set.weight}×${set.reps}`).join(', ');
  }

  formatDuration(seconds?: number): string {
    if (!seconds) {
      return '-';
    }
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }
}
