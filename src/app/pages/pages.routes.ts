import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Invoice } from './invoice/invoice';
import { Help } from './help/help';
import { Faq } from './faq/faq';
import { ContactUs } from './contactus/contactus';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud, data: { breadcrumb: 'Crud' } },
    { path: 'empty', component: Empty, data: { breadcrumb: 'Empty' } },
    { path: 'invoice', component: Invoice, data: { breadcrumb: 'Invoice' } },
    { path: 'help', component: Help, data: { breadcrumb: 'Help' } },
    { path: 'faq', component: Faq, data: { breadcrumb: 'FAQ' } },
    { path: 'contact', component: ContactUs },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
