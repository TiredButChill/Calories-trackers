import { Component, inject } from '@angular/core';
import { ContactHeroWidget } from '@/pages/landing/components/contact/contactherowidget';
import { ContactAdressWidget } from '@/pages/landing/components/contact/contactadresswidget';
import { TestimonialWidget } from '@/pages/landing/components/testimonialwidget';
import { FaqWidget } from '@/pages/landing/components/faqwidget';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [ContactHeroWidget, ContactAdressWidget, TestimonialWidget, FaqWidget, AppConfigurator],
    template: `
        <app-contact-hero-widget />
        <app-contact-adress-widget />
        <app-testimonial-widget />
        <app-faq-widget />
        <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button>
        <app-configurator location="landing" />
    `
})
export class ContactPage {
    layoutService: LayoutService = inject(LayoutService);
}
