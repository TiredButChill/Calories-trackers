import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-help',
    standalone: true,
    imports: [CommonModule, IconFieldModule, InputIconModule, InputTextModule, AccordionModule, FormsModule],
    template: `
        <div>
            <div class="flex flex-col items-center py-11">
                <h1 class="title-h5 md:title-h4">
                    Advice and answers<br />
                    from the <span class="text-primary">Diamond team</span>
                </h1>
                <p class="mt-3 body-small">Get valuable advice and expert answers directly from the Genesis team.</p>
                <p-iconfield class="mt-7">
                    <p-inputicon class="pi pi-search" />
                    <input pInputText [(ngModel)]="search" placeholder="Search" />
                </p-iconfield>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <ng-container *ngFor="let item of helps; let index = index">
                    <div class="card !mb-0">
                        <i [ngClass]="item.icon" class="!text-3xl text-primary"></i>
                        <h5 class="title-h7 text-left mt-4">{{ item.title }}</h5>
                        <p class="body-small text-left mt-2">{{ item.description }}</p>
                        <a class="inline-flex items-center justify-between w-full mt-5 cursor-pointer">
                            <span class="label-small flex-1 text-primary text-left">View all</span>
                            <span><i class="pi pi-arrow-right !text-lg text-primary"></i></span>
                        </a>
                    </div>
                </ng-container>
            </div>
            <div class="max-w-6xl mx-auto card mt-6">
                <p-accordion value="0">
                    <p-accordion-panel *ngFor="let item of faqs; let i = index" [value]="i + ''">
                        <p-accordion-header>{{ item.title }}</p-accordion-header>
                        <p-accordion-content>
                            <p class="m-0">{{ item.description }}</p>
                        </p-accordion-content>
                    </p-accordion-panel>
                </p-accordion>
            </div>
        </div>
    `
})
export class Help {
    search: string = '';

    helps = [
        {
            icon: 'pi pi-power-off',
            title: 'Getting Started',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
            to: ''
        },
        {
            icon: 'pi pi-arrows-h',
            title: 'Transactions',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
            to: ''
        },
        {
            icon: 'pi pi-user',
            title: 'Profile',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
            to: ''
        },
        {
            icon: 'pi pi-money-bill',
            title: 'Billing',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
            to: ''
        },
        {
            icon: 'pi pi-database',
            title: 'Integrations',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
            to: ''
        },
        {
            icon: 'pi pi-shield',
            title: 'Security',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
            to: ''
        }
    ];

    faqs = [
        {
            title: 'How do I become a webmaster?',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
        },
        {
            title: 'What is web traffic?',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
        },
        {
            title: 'What is an easy way to make a website?',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
        },
        {
            title: 'How do you know if something is true?',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
        }
    ];
}
