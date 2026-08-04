import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-invoice',
    standalone: true,
    imports: [DividerModule, TableModule],
    template: `
        <div class="card p-5 overflow-auto shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
            <div class="flex items-start pt-6 px-6 pb-9 gap-6 flex-wrap-reverse">
                <div class="flex-1">
                    <svg class="fill-surface-950 dark:fill-surface-0" width="125" height="32" viewBox="0 0 125 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M26.8844 16C27.5005 16 28.0045 15.4997 27.9555 14.8856C27.7658 12.5094 26.9717 10.2143 25.6405 8.222C24.1022 5.91972 21.9157 4.12531 19.3575 3.06569C16.7994 2.00607 13.9844 1.72882 11.2687 2.26901C8.55298 2.8092 6.05843 4.14257 4.1005 6.1005C2.14257 8.05843 0.809203 10.553 0.269011 13.2687C-0.27118 15.9844 0.00606599 18.7994 1.06569 21.3575C2.12531 23.9157 3.91972 26.1022 6.222 27.6405C8.21425 28.9717 10.5094 29.7658 12.8856 29.9555C13.4997 30.0045 14 29.5005 14 28.8844V25.5155C14 24.8994 13.4983 24.4076 12.8877 24.326C11.6208 24.1567 10.4041 23.6998 9.33319 22.9843C7.95182 22.0613 6.87517 20.7494 6.2394 19.2145C5.60362 17.6796 5.43728 15.9906 5.76139 14.3612C6.08551 12.7318 6.88553 11.235 8.06028 10.0603C9.23504 8.88553 10.7318 8.08551 12.3612 7.76139C13.9906 7.43728 15.6796 7.60362 17.2145 8.2394C18.7494 8.87517 20.0613 9.95182 20.9843 11.3332C21.6998 12.4041 22.1567 13.6208 22.326 14.8877C22.4076 15.4983 22.8994 16 23.5155 16H26.8844Z"
                        />
                        <path
                            d="M20.3442 17.9561C20.4501 17.6123 20.1787 17.2829 19.819 17.2829H16.3982C15.7821 17.2829 15.2826 17.7823 15.2826 18.3984V21.8191C15.2826 22.1788 15.612 22.4502 15.9558 22.3443C18.0484 21.6999 19.6997 20.0487 20.3442 17.9561Z"
                        />
                        <path
                            d="M23.1621 17.2829C22.6154 17.2829 22.1582 17.6844 22.013 18.2115C21.2385 21.0236 19.0234 23.2387 16.2113 24.0131C15.6842 24.1582 15.2826 24.6155 15.2826 25.1622V28.8845C15.2826 29.5006 15.7821 30 16.3982 30H18.6292C19.2453 30 19.7448 29.5006 19.7448 28.8845V25.0941C19.7448 24.8904 19.991 24.7885 20.135 24.9325L24.4655 29.263C24.9011 29.6986 25.6075 29.6986 26.0431 29.263L27.2627 28.0434C27.6983 27.6077 27.6983 26.9014 27.2627 26.4658L22.9322 22.1353C22.7882 21.9913 22.8902 21.745 23.0938 21.745H26.8842C27.5003 21.745 27.9997 21.2456 27.9997 20.6295V18.3984C27.9997 17.7823 27.5003 17.2829 26.8842 17.2829H23.1621Z"
                        />
                        <path
                            d="M47.624 10.048C44.144 10.048 42.152 12.568 42.152 16.36C42.152 20.272 44.408 22.408 47.648 22.408C50.696 22.408 52.544 20.728 52.544 17.92V17.848H47.24V15.136H55.4V25H52.808L52.616 22.984C51.656 24.328 49.664 25.264 47.288 25.264C42.368 25.264 38.936 21.688 38.936 16.288C38.936 10.96 42.416 7.168 47.696 7.168C51.704 7.168 54.8 9.496 55.304 13.072H52.064C51.512 11.008 49.736 10.048 47.624 10.048ZM63.3494 25.312C59.8214 25.312 57.3494 22.744 57.3494 19.072C57.3494 15.352 59.7734 12.784 63.2534 12.784C66.8054 12.784 69.0614 15.16 69.0614 18.856V19.744L60.1334 19.768C60.3494 21.856 61.4534 22.912 63.3974 22.912C65.0054 22.912 66.0614 22.288 66.3974 21.16H69.1094C68.6054 23.752 66.4454 25.312 63.3494 25.312ZM63.2774 15.184C61.5494 15.184 60.4934 16.12 60.2054 17.896H66.1574C66.1574 16.264 65.0294 15.184 63.2774 15.184ZM74.0928 25H71.1648V13.144H73.8768L74.1168 14.68C74.8608 13.48 76.3008 12.784 77.9088 12.784C80.8848 12.784 82.4208 14.632 82.4208 17.704V25H79.4928V18.4C79.4928 16.408 78.5088 15.448 76.9968 15.448C75.1968 15.448 74.0928 16.696 74.0928 18.616V25ZM90.3616 25.312C86.8336 25.312 84.3616 22.744 84.3616 19.072C84.3616 15.352 86.7856 12.784 90.2656 12.784C93.8176 12.784 96.0736 15.16 96.0736 18.856V19.744L87.1456 19.768C87.3616 21.856 88.4656 22.912 90.4096 22.912C92.0176 22.912 93.0736 22.288 93.4096 21.16H96.1216C95.6176 23.752 93.4576 25.312 90.3616 25.312ZM90.2896 15.184C88.5616 15.184 87.5056 16.12 87.2176 17.896H93.1696C93.1696 16.264 92.0416 15.184 90.2896 15.184ZM97.265 21.4H100.049C100.073 22.432 100.841 23.08 102.185 23.08C103.553 23.08 104.297 22.528 104.297 21.664C104.297 21.064 103.985 20.632 102.929 20.392L100.793 19.888C98.657 19.408 97.625 18.4 97.625 16.504C97.625 14.176 99.593 12.784 102.329 12.784C104.993 12.784 106.793 14.32 106.817 16.624H104.033C104.009 15.616 103.337 14.968 102.209 14.968C101.057 14.968 100.385 15.496 100.385 16.384C100.385 17.056 100.913 17.488 101.921 17.728L104.057 18.232C106.049 18.688 107.057 19.6 107.057 21.424C107.057 23.824 105.017 25.312 102.089 25.312C99.137 25.312 97.265 23.728 97.265 21.4ZM110.51 10.768C109.502 10.768 108.71 9.976 108.71 8.992C108.71 8.008 109.502 7.24 110.51 7.24C111.47 7.24 112.262 8.008 112.262 8.992C112.262 9.976 111.47 10.768 110.51 10.768ZM109.046 25V13.144H111.974V25H109.046ZM113.847 21.4H116.631C116.655 22.432 117.423 23.08 118.767 23.08C120.135 23.08 120.879 22.528 120.879 21.664C120.879 21.064 120.567 20.632 119.511 20.392L117.375 19.888C115.239 19.408 114.207 18.4 114.207 16.504C114.207 14.176 116.175 12.784 118.911 12.784C121.575 12.784 123.375 14.32 123.399 16.624H120.615C120.591 15.616 119.919 14.968 118.791 14.968C117.639 14.968 116.967 15.496 116.967 16.384C116.967 17.056 117.495 17.488 118.503 17.728L120.639 18.232C122.631 18.688 123.639 19.6 123.639 21.424C123.639 23.824 121.599 25.312 118.671 25.312C115.719 25.312 113.847 23.728 113.847 21.4Z"
                        />
                    </svg>
                    <div class="mt-3 body-xsmall text-left">9137 3rd Lane California CityCA 93504, U.S.A.</div>
                </div>
                <div class="flex flex-col text-right">
                    <h1 class="title-h6">Invoice</h1>
                    <span class="mt-1.5 body-medium">#09022023</span>
                </div>
            </div>
            <p-divider />
            <div class="px-6 pb-9 pt-6 flex items-start gap-6 flex-wrap sm:flex-row flex-col">
                <div class="flex-1">
                    <div class="label-medium text-surface-500">Bill To:</div>
                    <div class="mt-2 label-medium">AlphaHex</div>
                    <div class="body-small text-left mt-0.5">
                        Claire Williams, 148 Hope LanePalo <br />
                        Alto, CA 94304.
                    </div>
                </div>
                <div class="flex flex-col gap-3 min-w-64">
                    <div class="flex items-center justify-between gap-6">
                        <span class="body-small">Client Name</span>
                        <span class="label-small text-surface-950 dark:text-surface-0">Amy Elsner</span>
                    </div>
                    <div class="flex items-center justify-between gap-6">
                        <span class="body-small">Date</span>
                        <span class="label-small text-surface-950 dark:text-surface-0">04/19/2023</span>
                    </div>
                    <div class="flex items-center justify-between gap-6">
                        <span class="body-small">Customer</span>
                        <span class="label-small text-surface-950 dark:text-surface-0">A123</span>
                    </div>
                </div>
            </div>
            <p-divider />
            <div>
                <p-table [value]="products" [tableStyle]="{ minWidth: '50rem' }">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Line Total</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-product>
                        <tr>
                            <td>{{ product.description }}</td>
                            <td>{{ product.quantity }}</td>
                            <td>{{ product.price }}</td>
                            <td>{{ product.total }}</td>
                        </tr>
                    </ng-template>
                </p-table>

                <div class="py-6 px-4 flex items-start gap-6 flex-wrap sm:flex-row flex-col">
                    <div class="flex-1 body-small text-left text-surface-950 dark:text-surface-0">Notes</div>
                    <div class="flex flex-col gap-3 min-w-52">
                        <div class="flex items-center justify-between">
                            <span class="label-small text-surface-950 dark:text-surface-0">Subtotal</span>
                            <span>$216.00</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="label-small text-surface-950 dark:text-surface-0">Vat</span>
                            <span>0</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="label-small text-surface-950 dark:text-surface-0">Total</span>
                            <span>$216.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Invoice {
    products = [
        {
            description: 'Green T-Shirt',
            quantity: '1',
            price: '$49',
            total: '$49'
        },
        {
            description: 'Game Controller',
            quantity: '1',
            price: '$56',
            total: '$56'
        },
        {
            description: 'Mini Speakers',
            quantity: '1',
            price: '$72',
            total: '$72'
        }
    ];
}
