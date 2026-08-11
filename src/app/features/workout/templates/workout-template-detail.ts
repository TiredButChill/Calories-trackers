import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { map } from 'rxjs';
import { ExerciseService } from '../../../core/services/exercise.service';
import { WorkoutTemplateService } from '../../../core/services/workout-template.service';
import { Exercise, WorkoutTemplateExercise } from '../../../core/models';

@Component({
  selector: 'app-workout-template-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, ButtonModule, CardModule, DialogModule, InputNumberModule, InputTextModule, SelectModule],
  templateUrl: './workout-template-detail.html'
})
export class WorkoutTemplateDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly workoutTemplateService = inject(WorkoutTemplateService);
  private readonly exerciseService = inject(ExerciseService);

  private readonly templateId = this.route.snapshot.paramMap.get('id')!;
  private exercisesList: Exercise[] = [];

  readonly showAddDialog = signal(false);
  readonly renaming = signal(false);
  readonly addError = signal('');

  template$ = this.workoutTemplateService.getTemplate(this.templateId);
  exerciseOptions$ = this.exerciseService.getExercises().pipe(map((list) => list.map((exercise) => ({ label: exercise.name, value: exercise.id }))));

  nameForm = this.fb.group({ name: ['', Validators.required] });
  addForm = this.fb.group({
    exerciseId: ['', Validators.required],
    sets: this.fb.control<number | null>(null),
    repsMin: this.fb.control<number | null>(null),
    repsMax: this.fb.control<number | null>(null)
  });

  constructor() {
    this.exerciseService.getExercises().subscribe((list) => (this.exercisesList = list));
    this.template$.subscribe((template) => {
      if (template) {
        this.nameForm.patchValue({ name: template.name }, { emitEvent: false });
      }
    });
  }

  async rename(): Promise<void> {
    if (this.nameForm.invalid) {
      return;
    }
    await this.workoutTemplateService.updateTemplate(this.templateId, { name: this.nameForm.getRawValue().name! });
    this.renaming.set(false);
  }

  async addExercise(): Promise<void> {
    if (this.addForm.invalid) {
      return;
    }
    this.addError.set('');
    const value = this.addForm.getRawValue();
    const exercise = this.exercisesList.find((candidate) => candidate.id === value.exerciseId);
    if (!exercise) {
      this.addError.set('Vui lòng chọn một bài tập từ danh sách.');
      return;
    }
    try {
      await this.workoutTemplateService.addExerciseToTemplate(this.templateId, {
        id: crypto.randomUUID(),
        exerciseId: exercise.id!,
        exerciseName: exercise.name,
        // sets/reps are optional — omit rather than write `undefined`, which Firestore rejects.
        ...(value.sets !== null ? { sets: Number(value.sets) } : {}),
        ...(value.repsMin !== null ? { repsMin: Number(value.repsMin) } : {}),
        ...(value.repsMax !== null ? { repsMax: Number(value.repsMax) } : {})
      });
      this.addForm.reset({ exerciseId: '', sets: null, repsMin: null, repsMax: null });
      this.showAddDialog.set(false);
    } catch {
      this.addError.set('Không thể thêm bài tập. Vui lòng thử lại.');
    }
  }

  async remove(rowId: string): Promise<void> {
    await this.workoutTemplateService.removeExerciseFromTemplate(this.templateId, rowId);
  }

  async moveUp(exercises: WorkoutTemplateExercise[], index: number): Promise<void> {
    if (index === 0) {
      return;
    }
    const reordered = [...exercises];
    [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
    await this.workoutTemplateService.reorderExercises(this.templateId, reordered);
  }

  async moveDown(exercises: WorkoutTemplateExercise[], index: number): Promise<void> {
    if (index === exercises.length - 1) {
      return;
    }
    const reordered = [...exercises];
    [reordered[index + 1], reordered[index]] = [reordered[index], reordered[index + 1]];
    await this.workoutTemplateService.reorderExercises(this.templateId, reordered);
  }

  async updateField(exercises: WorkoutTemplateExercise[], rowId: string, field: 'sets' | 'repsMin' | 'repsMax', value: number | null): Promise<void> {
    const updated = exercises.map((exercise) => {
      if (exercise.id !== rowId) {
        return exercise;
      }
      const next = { ...exercise };
      if (value === null || value === undefined) {
        // Firestore rejects `undefined` field values, so drop the key entirely to "unset" it.
        delete next[field];
      } else {
        next[field] = Number(value);
      }
      return next;
    });
    await this.workoutTemplateService.reorderExercises(this.templateId, updated);
  }
}
