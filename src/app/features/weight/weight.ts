import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { WeightService } from '../../core/services/weight.service';
import { toDateKey } from '../../shared/utils/date.util';

@Component({
  selector: 'app-weight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, DialogModule, InputNumberModule, InputTextModule],
  templateUrl: './weight.html'
})
export class Weight {
  private readonly fb = inject(FormBuilder);
  private readonly weightService = inject(WeightService);

  readonly showDialog = signal(false);
  entries$ = this.weightService.getEntries();

  entryForm = this.fb.group({
    date: [toDateKey(), Validators.required],
    kg: [0, Validators.required]
  });

  async submit(): Promise<void> {
    if (this.entryForm.invalid) {
      return;
    }
    const value = this.entryForm.getRawValue();
    await this.weightService.addEntry({ date: value.date!, kg: Number(value.kg) });
    this.entryForm.patchValue({ kg: 0, date: toDateKey() });
    this.showDialog.set(false);
  }

  async remove(id: string): Promise<void> {
    await this.weightService.deleteEntry(id);
  }
}
