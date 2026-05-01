import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience implements AfterViewInit {

  @Output() wrapperReady = new EventEmitter<HTMLElement>();

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll(
        '.reveal, .reveal-right'
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

      const expWrap = document.getElementById('expWrap');
      if (expWrap) {
        this.wrapperReady.emit(expWrap);
      }
    }, 100);
  }
}
