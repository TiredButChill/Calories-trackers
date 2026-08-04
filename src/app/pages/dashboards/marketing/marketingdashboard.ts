import { Component } from '@angular/core';
import { StatCardWidget } from '@/pages/dashboards/marketing/components/statcardwidget';
import { SalesOverviewWidget } from '@/pages/dashboards/marketing/components/salesoverviewwidget';
import { FollowerAnalyticsWidget } from '@/pages/dashboards/marketing/components/followeranalyticswidget';
import { OrderHistoryWidget } from '@/pages/dashboards/marketing/components/orderhistorywidget';

@Component({
    selector: 'app-marketing-dashboard',
    standalone: true,
    imports: [StatCardWidget, SalesOverviewWidget, FollowerAnalyticsWidget, OrderHistoryWidget],
    template: `<section class="flex flex-col [&>*]:py-8 [&>*:first-child]:!pt-0 [&>*:last-child]:!pb-0 divide-y divide-[var(--surface-border)]">
        <stat-card-widget />
        <div class="flex xl:flex-row flex-col xl:divide-y-0 divide-y xl:divide-x divide-[var(--surface-border)]">
            <sales-overview-widget />
            <follower-analytics-widget />
        </div>
        <order-history-widget />
    </section>`
})
export class MarketingDashboard {}
