import { Component } from '@angular/core';
import { SocialMediaUsersWidget } from '@/pages/dashboards/ecommerce/components/socialmediauserswidget';
import { MiniStatCardWidget } from '@/pages/dashboards/ecommerce/components/ministatcardwidget';
import { OverviewWidget } from '@/pages/dashboards/ecommerce/components/overviewwidget';
import { OrdersWidget } from '@/pages/dashboards/ecommerce/components/orderswidget';
import { SocialMediaRevenueWidget } from '@/pages/dashboards/ecommerce/components/socialmediarevenuewidget';

@Component({
    selector: 'app-ecommerce-dashboard',
    standalone: true,
    imports: [SocialMediaUsersWidget, MiniStatCardWidget, OverviewWidget, OrdersWidget, SocialMediaRevenueWidget],
    template: `<section class="flex flex-col gap-7">
        <div class="flex flex-wrap gap-7">
            <mini-stat-card-widget />
        </div>
        <overview-widget />
        <div class="flex flex-wrap gap-7">
            <social-media-users-widget />
            <orders-widget />
            <social-media-revenue-widget />
        </div>
    </section>`
})
export class EcommerceDashboard {}
