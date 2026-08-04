import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { trackByFn } from '@/lib/utils';

@Component({
    selector: 'orders-widget',
    standalone: true,
    imports: [CommonModule, ButtonModule, TagModule, DividerModule],
    template: ` <div class="flex items-center justify-between">
            <span class="label-medium text-surface-950 dark:text-surface-0">Orders</span>
            <button pButton severity="secondary" outlined class="!text-surface-950 dark:!text-surface-0 !px-2 !py-1.5 !rounded-lg !label-xsmall"><span pButtonLabel>See All</span><i class="pi pi-chevron-right !text-xs"></i></button>
        </div>
        <div class="flex flex-col mt-8">
            @for (item of orders; track trackByFn(); let idx = $index) {
                <div class="flex items-center gap-2">
                    <img class="w-13 h-13 rounded-lg object-cover border border-surface-200 dark:border-surface-800" [src]="item.image" alt="Order Image" />
                    <div class="flex-1">
                        <div class="label-small text-left text-surface-950 dark:text-surface-0">{{ item.title }}</div>
                        <time class="mt-1 body-xsmall">{{ item.date }}</time>
                    </div>
                    <div class="flex flex-col items-end">
                        <p-tag [severity]="item.status === 'Pending' ? 'warn' : 'success'" [value]="item.status" />
                        <span class="mt-1 body-xsmall">{{ item.id }}</span>
                    </div>
                </div>
                <p-divider *ngIf="idx < orders.length - 1" class="my-3.5" />
            }
        </div>`,
    host: {
        class: 'card !mb-0 flex-1 min-w-80 !p-6 border border-surface rounded-2xl'
    }
})
export class OrdersWidget {
    orders = [
        { title: 'iPhone 15 Pro 1T', date: 'Feb 20, 2024', image: '/demo/images/dashboard/order-1.png', status: 'Pending', id: '3543867' },
        { title: 'iPhone 13 Pro 256GB', date: 'Feb 16, 2024', image: '/demo/images/dashboard/order-2.png', status: 'Pending', id: '6243789' },
        { title: 'Apple Watch 7 41mm', date: 'Feb 11, 2024', image: '/demo/images/dashboard/order-3.png', status: 'Sent', id: '9763474' },
        { title: 'AirPods Pro', date: 'Feb 09, 2024', image: '/demo/images/dashboard/order-4.png', status: 'Sent', id: '2538268' },
        { title: 'Apple Watch 8 44mm', date: 'Feb 08, 2024', image: '/demo/images/dashboard/order-5.png', status: 'Sent', id: '9572345' },
        { title: 'iPhone 13 Pro 128GB', date: 'Feb 07, 2024', image: '/demo/images/dashboard/order-6.png', status: 'Sent', id: '12471247' }
    ];
    protected readonly trackByFn = trackByFn;
}
