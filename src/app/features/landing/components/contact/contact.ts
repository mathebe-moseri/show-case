import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  // ── Replace with your Formspree endpoint ──────────────────────────────────
  private readonly FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';
  // ─────────────────────────────────────────────────────────────────────────

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  status: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  constructor(private http: HttpClient) { }

  onSubmit(): void {
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;

    this.status = 'sending';

    this.http.post(this.FORMSPREE_URL, this.formData, {
      headers: { Accept: 'application/json' }
    }).subscribe({
      next: () => {
        this.status = 'success';
        this.formData = { name: '', email: '', subject: '', message: '' };
      },
      error: () => {
        this.status = 'error';
      }
    });
  }

  get isSubmitting(): boolean {
    return this.status === 'sending';
  }
}
