import { Component } from '@angular/core';
import { generateRandomMultiData } from '@/lib/utils';
import { MultiLineChart } from '@/pages/dashboards/charts/multilinechart';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'sales-overview-widget',
    standalone: true,
    imports: [SelectModule, MultiLineChart, FormsModule],
    template: `<div class="flex items-start justify-between gap-2 mb-2">
            <div>
                <h3 class="label-medium">{{ dataset.cardData.title }}</h3>
                <span class="body-xsmall">{{ dataset.cardData.description }}</span>
            </div>
            <p-select [(ngModel)]="selectedRange" [options]="ranges" optionLabel="name" placeholder="Select a Month" styleClass="w-24" />
        </div>
        <div class="w-full flex-1 overflow-auto">
            <multi-line-chart [datasets]="dataset.datasets" [bgColors]="dataset.bgColors" [borderColors]="dataset.borderColors" [option]="selectedRange.unit" class="!max-h-80 h-full w-full cursor-pointer" />
        </div>`,
    host: {
        class: 'flex-1 xl:pr-6 pb-6 xl:pb-0 min-w-80 flex flex-col overflow-hidden'
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
export class SalesOverviewWidget {
    ranges = [
        { name: 'Weekly', unit: 'week' },
        { name: 'Monthly', unit: 'month' },
        { name: 'Quarter', unit: 'quarter' },
        { name: 'Yearly', unit: 'year' }
    ];

    selectedRange = this.ranges[0];

    dataset = {
        cardData: {
            title: 'Total Visitor ',
            description: 'Sales trends summary, performance analysis'
        },
        currency: '$',
        labels: ['Income', 'Expenses'],
        datasets: generateRandomMultiData('2020-10-27T00:00:00', '2023-11-03T00:00:00', 4, 2000, 3000, 2, true),
        bgColors: [undefined, ['rgba(165,243,252,0.4)', 'rgba(165,243,252,0)']],
        borderColors: [undefined, 'rgb(8,145,178)']
    };
}
