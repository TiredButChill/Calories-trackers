import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppSettingsService } from './app/core/services/app-settings.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {
    // Injected eagerly (unused directly) so its constructor applies the cached
    // theme/font-size/language to <html> as early as possible, before any route renders.
    private readonly appSettingsService = inject(AppSettingsService);
}
