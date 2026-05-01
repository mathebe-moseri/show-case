import { Component, AfterViewInit } from '@angular/core';
import { Experience } from '../experience/experience';

@Component({
  selector: 'app-about',
  imports: [Experience],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit {

  private expWrap: HTMLElement | null = null;

  onExpReady(el: HTMLElement) {
    this.expWrap = el;
    this.bindZoom();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-section'
      );

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach(el => observer.observe(el));
    }, 100);
  }

  private bindZoom() {
    const about = document.getElementById('aboutWrap');
    const exp = this.expWrap;

    if (!about || !exp) return;

    about.addEventListener('mouseenter', () => {
      about.classList.add('zoom-active');
      about.classList.remove('zoom-dim');
      exp.classList.add('zoom-dim');
      exp.classList.remove('zoom-active');
    });

    exp.addEventListener('mouseenter', () => {
      exp.classList.add('zoom-active');
      exp.classList.remove('zoom-dim');
      about.classList.add('zoom-dim');
      about.classList.remove('zoom-active');
    });
  }
}