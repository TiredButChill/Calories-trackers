import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'transactions-history-widget',
    standalone: true,
    imports: [CommonModule, ButtonModule, TableModule, AvatarModule],
    template: `<div class="flex items-center gap-2">
            <div class="flex-1 flex flex-col gap-1">
                <span class="label-medium">Transactions History</span>
                <span class="body-xsmall text-left">Track money coming in and going out from this area.</span>
            </div>
            <p-button label="See All" severity="secondary" outlined styleClass="!text-surface-950 dark:!text-surface-0 !px-3 !py-1 !rounded-lg" />
        </div>
        <div class="w-full overflow-auto flex-1 mt-5">
            <p-table
                [value]="transactions"
                [rows]="7"
                [paginator]="true"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Showing page {currentPage} of {totalPages} pages"
                [(selection)]="selectedTransactions"
                dataKey="id"
                [tableStyle]="{ 'min-width': '50rem' }"
            >
                <ng-template #header>
                    <tr>
                        <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Account</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template #body let-data>
                    <tr [pSelectableRow]="data">
                        <td>
                            <p-tableCheckbox [value]="data" />
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
                                {{ data.date }}
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left" :style="{ color: data.amount.startsWith('+') ? 'var(--p-green-500)' : 'var(--p-red-500)' }">
                                {{ data.amount }}
                            </div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left">
                                {{ data.account }}
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
        class: 'card xl:w-auto w-full xl:flex-1 !mb-0 flex-1 !px-7 !pb-7 !pt-6 border rounded-3xl border-surface flex flex-col justify-between overflow-hidden'
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
export class TransactionsHistoryWidget {
    selectedTransactions = null;

    transactions = [
        {
            id: '1',
            name: {
                value: 'Jerome Bell',
                bgColor: 'lime',
                capName: 'JB'
            },
            date: 'May 5th, 2024',
            amount: '+£12.875,98',
            account: '**** **** 8288'
        },
        {
            id: '2',
            name: {
                value: 'Annette Black',
                bgColor: 'indigo',
                capName: 'AB'
            },
            date: 'Mar 17th, 2024',
            amount: '+€7.245,44',
            account: '**** **** 9284'
        },
        {
            id: '3',
            name: {
                value: 'Onyama Limba',
                bgColor: 'rose',
                capName: 'OL'
            },
            date: 'May 24th, 2024',
            amount: '-₺76.276,90',
            account: '**** **** 2534'
        },
        {
            id: '4',
            name: {
                value: 'Courtney Henry',
                bgColor: 'violet',
                capName: 'CH'
            },
            date: 'Jun 28th, 2024',
            amount: '-£2.875,98',
            account: '**** **** 8288'
        },
        {
            id: '5',
            name: {
                value: 'Dianne Russell',
                bgColor: 'cyan',
                capName: 'DR'
            },
            date: 'Jul 21th, 2024',
            amount: '+$12.423,04',
            account: '**** **** 8234'
        },
        {
            id: '6',
            name: {
                value: 'Amy Elsner',
                bgColor: 'yellow',
                capName: 'AE'
            },
            date: 'Jul 21th, 2024',
            amount: '+€17.876,24',
            account: '**** **** 9284'
        },
        {
            id: '7',
            name: {
                value: 'Arlene McCoy',
                bgColor: 'blue',
                capName: 'AM'
            },
            date: 'Jun 28th, 2024',
            amount: '-$12.423,04',
            account: '**** **** 8234'
        },
        {
            id: '8',
            name: {
                value: 'Amy Elsner',
                bgColor: 'yellow',
                capName: 'AE'
            },
            date: 'Jul 21th, 2024',
            amount: '+€17.876,24',
            account: '**** **** 9284'
        },
        {
            id: '9',
            name: {
                value: 'Arlene McCoy',
                bgColor: 'blue',
                capName: 'AM'
            },
            date: 'Jun 28th, 2024',
            amount: '-$12.423,04',
            account: '**** **** 8234'
        }
    ];
}
