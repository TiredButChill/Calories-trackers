import { Component } from '@angular/core';
import { generateRandomData, trackByFn } from '@/lib/utils';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { MeterChart } from '@/pages/dashboards/charts/meterchart';

@Component({
    selector: 'mini-stat-card-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectModule, MeterChart],
    template: `@for (data of datasets; track trackByFn(); let idx = $index) {
        <div class="card h-72 z-0 flex-1 !mb-0 !p-0 min-w-80 flex flex-col border border-surface rounded-2xl">
            <div class="flex-1 flex flex-col p-6">
                <div class="flex items-start justify-between gap-2 mb-6">
                    <div>
                        <span class="label-medium text-surface-500">{{ data.cardData.title }}</span>
                        <div class="flex items-center gap-3.5 mt-2">
                            <span class="title-h7">{{ data.cardData.value }}</span>
                        </div>
                    </div>
                    <p-select [(ngModel)]="selectedRange[idx]" [options]="ranges" optionLabel="name" placeholder="Select a Month" styleClass="w-24" />
                </div>
                <meter-chart [show]="data.show" [currency]="data.currency" [meterOptionsProps]="meterOptionsProps(data, idx)" />
            </div>
            <p class="p-4 border-t border-surface-200 dark:border-surface-800 body-xsmall text-left">
                <span class="label-xsmall  text-green-600">{{ data.percentage }}</span>
                total orders compared last month
            </p>
        </div>
    }`,
    host: {
        class: 'flex w-full flex-wrap gap-7'
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
export class MiniStatCardWidget {
    protected readonly trackByFn = trackByFn;

    ranges = [
        { name: 'Hourly', unit: 'hour' },
        { name: 'Daily', unit: 'day' },
        { name: 'Weekly', unit: 'week' },
        { name: 'Monthly', unit: 'month' },
        { name: 'Yearly', unit: 'year' }
    ];

    selectedRange = [this.ranges[0], this.ranges[0], this.ranges[0]];

    datasets = [
        {
            cardData: {
                title: 'Sales Rate ',
                value: '$256,137.48'
            },
            currency: '$',
            meterOptionsProps: {
                max: null,
                bgColors: null,
                labels: null,
                showX: false,
                showY: false,
                yAxis: null,
                xAxisPosition: 'bottom',
                timeUnit: 'week',
                data: generateRandomData('2020-10-27T00:00:00', '2023-11-03T00:00:00', 4, 400, 800)
            },
            percentage: '+24%',
            show: 6
        },
        {
            cardData: {
                title: 'New Customer ',
                value: '17.435'
            },
            currency: '',
            meterOptionsProps: {
                max: null,
                bgColors: ['#A855F7'],
                labels: null,
                showX: false,
                showY: false,
                yAxis: null,
                xAxisPosition: 'bottom',
                timeUnit: 'week',
                data: generateRandomData('2020-10-27T00:00:00', '2023-11-03T00:00:00', 4, 500, 700)
            },
            percentage: '+12%',
            show: 6
        },
        {
            cardData: {
                title: 'AVG. Monthly Order ',
                value: '32.048'
            },
            currency: '',
            meterOptionsProps: {
                max: null,
                bgColors: ['#3B82F6'],
                labels: null,
                showX: false,
                showY: false,
                yAxis: null,
                xAxisPosition: 'bottom',
                timeUnit: 'week',
                data: generateRandomData('2000-10-27T00:00:00', '2023-11-03T00:00:00', 4, 100, 500)
            },
            percentage: '+40%',
            show: 6
        }
    ];

    meterOptionsProps(data: any, index: number) {
        return {
            ...data.meterOptionsProps,
            timeUnit: this.selectedRange[index].unit
        };
    }
}
