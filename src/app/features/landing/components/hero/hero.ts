import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class Hero implements AfterViewInit, OnDestroy {

  @Input() isDark!: () => boolean;

  @ViewChild('avatarCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSection') heroRef!: ElementRef<HTMLDivElement>;
  @ViewChild('typewriterEl') typewriterRef!: ElementRef<HTMLDivElement>;

  private mouse = { x: 0, y: 0 };
  private isHovering = false;

  private typewriterVisible = false;
  private typewriterObserver!: IntersectionObserver;

  currentRole = '';
  private roles = [
    '3+ years delivering end-to-end solutions, from architecture to deployment, using Angular (standalone), .NET / Node.js APIs and SQL.',
    'Focused on performance, clean architecture and secure maintainable systems.'
  ];

  private roleIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private typeTimer: any;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private avatar!: THREE.Group;
  private frameId!: number;

  private isDragging = false;
  private prevMouse = { x: 0, y: 0 };
  private canvasSize = 320;

  private leftEye!: THREE.Mesh;
  private rightEye!: THREE.Mesh;

  private blinked = false;
  private blinkStart = 0;
  private nextBlinkTime = Date.now() + 1500;

  private isVisible = false;
  private observer!: IntersectionObserver;
  private typewriterStarted = false;

  private hasScrolled = false;

  ngAfterViewInit() {
    this.setupVisibilityObserver();
    this.setupTypewriterObserver();

    this.resolveCanvasSize();
    this.initThree();
    this.initCursorTracking();

    window.addEventListener('resize', this.onResize);

    window.addEventListener('scroll', this.handleScroll);
    this.setupScrollCueObserver();
  }

  ngOnDestroy() {
    clearTimeout(this.typeTimer);
    cancelAnimationFrame(this.frameId);
    this.observer?.disconnect();

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.handleScroll);

    this.renderer?.dispose();
  }

  private initCursorTracking() {
    const heroEl = this.heroRef.nativeElement;
    const glow = heroEl.querySelector('.hero-glow') as HTMLElement;

    heroEl.addEventListener('mousemove', (e) => {
      const rect = heroEl.getBoundingClientRect();

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      this.mouse.x = (x - 0.5) * 2;
      this.mouse.y = (y - 0.5) * 2;

      this.isHovering = true;

      if (glow) {
        const gx = e.clientX - rect.left - rect.width / 2;
        const gy = e.clientY - rect.top - rect.height / 2;
        glow.style.transform = `translate(${gx}px, ${gy}px)`;
      }
    });

    heroEl.addEventListener('mouseleave', () => {
      this.isHovering = false;
    });
  }

  private resolveCanvasSize() {
    const w = window.innerWidth;

    if (w <= 480) this.canvasSize = 170;
    else if (w <= 767) this.canvasSize = 210;
    else if (w <= 1023) this.canvasSize = 260;
    else this.canvasSize = 320;
  }

  private applyCanvasSize() {
    const S = this.canvasSize;
    const canvas = this.canvasRef.nativeElement;
    canvas.style.width = `${S}px`;
    canvas.style.height = `${S}px`;
    this.renderer.setSize(S, S);
    this.camera.aspect = 1;
    this.camera.updateProjectionMatrix();
  }

  private onResize = () => {
    this.resolveCanvasSize();
    this.applyCanvasSize();
  };

  private startTypewriter() {
    const type = () => {
      if (!this.typewriterVisible) return;

      const target = this.roles[this.roleIndex];

      if (!this.deleting) {
        this.currentRole = target.slice(0, ++this.charIndex);
        if (this.charIndex === target.length) {
          this.deleting = true;
          this.typeTimer = setTimeout(type, 1800);
          return;
        }
      } else {
        this.currentRole = target.slice(0, --this.charIndex);
        if (this.charIndex === 0) {
          this.deleting = false;
          this.roleIndex = (this.roleIndex + 1) % this.roles.length;
        }
      }
      this.typeTimer = setTimeout(type, this.deleting ? 100 : 160);
    };
    this.typeTimer = setTimeout(type, 400);
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const S = this.canvasSize;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(S, S);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 1.2, 4.2);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 5, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(-4, 2, -3);
    this.scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x88aaff, 0.3);
    this.scene.add(fillLight);

    this.avatar = this.buildAvatar();
    this.scene.add(this.avatar);

    this.addDragControls(canvas);
    this.animate();
  }

  private buildAvatar(): THREE.Group {
    const group = new THREE.Group();

    const skin = new THREE.MeshStandardMaterial({ color: 0xe0b89a, roughness: 0.8 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const accent = new THREE.MeshStandardMaterial({ color: 0xc8f03d, roughness: 0.9 });
    const hair = new THREE.MeshStandardMaterial({ color: 0x2a1a0f, roughness: 1.0 });
    const trouser = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const soft = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const add = (
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      x: number, y: number, z: number,
      rx = 0, ry = 0, rz = 0
    ) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      group.add(m);
      return m;
    };

    // head + hair
    add(new THREE.BoxGeometry(0.95, 1.0, 0.9), skin, 0, 2.8, 0);
    add(new THREE.BoxGeometry(1.0, 0.3, 0.95), hair, 0, 3.25, 0);
    add(new THREE.BoxGeometry(0.25, 0.9, 0.95), hair, -0.5, 2.7, 0);
    add(new THREE.BoxGeometry(0.25, 0.9, 0.95), hair, 0.5, 2.7, 0);
    add(new THREE.BoxGeometry(0.95, 1.3, 0.4), hair, 0, 2.4, -0.4);
    add(new THREE.BoxGeometry(0.6, 0.2, 0.3), hair, 0, 3.05, 0.4);

    // eyes
    this.leftEye = add(new THREE.BoxGeometry(0.2, 0.12, 0.05), dark, -0.22, 2.8, 0.48);
    this.rightEye = add(new THREE.BoxGeometry(0.2, 0.12, 0.05), dark, 0.22, 2.8, 0.48);

    // mouth
    add(new THREE.BoxGeometry(0.18, 0.05, 0.04), dark, 0, 2.5, 0.49);

    // neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.2, 0.3, 6),
      skin
    );
    neck.position.set(0, 2.18, 0);
    group.add(neck);

    // body
    add(new THREE.BoxGeometry(1.1, 1.4, 0.7), soft, 0, 1.2, 0);
add(new THREE.BoxGeometry(0.1, 1.2, 0.68), accent, 0, 1.05, 0);
    // shoulders
    add(new THREE.BoxGeometry(0.35, 0.35, 0.6), soft, -0.75, 1.7, 0);
    add(new THREE.BoxGeometry(0.35, 0.35, 0.6), soft, 0.75, 1.7, 0);

    // arms
    add(new THREE.BoxGeometry(0.3, 0.7, 0.3), soft, -0.75, 1.2, 0);
    add(new THREE.BoxGeometry(0.3, 0.7, 0.3), soft, 0.75, 1.2, 0);

    // fore arms
    add(new THREE.BoxGeometry(0.28, 0.6, 0.28), skin, -0.85, 0.6, 0);
    add(new THREE.BoxGeometry(0.28, 0.6, 0.28), skin, 0.85, 0.6, 0);

    // hands
    add(new THREE.BoxGeometry(0.25, 0.2, 0.2), skin, -0.9, 0.25, 0);
    add(new THREE.BoxGeometry(0.25, 0.2, 0.2), skin, 0.9, 0.25, 0);

    // waist + legs
    add(new THREE.BoxGeometry(1.0, 0.06, 0.7), dark, 0, 0.12, 0.15);
    add(new THREE.BoxGeometry(1.1, 0.25, 0.6), trouser, 0, 0.27, 0);

    group.position.y = -1.6;

    return group;
  }

  private addDragControls(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.avatar.rotation.y += dx * 0.012;
      this.avatar.rotation.x += dy * 0.008;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      canvas.style.cursor = 'grab';
    });
  }

  private animate() {
    this.frameId = requestAnimationFrame(() => this.animate());

    const floatY = Math.sin(Date.now() * 0.001) * 0.01 - 1.6;

    if (!this.isDragging) {
      if (this.isHovering) {

        const targetX = this.mouse.x * 0.6;
        const targetY = floatY + this.mouse.y * 0.3;
        const targetZ = this.mouse.x * -2.2;

        this.avatar.position.x += (targetX - this.avatar.position.x) * 0.08;
        this.avatar.position.y += (targetY - this.avatar.position.y) * 0.08;
        this.avatar.position.z += (targetZ - this.avatar.position.z) * 0.08;

        this.avatar.rotation.y += (this.mouse.x * 0.8 - this.avatar.rotation.y) * 0.08;
        this.avatar.rotation.x += (-this.mouse.y * 0.4 - this.avatar.rotation.x) * 0.08;

      } else {

        this.avatar.position.x += (0 - this.avatar.position.x) * 0.08;
        this.avatar.position.y += (floatY - this.avatar.position.y) * 0.08;
        this.avatar.position.z += (0 - this.avatar.position.z) * 0.08;

        this.avatar.rotation.x += (0 - this.avatar.rotation.x) * 0.08;
        this.avatar.rotation.y += (0 - this.avatar.rotation.y) * 0.08;
      }
    }

    // blink trigger
    const now = Date.now();
    if (!this.blinked && now > this.nextBlinkTime) {
      this.blinked = true;
      this.blinkStart = now;
      this.nextBlinkTime = now + 1500 + Math.random() * 2500;
    }

    if (this.blinked) {
      const duration = 300;
      const elapsed = Date.now() - this.blinkStart;
      const t = elapsed / duration;

      if (t < 1) {
        const scale = Math.abs(Math.cos(t * Math.PI));
        this.leftEye.scale.y = Math.max(0.01, scale);
        this.rightEye.scale.y = Math.max(0.01, scale);
      } else {
        this.leftEye.scale.y = 1;
        this.rightEye.scale.y = 1;
        this.blinked = false;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private setupVisibilityObserver() {
    const el = this.heroRef.nativeElement;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;

        if (this.isVisible) {
          this.startTypewriter();
          this.animate();
        } else {
          clearTimeout(this.typeTimer);
          cancelAnimationFrame(this.frameId);
        }
      },
      { threshold: 0.3 }
    );

    this.observer.observe(el);
  }

  private setupTypewriterObserver() {
    const el = this.typewriterRef.nativeElement;

    this.typewriterObserver = new IntersectionObserver(
      ([entry]) => {
        this.typewriterVisible = entry.isIntersecting;

        if (this.typewriterVisible && !this.typewriterStarted) {
          this.typewriterStarted = true;
          this.startTypewriter();
        }

        if (!this.typewriterVisible) {
          clearTimeout(this.typeTimer);
        }
      },
      { threshold: 0.3 }
    );

    this.typewriterObserver.observe(el);
  }

  private handleScroll = () => {
    const el = document.querySelector('.scroll-fade-line') as HTMLElement;

    if (!el) return;

    if (!this.hasScrolled && window.scrollY > 0) {
      this.hasScrolled = true;

      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, 10px)';
    }
  };

  private setupScrollCueObserver() {
    const hero = this.heroRef.nativeElement;
    const el = document.querySelector('.scroll-fade-line') as HTMLElement;

    if (!hero || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          el.style.opacity = '0';
          el.style.transform = 'translate(-50%, 10px)';
        }
      },
      { threshold: 0.9 }
    );

    observer.observe(hero);
  }
}