import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pricing-compare-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <section class="landing-container mx-auto py-10 lg:py-20">
            <div class="max-w-lg md:max-w-4xl xl:max-w-full mx-auto p-7 border border-surface-200 dark:border-surface-800 rounded-3xl">
                <div
                    class="sticky top-24 text-surface-950 dark:text-surface-0 label-medium leading-normal hidden md:flex rounded-xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]"
                >
                    <span class="flex-[1.15] px-6 py-3 text-left">Plan</span>
                    <div class="flex flex-[3]">
                        <span *ngFor="let data of plans; let index = index" class="flex-1 px-6 py-3 text-center capitalize">
                            {{ data }}
                        </span>
                    </div>
                </div>

                <div class="md:mt-7">
                    <div *ngFor="let data of planDetails; let index = index">
                        <div class="flex md:flex-row flex-col">
                            <div
                                class="md:!bg-transparent bg-surface-100 dark:bg-surface-900 border md:border-0 rounded-xl border-surface-200 dark:border-surface-800 flex-[1.15] px-6 py-4 text-left body-medium leading-normal text-surface-950 dark:text-surface-0"
                            >
                                {{ data.plan }}
                            </div>

                            <div class="flex md:flex-[3]">
                                <div *ngFor="let ingredient of data.ingredients; let j = index" class="flex-1 md:px-6 md:py-4 text-surface-950 dark:text-surface-0 text-center">
                                    <span class="md:hidden block flex-1 py-4 text-center capitalize body-medium leading-normal text-surface-950 dark:text-surface-0">
                                        {{ plans[j] }}
                                    </span>
                                    <div class="w-full h-[1px] bg-surface-200 dark:bg-surface-800 md:hidden block"></div>
                                    <div class="py-4 md:py-0">
                                        <i *ngIf="ingredient.includes('_yes')" class="pi pi-check text-center !text-sm text-surface-950 font-bold dark:text-surface-0"></i>
                                        <i *ngIf="ingredient.includes('_no')" class="pi pi-minus text-center !text-sm text-surface-500"></i>
                                        <span *ngIf="!ingredient.includes('_yes') && !ingredient.includes('_no')" class="text-surface-950 dark:text-surface-0 body-medium leading-normal">
                                            {{ ingredient }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div *ngIf="index !== planDetails.length - 1" class="w-full md:block hidden h-[1px] bg-surface-200 dark:bg-surface-800"></div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class PricingCompareWidget {
    plans = ['Basic', 'Pro', 'Premium'];

    planDetails = [
        { plan: '3 Active Members', ingredients: ['$24', '$64', '$130'] },
        { plan: 'Up to 10 Components', ingredients: ['10', 'Unlimited', 'Unlimited'] },
        { plan: 'High Request Limits', ingredients: ['10', '20', 'Unlimited'] },
        { plan: 'Unlimited Access', ingredients: ['_yes', '_yes', '_yes'] },
        { plan: 'Advanced Analytics', ingredients: ['_yes', '_yes', '_yes'] },
        { plan: 'Data Export', ingredients: ['_no', '_yes', '_yes'] },
        { plan: 'Prioritized Support', ingredients: ['_no', '_yes', '_yes'] },
        { plan: 'Real-time Updates', ingredients: ['_no', '_no', '_yes'] },
        { plan: 'Batch Requests', ingredients: ['_no', '_no', '_yes'] },
        { plan: 'Webhooks', ingredients: ['_no', '_no', '_yes'] }
    ];
}
