import { Component, computed, inject, signal } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { generateRandomMultiData, trackByFn } from '@/lib/utils';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MeterChart } from '@/pages/dashboards/charts/meterchart';

@Component({
    selector: 'social-media-users-widget',
    standalone: true,
    imports: [CommonModule, TagModule, DividerModule, ButtonModule, MeterChart],
    template: `<div class="flex items-center justify-between">
            <span class="label-medium text-surface-950 dark:text-surface-0">Social media users</span>
            <button pButton severity="secondary" outlined class="!text-surface-950 dark:!text-surface-0 !px-2 !py-1.5 !rounded-lg !label-xsmall"><span pButtonLabel>See All</span><i class="pi pi-chevron-right !text-xs"></i></button>
        </div>
        <div class="flex items-center gap-3.5 mt-4">
            <span class="title-h6">72.742,74 </span>
            <p-tag severity="success" value="12%" />
        </div>
        <meter-chart currency="" class="h-48 mt-8" [meterOptionsProps]="meterOptionsProps" (computedData)="handleComputedValue($event)" />
        <div class="mt-6 flex flex-col">
            @for (item of dataLabels; track trackByFn(); let idx = $index) {
                <div class="flex items-center gap-3.5">
                    <img class="w-4 h-4 object-cover" [src]="isDarkTheme() && item?.darkLogo ? item.darkLogo : item.logo" />
                    <span class="flex-1 body-small text-left text-surface-950 dark:text-surface-0">{{ item.title }}</span>
                    <span class="label-small text-surface-950 dark:text-surface-0">{{ _computedData()?.[idx].toFixed(0) }}</span>
                </div>
                <p-divider *ngIf="dataLabels.length - 1 > idx" class="my-3" />
            }
        </div>`,
    host: {
        class: 'card !mb-0 flex-1 min-w-80 !p-6 border border-surface rounded-2xl'
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
        }
    `
})
export class SocialMediaUsersWidget {
    protected readonly trackByFn = trackByFn;

    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    randomData: any = generateRandomMultiData('2020-10-27T00:00:00', '2023-11-03T00:00:00', 4, 50, 700, 4);

    _computedData = signal<any>(undefined);

    bgColors = ['var(--p-primary-color)'];

    dataLabels: any = [
        { title: 'Facebook', logo: '/demo/images/dashboard/logo-facebook.svg' },
        { title: 'Instagram', logo: '/demo/images/dashboard/logo-instagram.svg' },
        { title: 'X.com', logo: '/demo/images/dashboard/logo-x.svg', darkLogo: '/demo/images/dashboard/logo-x-dark.svg' },
        { title: 'Reddit', logo: '/demo/images/dashboard/logo-reddit.svg' }
    ];

    meterOptionsProps = {
        data: this.randomData,
        timeUnit: 'day',
        showY: false,
        showX: true,
        bgColors: this.bgColors,
        xAxisPosition: 'top'
    };

    handleComputedValue(value: any) {
        const result = new Array(value[0].y.length).fill(0);

        value.forEach((item: any) => {
            item?.y.forEach((val: any, index: number) => {
                result[index] += val;
            });
        });
        this._computedData.set(result);
    }
}
