import { Component, signal } from '@angular/core';
import { Navbar } from "../../core/layout/navbar/navbar";
import { Hero } from "./components/hero/hero";

@Component({
  selector: 'app-landing',
  imports: [Navbar, Hero],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  protected readonly title = signal('showcase');

  isDark = () => this.theme() === 'dark';
  theme  = signal<'dark'|'light'>('light');
}
