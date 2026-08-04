import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'order-history-widget',
    standalone: true,
    imports: [IconFieldModule, InputTextModule, InputIconModule, ButtonModule, FormsModule, AvatarModule, TableModule, TagModule],
    template: `<div class="flex lg:flex-row flex-col lg:items-center justify-between mb-4 w-full gap-6">
            <div class="flex-1">
                <div class="label-medium">Order History</div>
                <span class="mt-1 body-xsmall">This field displays the order history</span>
            </div>
            <div class="flex flex-wrap items-center gap-3.5">
                <p-icon-field>
                    <p-inputicon class="pi pi-search" />
                    <input pInputText class="!rounded-lg !py-1.5 !w-56" [(ngModel)]="tableSearch" placeholder="Search" />
                </p-icon-field>
                <p-button label="Filter" icon="pi pi-filter" severity="secondary" outlined styleClass="!text-surface-950 dark:!text-surface-0 !py-1.5 !rounded-lg" />
                <p-button label="Export" icon="pi pi-download" severity="contrast" styleClass="!text-surface-0 dark:!text-surface-950 !py-1.5 !rounded-lg" />
            </div>
        </div>
        <div class="w-full overflow-hidden">
            <p-table
                [value]="history"
                [rows]="7"
                [paginator]="true"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Showing page {currentPage} of {totalPages} pages"
                [(selection)]="selectedHistory"
                dataKey="id"
                [tableStyle]="{ 'min-width': '90rem' }"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Template Name</th>
                        <th>Email Address</th>
                        <th>Process</th>
                        <th>Revenue</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template #body let-data>
                    <tr [pSelectableRow]="data">
                        <td>
                            <p-tableCheckbox [value]="data" />
                        </td>
                        <td>
                            <div class="body-xsmall text-left">
                                {{ data.id }}
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left">
                                {{ data.date }}
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center">
                                <p-avatar
                                    [label]="data.name.capName"
                                    styleClass="mr-2 !w-8 !h-8 !text-xs font-medium"
                                    [style]="{ backgroundColor: 'var(--p-' + data.name.bgColor + '-100)', color: 'var(--p-' + data.name.bgColor + '-950)' }"
                                    shape="circle"
                                />
                                <div class="label-xsmall text-surface-950 dark:text-surface-0">{{ data.name.value }}</div>
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left">
                                {{ data.templateName }}
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left" :style="{ color: data.amount.startsWith('+') ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                                {{ data.emailAddress }}
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall capitalize text-left text-surface-950 dark:text-surface-0">
                                <p-tag [severity]="data.process === 'paid' ? 'success' : 'warn'" [value]="data.process" styleClass="!px-2 !py-1 !rounded-lg" />
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left text-surface-950 dark:text-surface-0">
                                {{ data.revenue ?? '-' }}
                            </div>
                        </td>
                        <td>
                            <div class="flex items-end justify-end">
                                <button class="text-right text-surface-700 dark:text-surface-300">
                                    <i class="pi pi-ellipsis-h"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>`,
    host: {
        class: 'w-full overflow-auto'
    },
    styles: `
        :host ::ng-deep {
            .p-datatable {
                .p-datatable-thead > tr th {
                    background: transparent;
                }

                .p-datatable-tbody > tr {
                    background: transparent;
                }

                .p-datatable-tbody > tr.p-datatable-row-selected > td,
                .p-datatable-tbody > tr:has(+ .p-datatable-row-selected) > td {
                    border-bottom-color: var(--p-datatable-body-cell-border-color);
                }

                .p-paginator {
                    background: transparent;
                }
            }
        }
    `
})
export class OrderHistoryWidget {
    tableSearch = '';

    history = [
        {
            id: '#1260',
            date: 'May 5th, 2024',
            name: {
                value: 'Jerome Bell',
                bgColor: 'lime',
                capName: 'JB'
            },
            templateName: 'Apollo',
            emailAddress: 'jeromebell@gmail.com',
            process: 'paid',
            revenue: '$59'
        },
        {
            id: '#1259',
            date: 'Mar 17th, 2024',
            name: {
                value: 'Annette Black',
                bgColor: 'indigo',
                capName: 'AB'
            },
            templateName: 'Verona',
            emailAddress: 'hi@annetteblack.com',
            process: 'paid',
            revenue: '$59'
        },
        {
            id: '#1258',
            date: 'May 24th, 2024',
            name: {
                value: 'Onyama Limba',
                bgColor: 'rose',
                capName: 'OL'
            },
            templateName: 'Freya',
            emailAddress: 'hi@onyamalimba.co',
            process: 'paid',
            revenue: '$59'
        },
        {
            id: '#1257',
            date: 'Jun 28th, 2024',
            name: {
                value: 'Courtney Henry',
                bgColor: 'violet',
                capName: 'CH'
            },
            templateName: 'Sakai',
            emailAddress: 'hi@courtneyhenry.com',
            process: 'free',
            revenue: null
        },
        {
            id: '#1256',
            date: 'Jul 21th, 2024',
            name: {
                value: 'Dianne Russell',
                bgColor: 'cyan',
                capName: 'DR'
            },
            templateName: 'Ultima',
            emailAddress: 'hi@diannerussell.com',
            process: 'paid',
            revenue: '$59'
        },
        {
            id: '#1255',
            date: 'Jul 21th, 2024',
            name: {
                value: 'Amy Elsner',
                bgColor: 'yellow',
                capName: 'AE'
            },
            templateName: 'Sakai',
            emailAddress: 'hi@amyelsner.com',
            process: 'free',
            revenue: null
        },
        {
            id: '#1254',
            date: 'Jun 28th, 2024',
            name: {
                value: 'Arlene McCoy',
                bgColor: 'blue',
                capName: 'AM'
            },
            templateName: 'Altantis',
            emailAddress: 'hi@arlenemccoy.com',
            process: 'paid',
            revenue: '$59'
        },
        {
            id: '#1298',
            date: 'Jul 21th, 2024',
            name: {
                value: 'Amy Elsner',
                bgColor: 'yellow',
                capName: 'AE'
            },
            templateName: 'Sakai',
            emailAddress: 'hi@amyelsner.com',
            process: 'free',
            revenue: null
        },
        {
            id: '#1299',
            date: 'Jun 28th, 2024',
            name: {
                value: 'Arlene McCoy',
                bgColor: 'blue',
                capName: 'AM'
            },
            templateName: 'Altantis',
            emailAddress: 'hi@arlenemccoy.com',
            process: 'paid',
            revenue: '$59'
        }
    ];

    selectedHistory: any;
}
