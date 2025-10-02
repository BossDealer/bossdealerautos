import { ContactFormData, ValidationResult } from '../types/index.js';

export class ContactForm {
  private form: HTMLFormElement | null = null;
  private isSubmitting: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    this.form = document.getElementById('contact-form') as HTMLFormElement;
    if (this.form) {
      this.attachEventListeners();
    }
    // Map is now embedded via iframe - no initialization needed
  }

  private attachEventListeners(): void {
    this.form?.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleSubmit();
    });

    this.form?.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.validateField(target.name, target.value);
    });

    const phoneInput = this.form?.querySelector('input[name="phone"]') as HTMLInputElement;
    phoneInput?.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      target.value = this.formatPhoneNumber(target.value);
    });
  }

  private validateField(fieldName: string, value: string): boolean {
    const errorElement = document.getElementById(`${fieldName}-error`);
    let error = '';

    switch (fieldName) {
      case 'name':
        if (!value.trim() || value.trim().length < 2) error = 'Please enter a valid name';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim() || !emailRegex.test(value)) error = 'Please enter a valid email';
        break;
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '');
        if (!value.trim()) {
          error = 'Please enter your phone number';
        } else if (phoneDigits.length < 10 || (phoneDigits.startsWith('234') && phoneDigits.length !== 13) || (!phoneDigits.startsWith('234') && phoneDigits.length !== 11)) {
          error = 'Please enter a valid Nigerian phone number';
        }
        break;
      case 'subject':
        if (!value.trim() || value.trim().length < 5) error = 'Please enter a subject';
        break;
      case 'message':
        if (!value.trim() || value.trim().length < 10) error = 'Please enter a message';
        break;
    }

    if (errorElement) {
      errorElement.textContent = error;
      errorElement.classList.toggle('hidden', !error);
    }
    return !error;
  }

  private formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    
    // Handle Nigerian phone number format
    if (digits.startsWith('234')) {
      const match = digits.match(/^(234)(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (!match) return value;
      
      let formatted = '';
      if (match[1]) formatted += `+${match[1]}`;
      if (match[2]) formatted += ` ${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;
      if (match[4]) formatted += `-${match[4]}`;
      return formatted;
    } else {
      // Local Nigerian format
      const match = digits.match(/^(\d{0,4})(\d{0,3})(\d{0,4})$/);
      if (!match) return value;
      
      let formatted = '';
      if (match[1]) formatted += match[1];
      if (match[2]) formatted += `-${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;
      return formatted;
    }
  }

  private async handleSubmit(): Promise<void> {
    if (this.isSubmitting) return;

    const validation = this.validateForm();
    if (!validation.isValid) return;

    this.setSubmitting(true);
    try {
      const formData = new FormData(this.form!);
      const contactData: ContactFormData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
        preferredContact: formData.get('preferredContact') as 'email' | 'phone'
      };

      await this.submitContactForm(contactData);
      this.showSuccess();
      this.resetForm();
    } catch (error) {
      this.showError('Failed to send message. Please try again.');
    } finally {
      this.setSubmitting(false);
    }
  }

  private validateForm(): ValidationResult {
    const formData = new FormData(this.form!);
    let isValid = true;
    ['name', 'email', 'phone', 'subject', 'message'].forEach(field => {
      if (!this.validateField(field, formData.get(field) as string || '')) {
        isValid = false;
      }
    });
    return { isValid, errors: {} };
  }

  private async submitContactForm(data: ContactFormData): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Contact form submitted:', data);
        resolve();
      }, 1500);
    });
  }

  private setSubmitting(submitting: boolean): void {
    this.isSubmitting = submitting;
    const submitBtn = this.form?.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = submitting;
      const text = submitBtn.querySelector('.submit-text');
      const spinner = submitBtn.querySelector('.loading-spinner');
      text?.classList.toggle('hidden', submitting);
      spinner?.classList.toggle('hidden', !submitting);
    }
  }

  private showSuccess(): void {
    this.clearMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'contact-success bg-success-100 border border-success-400 text-success-700 px-4 py-3 rounded mb-6';
    successDiv.textContent = 'Thank you! Your message has been sent successfully.';
    this.form?.prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
  }

  private showError(message: string): void {
    this.clearMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'contact-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6';
    errorDiv.textContent = message;
    this.form?.prepend(errorDiv);
  }

  private clearMessages(): void {
    const existing = this.form?.querySelectorAll('.contact-success, .contact-error');
    existing?.forEach(el => el.remove());
  }

  private resetForm(): void {
    this.form?.reset();
    const errors = this.form?.querySelectorAll('.form-error');
    errors?.forEach(el => { el.textContent = ''; el.classList.add('hidden'); });
  }

}