import { Component } from '@angular/core';
import { CurrencyCardWidget } from '@/pages/dashboards/banking/components/currencycardwidget';
import { IncomeExpenditureWidget } from '@/pages/dashboards/banking/components/incomeexpenditurewidget';
import { SpendingLimitWidget } from '@/pages/dashboards/banking/components/spendinglimitwidget';
import { CreditScoreWidget } from '@/pages/dashboards/banking/components/creditscorewidget';
import { TransactionsHistoryWidget } from '@/pages/dashboards/banking/components/transactionshistorywidget';

@Component({
    selector: 'app-banking-dashboard',
    standalone: true,
    imports: [CurrencyCardWidget, IncomeExpenditureWidget, SpendingLimitWidget, CreditScoreWidget, TransactionsHistoryWidget],
    template: `<section>
        <div class="flex flex-col gap-7">
            <currency-card-widget />
            <div class="w-full flex xl:flex-row flex-col gap-6">
                <income-expenditure-widget />
                <spending-limit-widget />
            </div>
            <div class="flex xl:flex-row flex-col gap-6">
                <credit-score-widget />
                <transactions-history-widget />
            </div>
        </div>
    </section>`
})
export class BankingDashboard {}
