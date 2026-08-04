import { Component } from '@angular/core';
import { generateRandomMultiData } from '@/lib/utils';
import { MultiLineChart } from '@/pages/dashboards/charts/multilinechart';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'income-expenditure-widget',
    standalone: true,
    imports: [FormsModule, MultiLineChart, SelectButtonModule],
    template: ` <div class="flex flex-col md:flex-row gap-4 md:gap-0 items-start justify-between mb-4">
            <div class="label-medium">Income and Expenditure</div>
            <p-select-button [(ngModel)]="select" [options]="options" optionLabel="name" ariaLabelledBy="basic" [allowEmpty]="false" />
        </div>
        <div class="flex-1 w-full overflow-auto">
            <multi-line-chart [datasets]="randomData" [labels]="labels" [bgColors]="bgColors" [borderColors]="borderColors" [option]="select.value" />
        </div>`,
    host: {
        class: 'card w-full xl:w-auto xl:flex-1 !mb-0 !px-7 !pb-7 !pt-6 border rounded-3xl border-surface flex flex-col justify-between overflow-hidden'
    }
})
export class IncomeExpenditureWidget {
    randomData = generateRandomMultiData('2020-10-27T00:00:00', '2023-11-03T00:00:00', 4, 2000, 3000, 2, true);

    select = { name: 'Weekly', value: 'week' };

    labels = ['Income', 'Expenditure'];

    bgColors = [undefined, ['rgba(165,243,252,0.4)', 'rgba(165,243,252,0)']];

    borderColors = [undefined, 'rgb(8,145,178)'];

    options = [
        { name: 'Weekly', value: 'week' },
        { name: 'Monthly', value: 'month' },
        { name: 'Yearly', value: 'year' }
    ];
}
