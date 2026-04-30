import { Component, signal, HostListener } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  scrolled = signal(true);
  theme = signal<'dark' | 'light'>('dark');
  activeSection = signal('');
  menuOpen = signal(false);

  readonly sections = ['about', 'experience', 'projects', 'skills', 'contact'];

  ngOnInit() {
    document.body.classList.remove('light');
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 10);
  }

  setTheme(t: 'dark' | 'light') {
    this.theme.set(t);
    document.body.classList.toggle('light', t === 'light');
  }

  isDark() { return this.theme() === 'dark'; }

  toggleTheme() {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  toggleMenu() { this.menuOpen.update(v => !v); }

  setSection(section: string) {
    this.activeSection.set(section);
    this.menuOpen.set(false);
  }

  scrollToHero() {
    const hero = document.querySelector('app-hero');

    if (hero) {
      hero.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

scrollToSection(section: string) {
  console.log('Clicked section:', section);

  this.activeSection.set(section);
  this.menuOpen.set(false);

  const element = document.getElementById(section);

  if (element) {
    const navbarHeight = 80;

    const elementPosition =
      element.getBoundingClientRect().top + window.scrollY;

    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // 🔥 ADD THIS PART (animation trigger)
    let target: HTMLElement | null = null;

    if (section === 'about') {
  target = element.querySelector('.zoom-wrapper') as HTMLElement;
    }

    if (section === 'experience') {
target = document.querySelectorAll('.zoom-wrapper')[1] as HTMLElement;
    }

    if (target) {
      target.classList.remove('zoom-focus');

      // restart animation
      void target.offsetWidth;

      target.classList.add('zoom-focus');
    }
  }
}

}
