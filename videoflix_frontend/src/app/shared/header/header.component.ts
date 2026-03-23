import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TypographyComponent } from "../../ui-component/typography/typography.component";
import { AuthService } from '../../../services/authentication/auth.service';
import { Observable } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    TypographyComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  showIntro = false;
  showLogo = false;
  logoVisible = false;
  isFirstVisit = false;
  isLoggedIn$: Observable<boolean>;

  @ViewChild('introContainer') introContainer?: ElementRef<HTMLElement>;
  @ViewChild('imgWrapper') imgWrapper?: ElementRef<HTMLElement>;
  @ViewChild('maskEl') maskEl?: ElementRef<HTMLElement>;
  @ViewChild('headerLogo') headerLogo?: ElementRef<HTMLElement>;
  @ViewChild('headerLogoShort') headerLogoShort?: ElementRef<HTMLElement>;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.isLoggedIn$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    const played = sessionStorage.getItem('animationPlayed');
    this.isFirstVisit = !played;

    if (played) {
      this.showLogo = true;
      this.logoVisible = true;
    } else {
      // Render both so ViewChild refs are available and target position can be measured
      this.showIntro = true;
      this.showLogo = true;
      this.logoVisible = false;
    }
  }

  ngAfterViewInit(): void {
    if (!this.isFirstVisit) return;
    // Small delay so Angular finishes rendering and the browser has laid out
    // all elements — needed for accurate getBoundingClientRect measurements
    setTimeout(() => this.playIntroAnimation(), 100);
  }

  playIntroAnimation(): void {
    const container = this.introContainer?.nativeElement;
    const wrapper = this.imgWrapper?.nativeElement;
    const mask = this.maskEl?.nativeElement;

    // Pick the logo that is actually visible at this viewport width
    const isMobile = window.innerWidth <= 420;
    const targetEl = isMobile
      ? this.headerLogoShort?.nativeElement
      : this.headerLogo?.nativeElement;

    if (!container || !wrapper || !mask || !targetEl) return;

    // Exact viewport-relative position of the static header logo
    const targetRect = targetEl.getBoundingClientRect();

    // Convert img-wrapper to fixed positioning.
    // Calculate starting position directly from viewport dimensions so the logo
    // always begins exactly at viewport center — independent of CSS layout quirks.
    const wrapperW = wrapper.offsetWidth;
    const wrapperH = wrapper.offsetHeight;
    gsap.set(wrapper, {
      position: 'fixed',
      top: (window.innerHeight - wrapperH) / 2,
      left: (window.innerWidth - wrapperW) / 2,
      width: wrapperW,
      xPercent: 0,
      yPercent: 0,
    });

    const tl = gsap.timeline();

    // Phase 1 – reveal: mask slides right, exposing the logo
    tl.to(mask, {
      duration: 1.2,
      xPercent: 100,
      ease: 'power2.out',
      delay: 0.3,
    });

    if (isMobile) {
      // Mobile: different logo shape → fade out intro logo early, no slide
      tl.to(wrapper, {
        duration: 0.5,
        opacity: 0,
      }, '+=0.1');

      tl.to(container, {
        duration: 0.5,
        backgroundColor: 'rgba(0,0,0,0)',
        ease: 'power1.in',
      }, '<');

      tl.add(() => {
        this.logoVisible = true;
        this.showIntro = false;
        sessionStorage.setItem('animationPlayed', 'true');
        this.cdr.detectChanges();
      });
    } else {
      // Phase 2 – slide to header position while background fades out
      tl.to(wrapper, {
        duration: 0.9,
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        ease: 'power3.inOut',
      }, '+=0.2');

      tl.to(container, {
        duration: 0.9,
        backgroundColor: 'rgba(0,0,0,0)',
        ease: 'power1.in',
      }, '<');

      // Phase 3 – crossfade: both logos overlap briefly so the switch is invisible
      tl.add(() => {
        this.logoVisible = true;
        this.cdr.detectChanges();
      });

      tl.to(wrapper, {
        duration: 0.15,
        opacity: 0,
        onComplete: () => {
          this.showIntro = false;
          sessionStorage.setItem('animationPlayed', 'true');
          this.cdr.detectChanges();
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
