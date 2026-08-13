import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import JSON5 from 'json5';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { combineLatest, firstValueFrom, startWith, switchMap, take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ExerciseService } from '../../../core/services/exercise.service';
import { TranslationService } from '../../../core/services/translation.service';
import { Equipment, Exercise, MuscleGroup } from '../../../core/models';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { EQUIPMENT_LABELS, MUSCLE_GROUP_LABELS } from '../../../shared/constants/workout-labels.const';

const VALID_MUSCLE_GROUPS = new Set<string>(Object.keys(MUSCLE_GROUP_LABELS));
const VALID_EQUIPMENT = new Set<string>(Object.keys(EQUIPMENT_LABELS));

const BULK_IMPORT_EXAMPLE = `[
  { "name": "Bench Press", "muscleGroups": ["mid_chest", "front_delts", "triceps"], "equipment": "barbell" },
  { "name": "Squat", "muscleGroups": ["quads", "glutes"], "equipment": "barbell", "instructions": "Giữ lưng thẳng" }
]`;

function requireNonEmptyArray(control: AbstractControl): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
}

// Accepts strict JSON as well as the looser JS-object-literal shape people naturally paste
// from editors/ChatGPT (unquoted keys, single quotes, trailing commas, a `const x = ...;` wrapper).
function parseBulkInput(raw: string): unknown {
  const text = raw
    .trim()
    .replace(/^(export\s+)?(const|let|var)\s+\w+\s*(:\s*[^=]+)?=\s*/i, '')
    .replace(/;\s*$/, '');
  return JSON5.parse(text);
}

@Component({
  selector: 'app-exercise-library',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    TranslatePipe
  ],
  templateUrl: './exercise-library.html'
})
export class ExerciseLibrary {
  private readonly fb = inject(FormBuilder);
  private readonly exerciseService = inject(ExerciseService);
  private readonly authService = inject(AuthService);
  private readonly translationService = inject(TranslationService);

  readonly showDialog = signal(false);
  readonly submitError = signal('');
  readonly listError = signal('');
  readonly editingId = signal<string | null>(null);
  readonly muscleGroupLabels = MUSCLE_GROUP_LABELS;
  readonly equipmentLabels = EQUIPMENT_LABELS;

  readonly showBulkDialog = signal(false);
  readonly bulkError = signal('');
  readonly bulkSuccess = signal('');
  readonly bulkImporting = signal(false);
  readonly bulkImportExample = BULK_IMPORT_EXAMPLE;

  bulkText = this.fb.control('', Validators.required);

  search = this.fb.control('');
  muscleGroupFilter = this.fb.control<MuscleGroup | null>(null);

  exercises$ = combineLatest([this.search.valueChanges.pipe(startWith('')), this.muscleGroupFilter.valueChanges.pipe(startWith(null))]).pipe(
    switchMap(([term, muscleGroup]) => this.exerciseService.searchExercises(term ?? '', muscleGroup ?? undefined))
  );

  exerciseForm = this.fb.group({
    name: ['', Validators.required],
    muscleGroups: [['upper_chest'] as MuscleGroup[], requireNonEmptyArray],
    equipment: ['barbell' as Equipment, Validators.required],
    instructions: ['']
  });

  constructor() {
    this.exerciseService.ensureSeeded();
  }

  getMuscleGroupOptions(): { value: MuscleGroup; label: string }[] {
    return (Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[]).map((value) => ({
      value,
      label: this.translationService.t(MUSCLE_GROUP_LABELS[value])
    }));
  }

  getEquipmentOptions(): { value: Equipment; label: string }[] {
    return (Object.keys(EQUIPMENT_LABELS) as Equipment[]).map((value) => ({
      value,
      label: this.translationService.t(EQUIPMENT_LABELS[value])
    }));
  }

  getBulkMuscleGroupHint(): string {
    return (Object.keys(MUSCLE_GROUP_LABELS) as MuscleGroup[]).join(', ');
  }

  muscleGroupNames(muscleGroups: MuscleGroup[]): string {
    return muscleGroups.map((group) => this.translationService.t(this.muscleGroupLabels[group])).join(', ');
  }

  openAddDialog(): void {
    this.editingId.set(null);
    this.submitError.set('');
    this.exerciseForm.reset({ name: '', muscleGroups: ['upper_chest'], equipment: 'barbell', instructions: '' });
    this.showDialog.set(true);
  }

  openEditDialog(exercise: Exercise): void {
    this.editingId.set(exercise.id!);
    this.submitError.set('');
    this.exerciseForm.reset({
      name: exercise.name,
      muscleGroups: exercise.muscleGroups,
      equipment: exercise.equipment,
      instructions: exercise.instructions ?? ''
    });
    this.showDialog.set(true);
  }

