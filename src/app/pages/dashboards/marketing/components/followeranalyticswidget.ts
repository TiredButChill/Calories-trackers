import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CustomMeter } from '@/pages/dashboards/charts/custommeter';

@Component({
    selector: 'follower-analytics-widget',
    standalone: true,
    imports: [FormsModule, SelectModule, ButtonModule, TagModule, CustomMeter],
    template: `<div class="flex flex-col gap-8">
            <div class="flex items-start gap-2">
                <div class="flex-1 flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg border border-surface flex items-center justify-center">
                        <svg width="31" height="33" viewBox="0 0 31 33" fill="none" xmlns="http://www.w3.org/2000/svg" class="block mx-auto">
                            <path d="M15.1934 0V0V0L0.0391235 5.38288L2.35052 25.3417L15.1934 32.427V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1934 0Z" fill="var(--p-red-500)" />
                            <mask id="mask0_1_52" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="31" height="33">
                                <path d="M15.1934 0V0V0L0.0391235 5.38288L2.35052 25.3417L15.1934 32.427V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1934 0Z" fill="var(--surface-ground)" />
                            </mask>
                            <g mask="url(#mask0_1_52)">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1935 0V3.5994V3.58318V20.0075V20.0075V32.427V32.427L28.0364 25.3417L30.3478 5.38288L15.1935 0Z" fill="var(--p-red-500)" />
                            </g>
                            <path d="M19.6399 15.3776L18.1861 15.0547L19.3169 16.6695V21.6755L23.1938 18.4458V12.9554L21.4169 13.6013L19.6399 15.3776Z" fill="var(--surface-ground)" />
                            <path d="M10.5936 15.3776L12.0474 15.0547L10.9166 16.6695V21.6755L7.03966 18.4458V12.9554L8.81661 13.6013L10.5936 15.3776Z" fill="var(--surface-ground)" />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M11.3853 16.9726L12.6739 15.0309L13.4793 15.5163H16.7008L17.5061 15.0309L18.7947 16.9726V24.254L17.8283 25.7103L16.7008 26.843H13.4793L12.3518 25.7103L11.3853 24.254V16.9726Z"
                                fill="var(--surface-ground)"
                            />
                            <path d="M19.3168 24.7437L21.4168 22.6444V20.5451L19.3168 22.3214V24.7437Z" fill="var(--surface-ground)" />
                            <path d="M10.9166 24.7437L8.81662 22.6444V20.5451L10.9166 22.3214V24.7437Z" fill="var(--surface-ground)" />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M13.0167 5.68861L11.7244 8.7568L13.8244 14.8932H14.7936V5.68861H13.0167ZM15.4397 5.68861V14.8932H16.5706L18.5091 8.7568L17.2167 5.68861H15.4397Z"
                                fill="var(--surface-ground)"
                            />
                            <path d="M13.8244 14.8932L6.87813 12.3094L5.90888 8.27235L11.8859 8.7568L13.9859 14.8932H13.8244Z" fill="var(--surface-ground)" />
                            <path d="M16.5706 14.8932L23.5169 12.3094L24.4861 8.27235L18.3476 8.7568L16.4091 14.8932H16.5706Z" fill="var(--surface-ground)" />
                            <path d="M18.8321 8.27235L22.2245 7.94938L19.9629 5.68861H17.7013L18.8321 8.27235Z" fill="var(--surface-ground)" />
                            <path d="M11.4013 8.27235L8.00893 7.94938L10.2705 5.68861H12.5321L11.4013 8.27235Z" fill="var(--surface-ground)" />
                        </svg>
                    </div>
                    <div>
                        <div class="label-medium">PrimeNG</div>
                        <span class="body-xsmall">UI Library</span>
                    </div>
                </div>
                <p-select [(ngModel)]="selectedRange" [options]="ranges" optionLabel="name" placeholder="Select a Month" styleClass="w-24" />
            </div>
            <div>
                <div class="flex items-center gap-3.5">
                    <span class="title-h6">273.167</span>
                    <p-tag severity="success" value="12%" />
                </div>
                <span class="body-xsmall mt-1">Compared to last week</span>
            </div>
            <custom-meter title="Follower analytics" [value]="meterValue" />
        </div>
        <p-button styleClass="mt-6 w-full !text-surface-950 dark:!text-surface-0 !rounded-lg" label="See all analytics " outlined severity="secondary" />`,
    host: {
        class: 'xl:w-auto w-full xl:pl-6 pt-6 xl:pt-0 min-w-80 flex flex-col justify-between gap-10'
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
export class FollowerAnalyticsWidget {
    ranges = [
        { name: 'Weekly', code: 'wk' },
        { name: 'Monthly', code: 'mn' },
        { name: 'Yearly', code: 'yr' }
    ];

    selectedRange = { name: 'Weekly', code: 'wk' };

    meterValue = [
        { label: 'Followers', title: '17.243', colorClass: 'bg-surface-950 dark:bg-surface-0', value: 17243 },
        { label: 'Unfollow-up', title: '2.757', colorClass: 'bg-surface-200 dark:bg-surface-800', value: 2757 }
    ];
}
