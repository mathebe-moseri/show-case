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

  readonly sections = ['about', 'projects', 'experience', 'skills', 'contact'];

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
}
