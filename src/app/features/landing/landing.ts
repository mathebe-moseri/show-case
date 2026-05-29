import {
  Component,
  signal
} from '@angular/core';
import { Navbar } from "../../core/layout/navbar/navbar";
import { Hero } from "./components/hero/hero";
import { About } from './components/about/about';
import { Skills } from "./components/skills/skills";
import { Contact } from "./components/contact/contact";
import { Experience } from './components/experience/experience';
import { Projects } from "./components/projects/projects";

@Component({
  selector: 'app-landing',
  imports: [Navbar, Hero, About, Skills, Contact, Experience, Projects],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  protected readonly title = signal('showcase');

  theme = signal<'dark' | 'light'>('light');
  isDark = () => this.theme() === 'dark';

}
