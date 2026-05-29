import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {

  currentIndex = 0;
projects = [
  {
    title: 'Mageza - Smart Taxi Coordination',
    company: 'Personal Project',
    description:
      'Smart taxi coordination platform helping passengers track taxis, view seat availability and estimate arrival times in real time.',
    stack: [
      'React',
      'JavaScript',
      'Firebase',
      'Firestore',
      'Leaflet'
    ],
    features: [
      'Real-time tracking',
      'Seat availability',
      'ETA prediction',
      'Queue management'
    ],
    status: 'In Development',
    year: '2026',
    github: '#',
    demo: 'https://mageza-8dd09.web.app'
  },

{
  title: 'SkillUp',
  company: 'Personal Project',
  description:
    'SkillUp helps professionals move beyond simply using AI-generated solutions by teaching the workflows, systems, and concepts behind everyday tools. The platform focuses on building genuine understanding so users can troubleshoot, maintain, and improve the systems they work with.',
  stack: [
    'Angular',
    'TypeScript',
    'C#',
    '.NET',
    'Azure',
    'SQL'
  ],
  features: [
    'Workflow visualization',
    'Interactive learning journeys',
    'Knowledge validation',
    'Practical troubleshooting'
  ],
  status: 'On Hold',
  year: '2025',
  github: 'https://github.com/mathebe-moseri/skillUp',
  demo: 'https://brave-ocean-0a32b7e03.1.azurestaticapps.net/'
},

{
  title: 'SkillUp Academy',
  company: 'Personal Project',
  description:
    'A digital learning platform providing accessible extra classes for high school learners. The platform helps students reinforce classroom learning, improve understanding of challenging concepts and study at their own pace.',
  stack: [
    'Angular',
    'TypeScript',
    '.NET',
    'Azure',
    'SQL'
  ],
  features: [
    'Extra classes on demand',
    'Curriculum-aligned content',
    'Self-paced learning',
    'Progress monitoring'
  ],
  status: 'In Development',
  year: '2025',
  github: 'https://github.com/mathebe-moseri/skillUp',
  demo: 'https://green-sky-0218fea03.6.azurestaticapps.net/'
}
];

  nextProject() {
    this.currentIndex =
      (this.currentIndex + 1) % this.projects.length;
  }

  previousProject() {
    this.currentIndex =
      (this.currentIndex - 1 + this.projects.length) %
      this.projects.length;
  }
}
