import { Component } from '@angular/core';
import { generateRandomData, trackByFn } from '@/lib/utils';
import { CommonModule } from '@angular/common';
import { LineChart } from '@/pages/dashboards/charts/linechart';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'stat-card-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, TagModule, SelectModule, LineChart],
    template: `@for (data of datasets; track trackByFn(); let idx = $index) {
        <div [ngClass]="data.className" class="min-w-80">
            <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                    <span class="label-medium text-surface-500">{{ data.cardData.title }}</span>
                    <div class="flex items-center gap-3.5 mt-2">
                        <span class="title-h7">{{ data.cardData.value }}</span>
                        <p-tag [severity]="data.cardData.positive ? 'success' : 'danger'" [value]="data.cardData.percent + '%'" />
                    </div>
                </div>
                <p-select [(ngModel)]="selectedRange[idx]" [options]="ranges" optionLabel="name" placeholder="Select a Month" class="w-24" />
            </div>
            <line-chart [datasets]="data.datasets" [bgColor]="bgColor(data)" [borderColor]="borderColor(data)" [option]="option(idx)" tooltipPrefix="$" class="!max-h-40" />
        </div>
    }`,
    host: {
        class: 'grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-[var(--surface-border)]'
    },
    styles: `
        :host ::ng-deep {
            .p-tag {
                padding: 0.25rem 0.5rem;

                .p-tag-label {
                    line-height: 1.5;
                    font-weight: 600;
                    font-size: 0.875rem !important;
                }
            }

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
export class StatCardWidget {
    ranges = [
        { name: 'Daily', unit: 'day' },
        { name: 'Weekly', unit: 'week' },
        { name: 'Monthly', unit: 'month' },
        { name: 'Yearly', unit: 'year' }
    ];

    selectedRange = [this.ranges[0], this.ranges[0], this.ranges[0]];

    datasets = [
        {
            className: 'pb-6 xl:pb-0 xl:pr-6',
            cardData: {
                title: 'Sales Revenue',
                value: '$7,460.47',
                percent: '64',
                positive: true
            },
            datasets: generateRandomData('2020-10-27T00:00:00', '2023-11-03T00:00:00', 4, 2000, 3000)
        },
        {
            className: 'py-6 xl:py-0 xl:px-6',
            cardData: {
                title: 'AVG. order value',
                value: '$2,460.34',
                percent: '12',
                positive: false
            },
            borderColor: 'rgb(190,18,60)',
            bgColor: ['rgba(190,18,60,0.1)', 'rgba(190,18,60,0)'],
            datasets: generateRandomData('2023-10-27T00:00:00', '2024-11-03T00:00:00', 4, 1500, 3200)
        },
        {
            className: 'pt-6 xl:pt-0 xl:pl-6',
            cardData: {
                title: 'Total Visitor ',
                value: '27.329',
                percent: '32',
                positive: true
            },
            borderColor: 'rgb(21,128,61)',
            currency: '',
            bgColor: ['rgba(21,128,61,0.1)', 'rgba(21,128,61,0)'],
            datasets: generateRandomData('2000-10-27T00:00:00', '2023-11-03T00:00:00', 4, 1400, 5000)
        }
    ];

    bgColor(data: any) {
        return data.bgColor || undefined;
    }

    borderColor(data: any) {
        return data.borderColor || undefined;
    }

    option(index: number) {
        return this.selectedRange[index]?.unit;
    }

    protected readonly trackByFn = trackByFn;
}