  async submit(): Promise<void> {
    if (this.exerciseForm.invalid) {
      return;
    }
    this.submitError.set('');
    const value = this.exerciseForm.getRawValue();

    try {
      const editingId = this.editingId();
      // Firestore rejects `undefined` field values, so omit `instructions` entirely when blank instead of setting it to undefined.
      const instructions = value.instructions ? { instructions: value.instructions } : {};
      if (editingId) {
        await this.exerciseService.updateExercise(editingId, {
          name: value.name!,
          muscleGroups: value.muscleGroups!,
          equipment: value.equipment!,
          ...instructions
        });
      } else {
        const currentUser = await firstValueFrom(this.authService.currentUser$.pipe(take(1)));
        await this.exerciseService.addExercise({
          name: value.name!,
          muscleGroups: value.muscleGroups!,
          equipment: value.equipment!,
          createdBy: currentUser?.uid ?? '',
          ...instructions
        });
      }
      this.showDialog.set(false);
    } catch {
      this.submitError.set(this.translationService.t('workout.exercises.saveError'));
    }
  }

  async remove(id: string): Promise<void> {
    this.listError.set('');
    try {
      await this.exerciseService.deleteExercise(id);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      this.listError.set(
        code === 'permission-denied'
          ? this.translationService.t('workout.exercises.deleteErrorPermission')
          : this.translationService.t('workout.exercises.deleteErrorGeneric')
      );
    }
  }

  openBulkDialog(): void {
    this.bulkText.reset('');
    this.bulkError.set('');
    this.bulkSuccess.set('');
    this.showBulkDialog.set(true);
  }

  async submitBulk(): Promise<void> {
    this.bulkError.set('');
    this.bulkSuccess.set('');

    let parsed: unknown;
    try {
      parsed = parseBulkInput(this.bulkText.value ?? '');
    } catch {
      this.bulkError.set(this.translationService.t('workout.exercises.bulkParseError'));
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      this.bulkError.set(this.translationService.t('workout.exercises.bulkEmptyArrayError'));
      return;
    }

    const currentUser = await firstValueFrom(this.authService.currentUser$.pipe(take(1)));
    const entryLabel = (index: number) => `${this.translationService.t('workout.exercises.entryPrefix')} ${index + 1}`;

    const exercises: Exercise[] = [];
    for (const [index, entry] of parsed.entries()) {
      if (typeof entry !== 'object' || entry === null) {
        this.bulkError.set(`${entryLabel(index)} ${this.translationService.t('workout.exercises.entryInvalidSuffix')}`);
        return;
      }
      const item = entry as Record<string, unknown>;
      if (typeof item['name'] !== 'string' || !item['name']) {
        this.bulkError.set(`${entryLabel(index)} ${this.translationService.t('workout.exercises.entryMissingNameSuffix')}`);
        return;
      }
      const muscleGroups = item['muscleGroups'];
      if (!Array.isArray(muscleGroups) || muscleGroups.length === 0) {
        this.bulkError.set(`${entryLabel(index)} ("${item['name']}") ${this.translationService.t('workout.exercises.entryMissingMuscleGroupsSuffix')}`);
        return;
      }
      const invalidGroup = muscleGroups.find((group) => !VALID_MUSCLE_GROUPS.has(group));
      if (invalidGroup !== undefined) {
        this.bulkError.set(`${entryLabel(index)} ("${item['name']}") ${this.translationService.t('workout.exercises.entryInvalidMuscleGroupSuffix')} "${invalidGroup}".`);
        return;
      }
      const equipment = typeof item['equipment'] === 'string' && VALID_EQUIPMENT.has(item['equipment']) ? (item['equipment'] as Equipment) : 'other';
      const instructions = typeof item['instructions'] === 'string' && item['instructions'] ? { instructions: item['instructions'] } : {};

      exercises.push({
        name: item['name'],
        muscleGroups: muscleGroups as MuscleGroup[],
        equipment,
        createdBy: currentUser?.uid ?? '',
        ...instructions
      });
    }

    this.bulkImporting.set(true);
    try {
      const count = await this.exerciseService.bulkAddExercises(exercises);
      this.bulkSuccess.set(
        `${this.translationService.t('workout.exercises.bulkSuccessPrefix')}${count}${this.translationService.t('workout.exercises.bulkSuccessSuffix')}`
      );
      this.bulkText.reset('');
    } catch {
      this.bulkError.set(this.translationService.t('workout.exercises.bulkSaveError'));
    } finally {
      this.bulkImporting.set(false);
    }
  }
}
