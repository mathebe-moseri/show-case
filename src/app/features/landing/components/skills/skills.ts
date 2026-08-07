import {
  Component,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface Tool {
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'CLOUD' | 'TOOLING';
  svgLogo: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements AfterViewInit, OnDestroy {
  @ViewChild('marqueeTrack') marqueeTrackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fadeWrapper') fadeWrapperRef!: ElementRef<HTMLDivElement>;

  categories = ['ALL', 'FRONTEND', 'BACKEND', 'DATABASE', 'CLOUD', 'TOOLING'] as const;
  activeCategory = signal<string>('ALL');

  trackState: 'is-visible' | 'is-leaving' | 'is-entering' = 'is-visible';

  private transitioning = false;

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
  ) { }

  sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  tools: Tool[] = [
    {
      name: 'Angular',
      category: 'FRONTEND',
      svgLogo: `<svg viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg"><path d="M125 30L31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z" fill="#DD0031"/><path d="M125 30v22.2-.1V230l78.9-43.7 14.2-123.1L125 30z" fill="#C3002F"/><path d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z" fill="#fff"/></svg>`,
    },
    {
      name: 'TypeScript',
      category: 'FRONTEND',
      svgLogo: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" rx="50" fill="#3178C6"/><path d="M87.7 200.7V217h52v148h36.9V217h52v-16c0-9 0-16.3-.4-16.5-.3-.3-31.7-.4-70-.4l-69.7.3v16.3z" fill="#fff"/><path d="M301.4 184c10.2 2.4 18 7 25 14.3 3.7 4 9.2 11 9.6 12.8.1.5-17.3 12.3-27.8 18.8-.4.3-2-1.4-3.6-3.8-5.2-7.4-10.5-10.6-18.8-11.2-12.1-.8-20 5.5-19.9 16 0 3.1.5 4.9 1.8 7.4 2.8 5.6 8 9 23 15.6 28.5 12.3 40.7 20.4 48.3 31.9 8.5 12.8 10.4 33.3 4.7 48.5-6.4 16.5-22.2 27.8-44.4 31.6-6.9 1.2-23.1 1-30.5-.3-16-3-31.2-11-40.4-21.4-3.7-4.2-10.8-14.7-10.4-15.4.2-.3 4-2.6 8.5-5.1l12.8-7.3 3.3 4.8c4.6 6.9 14.7 13 23.3 14 8 .8 17.9-3.4 21.7-9.5 1.9-3.1 2.2-4.3 2.2-9.3 0-5.2-.3-6.3-2.6-9.4-2.9-3.8-8.9-7-25.9-13.9-19.4-7.8-27.7-12.7-35.3-20.4-4.4-4.5-8.6-11.7-10.4-17.8-1.8-6.5-2.3-18.1-1-24.9 4.5-22.8 22.9-38.3 46.9-40.4 8-.7 26.5.3 34.4 2z" fill="#fff"/></svg>`,
    },
    {
      name: 'Tailwind CSS',
      category: 'FRONTEND',
      svgLogo: `<svg viewBox="0 0 54 33" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M27 0C19.8 0 15.3 3.6 13.5 10.8c2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 12.672 33.808 16 40.5 16c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C37.256 3.328 34.192 0 27 0zM13.5 16C6.3 16 1.8 19.6 0 26.8c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C16.744 28.672 19.808 32 26.5 32c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.756 19.328 20.692 16 13.5 16z" fill="#06B6D4"/></svg>`,
    },
    {
      name: 'Figma',
      category: 'FRONTEND',
      svgLogo: `<svg viewBox="0 0 38 57" xmlns="http://www.w3.org/2000/svg"><path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/><path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83"/><path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262"/><path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/><path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/></svg>`,
    },
    {
      name: 'Three.js',
      category: 'FRONTEND',
      svgLogo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path d="M0 128L64 0l64 128H0zm12 0h104L64 17.5 12 128z" fill="#ffffff"/><path d="M32 96l32-64 32 64H32zm8 0h48L64 43.5 40 96z" fill="#aaaaaa"/><path d="M52 80l12-24 12 24H52zm4 0h16L64 61.5 56 80z" fill="#555555"/></svg>`,
    },
    {
      name: 'Node.js',
      category: 'BACKEND',
      svgLogo: `<svg viewBox="0 0 256 292" xmlns="http://www.w3.org/2000/svg"><path d="M128 292a19.4 19.4 0 0 1-9.7-2.6L39 241.8c-3.3-1.8-1.7-2.5-.6-2.9 15.6-5.4 18.7-6.6 35.3-16 1.7-1 4 .6 5.8 1.6l60.3 35.8a7.7 7.7 0 0 0 7.2 0l78.9-43.7a7.3 7.3 0 0 0 3.6-6.3V74.3a7.4 7.4 0 0 0-3.7-6.4L148 39.5a7.3 7.3 0 0 0-7.2 0L39 74.3a7.5 7.5 0 0 0-3.7 6.4v106.1a7.3 7.3 0 0 0 3.7 6.4l25 14.4c13.6 6.8 22 0 22-13.4V87.7a6.6 6.6 0 0 1 6.6-6.7h14a6.7 6.7 0 0 1 6.6 6.7v106c0 26.2-14.3 41.3-39.2 41.3-7.6 0-13.6 0-30.4-8.3L38.7 265a13.4 13.4 0 0 1-6.6-11.6V142.8a13.4 13.4 0 0 1 6.6-11.7L128 78a14 14 0 0 1 14 0l89.4 53a13.5 13.5 0 0 1 6.7 11.8v106.1a13.4 13.4 0 0 1-6.7 11.7L142.8 314a13.8 13.8 0 0 1-14.8-22z" fill="#539E43"/></svg>`,
    },
    {
      name: 'C# / .NET',
      category: 'BACKEND',
      svgLogo: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z" fill="#9B4F96"/><path d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z" fill="#68217A"/><path d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1L100 51h4.9l-1.2 6.2h3.8l1.2-6.2h4.8l-1.2 6.2h2.4v4.7h-3.3l-.9 4.3h4.2v4.7h-5.1l-1.2 6.2h-4.9l1.2-6.2H101l-1.2 6.2h-4.8l1.2-6.2h-2.4v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z" fill="#fff"/></svg>`,
    },
    {
      name: 'Firebase',
      category: 'BACKEND',
      svgLogo: `<svg viewBox="0 0 256 351" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FFA000" d="M36.2 302.6L56.8 38.3c.7-8.7 8.4-15 17-14.3 3.8.3 7.3 2 9.9 4.8l136.1 152.8z"/>
    <path fill="#F57F17" d="M219 96.5L183.4 26.3c-3.7-7.3-12.7-10.2-20-6.5-2.8 1.4-5.1 3.7-6.5 6.5L36.2 302.6z"/>
    <path fill="#FFCA28" d="M36.2 302.6l74.4-146.8 44.4 83.5z"/>
  </svg>`,
    },
    {
      name: 'SQL Server',
      category: 'DATABASE',
      svgLogo: `<svg viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="25" cy="10" rx="20" ry="7" fill="#CC2927"/><path d="M5 10v10c0 3.9 9 7 20 7s20-3.1 20-7V10c0 3.9-9 7-20 7S5 13.9 5 10z" fill="#CC2927"/><path d="M5 20v10c0 3.9 9 7 20 7s20-3.1 20-7V20c0 3.9-9 7-20 7S5 23.9 5 20z" fill="#B71C1C"/><path d="M5 30v10c0 3.9 9 7 20 7s20-3.1 20-7V30c0 3.9-9 7-20 7S5 33.9 5 30z" fill="#9A1616"/></svg>`,
    },
    {
      name: 'Azure',
      category: 'CLOUD',
      svgLogo: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="az1" x1="-.022" y1="73.619" x2="48.367" y2="-1.469" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#114a8b"/><stop offset="1" stop-color="#0669bc"/></linearGradient><linearGradient id="az2" x1="41.252" y1="42.162" x2="52.314" y2="38.577" gradientUnits="userSpaceOnUse"><stop offset="0" stop-opacity=".3"/><stop offset=".071" stop-opacity=".2"/><stop offset=".321" stop-opacity=".1"/><stop offset=".623" stop-opacity=".05"/><stop offset="1" stop-opacity="0"/></linearGradient><linearGradient id="az3" x1="31.677" y1="-2.597" x2="77.777" y2="72.031" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#3ccbf4"/><stop offset="1" stop-color="#2892df"/></linearGradient></defs><path d="M33.338 6.544h26.038l-27.03 80.087a4.152 4.152 0 0 1-3.933 2.824H8.149a4.145 4.145 0 0 1-3.928-5.47L29.404 9.368a4.152 4.152 0 0 1 3.934-2.824z" fill="url(#az1)"/><path d="M66.616 63.206H38.207a1.911 1.911 0 0 0-1.304 3.31l18.426 17.195a4.171 4.171 0 0 0 2.85 1.124h16.24z" fill="#0078d4"/><path d="M33.338 6.544a4.12 4.12 0 0 0-3.943 2.879L4.252 83.917a4.14 4.14 0 0 0 3.908 5.538h20.787a4.443 4.443 0 0 0 3.41-2.9l5.014-14.777 17.91 16.705a4.237 4.237 0 0 0 2.666.972H74.1L66.195 63.2l-24.01.006L57.444 6.544z" fill="url(#az2)"/><path d="M67.597 9.368a4.145 4.145 0 0 0-3.928-2.824H33.648a4.146 4.146 0 0 1 3.928 2.824l25.184 74.617a4.146 4.146 0 0 1-3.928 5.47h30.021a4.146 4.146 0 0 0 3.927-5.47z" fill="url(#az3)"/></svg>`,
    },
    {
  name: 'Google Cloud',
  category: 'CLOUD',
  svgLogo: `<svg viewBox="0 0 256 221" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M58 166a55 55 0 1 1 44-88l-19 15a31 31 0 1 0-25 49z"/>
    <path fill="#4285F4" d="M198 166H102v-24h96a28 28 0 1 0 0-56h-8V62h8a52 52 0 0 1 0 104z"/>
    <path fill="#34A853" d="M102 166H58v-24h44z"/>
    <path fill="#FBBC05" d="M102 86H58V62h44z"/>
  </svg>`,
},
    {
      name: 'GitHub Actions',
      category: 'CLOUD',
      svgLogo: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#161b22"/><circle cx="8" cy="8.5" r="1.8" fill="#2088FF"/><circle cx="16" cy="8.5" r="1.8" fill="#2088FF"/><circle cx="12" cy="15.5" r="1.8" fill="#2088FF"/><line x1="8" y1="10.3" x2="12" y2="13.7" stroke="#2088FF" stroke-width="1.2"/><line x1="16" y1="10.3" x2="12" y2="13.7" stroke="#2088FF" stroke-width="1.2"/></svg>`,
    },
    {
      name: 'Git',
      category: 'TOOLING',
      svgLogo: `<svg viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg"><path d="M90.156 41.965L50.036 1.848a5.918 5.918 0 0 0-8.372 0l-8.328 8.332 10.566 10.566a7.03 7.03 0 0 1 7.23 1.684 7.043 7.043 0 0 1 1.673 7.277l10.183 10.184a7.026 7.026 0 0 1 7.278 1.672 7.04 7.04 0 0 1 0 9.957 7.045 7.045 0 0 1-9.961 0 7.038 7.038 0 0 1-1.532-7.66l-9.5-9.497V59.36a7.04 7.04 0 0 1 1.86 11.29 7.04 7.04 0 0 1-9.957 0 7.04 7.04 0 0 1 0-9.958 7.034 7.034 0 0 1 2.308-1.539V33.926a7.001 7.001 0 0 1-2.308-1.535 7.049 7.049 0 0 1-1.516-7.7L29.242 14.273 1.734 41.777a5.918 5.918 0 0 0 0 8.371L41.852 90.27a5.92 5.92 0 0 0 8.37 0l39.934-39.934a5.925 5.925 0 0 0 0-8.371" fill="#F05033"/></svg>`,
    },
    {
      name: 'GitHub',
      category: 'TOOLING',
      svgLogo: `<svg viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#ffffff"/></svg>`,
    },
    {
      name: 'VS Code',
      category: 'TOOLING',
      svgLogo: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M74.1 5.2L39.5 36.8 18.6 20.2 5.5 27.5v45l13.1 7.3 21-16.6L74.1 95l20.4-9.3V14.5L74.1 5.2zm14.4 72.3l-30-21.5v-12l30-21.5v55z" fill="#0065A9"/><path d="M74.1 95l-34.6-31.6V51.1l34.6 31.6V95z" fill="#007ACC"/><path d="M74.1 5.2L39.5 36.8v13.5L74.1 18.8V5.2z" fill="#1F9CF0"/><path d="M18.6 63.4L5.5 72.5 5.5 27.5l13.1 7.3v28.6z" fill="#0065A9" opacity=".25"/></svg>`,
    },
    {
      name: 'D3.js',
      category: 'TOOLING',
      svgLogo: `<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M253.5 177.2c-12.1 43-49.9 74.8-95.4 74.8-32.6 0-61.7-15.8-80.3-40.3L6.3 155.5A128 128 0 0 1 128 0c50.6 0 94.6 29.4 116.4 72.3L253.5 177.2z" fill="#F9A03C"/><path d="M128 256C57.3 256 0 198.7 0 128S57.3 0 128 0v256z" fill="#F9A03C"/><path d="M237.6 178.9A128 128 0 0 1 2.5 149.2L82 211.7a95.9 95.9 0 0 0 83.6 15.9l72-48.7z" fill="#E36209"/></svg>`,
    },
    {
      name: 'Power BI',
      category: 'TOOLING',
      svgLogo: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="14" width="6" height="14" rx="1" fill="#F2C811"/><rect x="10" y="9" width="6" height="19" rx="1" fill="#F2C811"/><rect x="18" y="4" width="6" height="24" rx="1" fill="#F2C811"/><rect x="26" y="17" width="4" height="11" rx="1" fill="#E3A800"/></svg>`,
    },
  ];

  filteredTools = computed(() => {
    const cat = this.activeCategory();
    return cat === 'ALL' ? this.tools : this.tools.filter((t) => t.category === cat);
  });

  get marqueeTools(): Tool[] {
    const base = this.filteredTools();
    return [...base, ...base, ...base, ...base];
  }

  setCategory(cat: string) {
    if (this.transitioning || cat === this.activeCategory()) return;
    this.transitioning = true;

    this.trackState = 'is-leaving';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.activeCategory.set(cat);
      this.trackState = 'is-entering';
      this.cdr.detectChanges();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.trackState = 'is-visible';
          this.cdr.detectChanges();

          this.staggerCards();

          setTimeout(() => {
            this.transitioning = false;
          }, 400);
        });
      });
    }, 260);
  }

  private staggerCards() {
    const wrapper = this.fadeWrapperRef?.nativeElement;
    if (!wrapper) return;

    const cards = wrapper.querySelectorAll<HTMLElement>('.tool-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      card.style.transition = 'none';

      setTimeout(() => {
        card.style.transition = 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.4, 0.64, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 45);
    });
  }

  ngAfterViewInit() {
    this.observeEntrance();
  }

  private observeEntrance() {
    const host = this.el.nativeElement as HTMLElement;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            host.classList.add('skills-visible');
            setTimeout(() => this.staggerCards(), 380);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );

    observer.observe(host);
  }

  ngOnDestroy() { }
}
