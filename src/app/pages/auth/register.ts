import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AppleWidget } from '@/pages/auth/components/applewidget';
import { GoogleWidget } from '@/pages/auth/components/googlewidget';
import { LogoWidget } from '@/pages/landing/components/logowidget';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [LogoWidget, GoogleWidget, AppleWidget, FormsModule, ReactiveFormsModule, InputTextModule, CheckboxModule, RouterLink],
    template: `
        <section class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-[100rem] mx-auto">
            <div class="flex w-full h-full justify-center gap-12">
                <div class="flex flex-col py-20 lg:min-w-[30rem]">
                    <a routerLink="/" class="flex items-center justify-center lg:justify-start mb-8">
                        <logo-widget></logo-widget>
                    </a>
                    <div class="flex flex-col justify-center flex-grow">
                        <div class="max-w-md mx-auto w-full">
                            <h5 class="title-h5 text-center lg:text-left">Register</h5>
                            <p class="body-small mt-3.5 text-center lg:text-left">Let's get started</p>
                            <button class="button-button mt-8"><app-google-widget></app-google-widget> Register with Google</button>
                            <button class="button-button mt-4"><app-apple-widget></app-apple-widget> Register with Apple</button>
                            <div class="flex items-center gap-3.5 my-7">
                                <span class="flex-1 h-[1px] bg-surface-200 dark:bg-surface-800"></span>
                                <span class="body-small text-surface-400 dark:text-surface-600">or</span>
                                <span class="flex-1 h-[1px] bg-surface-200 dark:bg-surface-800"></span>
                            </div>
                            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                                <input type="text" pInputText formControlName="username" class="w-full" placeholder="Username" />
                                <input type="text" pInputText formControlName="email" class="w-full mt-4" placeholder="Email" />
                                <input type="password" pInputText formControlName="password" class="w-full mt-4" placeholder="Password" />
                                <div class="my-8 flex items-center justify-between">
                                    <div class="flex items-center gap-2">
                                        <p-checkbox binary="true" inputId="remember" formControlName="remember"></p-checkbox>
                                        <label for="remember" class="body-small"> <span class="label-small text-surface-950 dark:text-surface-0">I have read the </span>Terms and Conditions </label>
                                    </div>
                                </div>
                                <button type="submit" class="body-button w-full" [disabled]="registerForm.invalid">Register</button>
                            </form>
                            <div class="mt-8 body-small text-center lg:text-left">Already have an account? <a routerLink="/auth/login" class="text-primary-500 hover:underline">Login</a></div>
                        </div>
                    </div>
                    <div class="mt-8 text-center lg:text-start block relative text-surface-400 dark:text-surface-500 text-sm">©{{ currentYear }} PrimeTek</div>
                </div>
                <div class="hidden lg:flex h-full py-20">
                    <div class="h-full w-full lg:max-w-[32.5rem] xl:max-w-[60.5rem] mx-auto flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] rounded-3xl border border-surface overflow-hidden">
                        <img class="w-auto h-full object-contain object-left" src="/demo/images/landing/auth-image.svg" alt="Auth Image" />
                    </div>
                </div>
            </div>
        </section>
    `
})
export class Register {
    currentYear: number = new Date().getFullYear();
    registerForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder
    ) {
        this.registerForm = this.fb.group({
            username: [''],
            email: [''],
            password: [''],
            remember: [false]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.navigateToVerification();
        }
    }

    navigateToVerification() {
        this.router.navigate(['/auth/verification']);
    }
}
