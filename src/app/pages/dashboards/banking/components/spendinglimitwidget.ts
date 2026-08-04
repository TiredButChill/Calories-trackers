import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CustomMeter } from '@/pages/dashboards/charts/custommeter';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'spending-limit-widget',
    standalone: true,
    imports: [FormsModule, SelectModule, CustomMeter, DividerModule, ButtonModule],
    template: `<div class="p-6">
            <div class="mb-6 flex items-center justify-between gap-6">
                <div class="label-medium">Spending Limit</div>
                <p-select [(ngModel)]="selectedMonth1" [options]="months" optionLabel="name" placeholder="Select a Month" class="w-24" />
            </div>
            <custom-meter title="Monthly spending limit" [value]="meterValue1" />
        </div>
        <p-divider class="!m-0" />
        <div class="p-6">
            <div class="mb-6 flex items-center justify-between gap-6">
                <div class="label-medium">Expenditure</div>
                <p-select [(ngModel)]="selectedMonth2" [options]="months" optionLabel="name" placeholder="Select a Month" class="w-24" />
            </div>
            <custom-meter [value]="meterValue2" />
            <p-button styleClass="w-full mt-6 !text-surface-950 dark:!text-surface-0 !rounded-lg" label="View account detail" outlined severity="secondary" />
        </div>`,
    host: {
        class: 'card w-full xl:w-[25rem] !mb-0 !p-0 rounded-3xl border border-surface shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]'
    },
    styles: `
        :host ::ng-deep {
            .p-select {
                padding-right: 0.375rem;
                border-radius: 0.5rem;

                .p-select-label {
                    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    color: var(--text-surface-950);
                }

                .p-select-dropdown {
                    width: 0.75rem;

                    .p-select-dropdown-icon {
                        width: 0.75rem;
                        color: var(--text-surface-950);
                    }
                }

                .p-select-option {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
            }

            html.app-dark {
                .p-select {
                    .p-select-label {
                        color: var(--text-surface-0);
                    }

                    .p-select-dropdown-icon {
                        color: var(--text-surface-0);
                    }
                }
            }
        }
    `
})
export class SpendingLimitWidget {
    selectedMonth1 = { name: 'January', code: 'Jan' };

    selectedMonth2 = { name: 'January', code: 'Jan' };

    months = [
        { name: 'January', code: 'Jan' },
        { name: 'February', code: 'Feb' },
        { name: 'March', code: 'Mar' },
        { name: 'April', code: 'Apr' },
        { name: 'May', code: 'May' },
        { name: 'June', code: 'Jun' },
        { name: 'July', code: 'Jul' },
        { name: 'August', code: 'Aug' },
        { name: 'September', code: 'Sep' },
        { name: 'October', code: 'Oct' },
        { name: 'November', code: 'Nov' },
        { name: 'December', code: 'Dec' }
    ];

    meterValue1 = [
        { label: 'Spent', title: '$7.243', colorClass: 'bg-surface-950 dark:bg-surface-0', value: 7243 },
        { label: 'Remaining', title: '$2.757', colorClass: 'bg-surface-200 dark:bg-surface-800', value: 2757 }
    ];

    meterValue2 = [
        { label: 'Food', title: '$3.243', colorClass: 'bg-violet-400', value: 3243 },
        { label: 'Clothing', title: '$2.111', colorClass: 'bg-yellow-400', value: 2111 },
        { label: 'Other', title: '$2.485', colorClass: 'bg-sky-400', value: 2485 }
    ];
}
