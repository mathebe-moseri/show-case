import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit {

  ngAfterViewInit() {
    setTimeout(() => {

      const elements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-section'
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

      const about = document.getElementById('aboutWrap');
      const exp = document.getElementById('expWrap');

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
    }, 100);
  }

}
