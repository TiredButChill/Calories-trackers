import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { GaugeChart } from '@/pages/dashboards/charts/gaugechart';

@Component({
    selector: 'credit-score-widget',
    standalone: true,
    imports: [DividerModule, ButtonModule, GaugeChart],
    template: ` <div class="card xl:w-auto w-full !mb-0 min-w-80 !px-6 !pb-6 !pt-4 rounded-3xl border border-surface">
        <div class="mb-2 flex items-start gap-2">
            <span class="flex-1 label-medium">Credit Score</span>
            <button><i class="pi pi-ellipsis-h text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all"></i></button>
        </div>
        <gauge-chart [data]="data" [labels]="labels" />
        <div class="mt-8 rounded-lg border border-surface">
            <div class="border-b border-surface flex items-center justify-between px-3.5 py-2">
                <span class="label-small text-surface-950 dark:text-surface-0">Pre-approved loan</span>
                <button><i class="pi pi-ellipsis-h text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all"></i></button>
            </div>
            <div class="p-3.5 flex flex-col gap-3">
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Loan Amount</span>
                    <span class="label-xsmall text-surface-950 dark:text-surface-0">$40.000</span>
                </div>
                <p-divider class="!m-0" />
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Interest Rate</span>
                    <span class="px-2 py-1 rounded-lg text-green-700 bg-green-100 text-sm font-semibold">1.2%</span>
                </div>
                <p-divider class="!m-0" />
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Number of installments</span>
                    <span class="label-xsmall text-surface-950 dark:text-surface-0">24</span>
                </div>
                <p-divider class="!m-0" />
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Amount to be repaid</span>
                    <span class="label-xsmall text-surface-950 dark:text-surface-0">$44.000</span>
                </div>
            </div>
        </div>
        <p-button styleClass="mt-6 w-full !text-surface-950 dark:!text-surface-0 !rounded-lg" label="View account detail" outlined severity="secondary" />
    </div>`
})
export class CreditScoreWidget {
    data = [850, 200];

    labels = ['Credit Score', 'Gray Area'];
}
