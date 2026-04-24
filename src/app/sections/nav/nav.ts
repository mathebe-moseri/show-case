import { Component, signal, HostListener } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav {
  scrolled = signal(true);
  theme = signal<'dark' | 'light'>('light');
  activeSection = signal('');
  menuOpen = signal(false);

  readonly sections = ['about', 'projects', 'experience', 'skills', 'contact'];

  ngOnInit() {
    document.body.classList.add('light');
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
}
