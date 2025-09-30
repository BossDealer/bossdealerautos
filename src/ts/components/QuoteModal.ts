import { QuoteFormData, ValidationResult, CAR_BRANDS, BUDGET_RANGES, YEARS } from '../types/index.js';

export class QuoteModal {
  private modal: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;
  private form: HTMLFormElement | null = null;
  private isSubmitting: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    this.createModal();
    this.attachEventListeners();
  }

  private createModal(): void {
    // Create modal overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay hidden';
    this.overlay.id = 'quote-modal';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    modalContent.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Get Your Quote</h2>
          <button type="button" id="close-quote-modal" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form id="quote-form" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label" for="car-brand">Car Brand *</label>
              <select id="car-brand" name="carBrand" class="form-input" required>
                <option value="">Select Brand</option>
                ${CAR_BRANDS.map(brand => `<option value="${brand.value}">${brand.label}</option>`).join('')}
              </select>
              <div class="form-error" id="car-brand-error"></div>
            </div>
            
            <div>
              <label class="form-label" for="car-model">Car Model *</label>
              <input type="text" id="car-model" name="carModel" class="form-input" placeholder="e.g., Camry, Accord" required>
              <div class="form-error" id="car-model-error"></div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label" for="year">Year *</label>
              <select id="year" name="year" class="form-input" required>
                <option value="">Select Year</option>
                ${YEARS.map(year => `<option value="${year}">${year}</option>`).join('')}
              </select>
              <div class="form-error" id="year-error"></div>
            </div>
            
            <div>
              <label class="form-label" for="budget-range">Budget Range *</label>
              <select id="budget-range" name="budgetRange" class="form-input" required>
                <option value="">Select Budget</option>
                ${BUDGET_RANGES.map(range => `<option value="${range.value}">${range.label}</option>`).join('')}
              </select>
              <div class="form-error" id="budget-range-error"></div>
            </div>
          </div>

          <div>
            <label class="form-label">Condition *</label>
            <div class="flex space-x-6 mt-2">
              <label class="flex items-center">
                <input type="radio" name="condition" value="new" class="mr-2" required>
                <span>New</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="condition" value="used" class="mr-2" required>
                <span>Used</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="condition" value="certified" class="mr-2" required>
                <span>Certified Pre-Owned</span>
              </label>
            </div>
            <div class="form-error" id="condition-error"></div>
          </div>

          <div>
            <label class="form-label">Financing Preference *</label>
            <div class="flex space-x-6 mt-2">
              <label class="flex items-center">
                <input type="radio" name="financingPreference" value="cash" class="mr-2" required>
                <span>Cash</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="financingPreference" value="finance" class="mr-2" required>
                <span>Finance</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="financingPreference" value="lease" class="mr-2" required>
                <span>Lease</span>
              </label>
            </div>
            <div class="form-error" id="financing-preference-error"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label" for="name">Full Name *</label>
              <input type="text" id="name" name="name" class="form-input" placeholder="Your full name" required>
              <div class="form-error" id="name-error"></div>
            </div>
            
            <div>
              <label class="form-label" for="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" class="form-input" placeholder="(+234) 803-123-4567" required>
              <div class="form-error" id="phone-error"></div>
            </div>
          </div>

          <div>
            <label class="form-label" for="email">Email Address *</label>
            <input type="email" id="email" name="email" class="form-input" placeholder="your@email.com" required>
            <div class="form-error" id="email-error"></div>
          </div>

          <div>
            <label class="form-label" for="additional-notes">Additional Notes</label>
            <textarea id="additional-notes" name="additionalNotes" class="form-input" rows="3" placeholder="Any specific requirements or questions..."></textarea>
          </div>

          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" id="cancel-quote" class="btn-outline">Cancel</button>
            <button type="submit" id="submit-quote" class="btn-primary">
              <span class="submit-text">Get Quote</span>
              <span class="loading-spinner hidden"></span>
            </button>
          </div>
        </form>
      </div>
    `;

    this.overlay.appendChild(modalContent);
    document.body.appendChild(this.overlay);
    this.modal = modalContent;
    this.form = modalContent.querySelector('#quote-form');
  }

  private attachEventListeners(): void {
    // Open modal buttons
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('open-quote-modal') || target.closest('.open-quote-modal')) {
        e.preventDefault();
        this.open();
      }
    });

    // Close modal events
    const closeBtn = document.getElementById('close-quote-modal');
    const cancelBtn = document.getElementById('cancel-quote');
    
    closeBtn?.addEventListener('click', () => this.close());
    cancelBtn?.addEventListener('click', () => this.close());
    
    this.overlay?.addEventListener('click', (e: Event) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Form submission
    this.form?.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Real-time validation
    this.form?.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.validateField(target.name, target.value);
    });

    // Escape key to close
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  private validateField(fieldName: string, value: string): boolean {
    const errorElement = document.getElementById(`${fieldName.replace(/([A-Z])/g, '-$1').toLowerCase()}-error`);
    let error = '';

    switch (fieldName) {
      case 'carBrand':
        if (!value) error = 'Please select a car brand';
        break;
      case 'carModel':
        if (!value.trim()) error = 'Please enter a car model';
        break;
      case 'year':
        if (!value) error = 'Please select a year';
        break;
      case 'budgetRange':
        if (!value) error = 'Please select a budget range';
        break;
      case 'name':
        if (!value.trim()) error = 'Please enter your full name';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '');
        if (!value.trim()) error = 'Please enter your phone number';
        else if (phoneDigits.length < 10 || (phoneDigits.startsWith('234') && phoneDigits.length !== 13) || (!phoneDigits.startsWith('234') && phoneDigits.length !== 11)) {
          error = 'Please enter a valid Nigerian phone number';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = 'Please enter your email address';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address';
        break;
    }

    if (errorElement) {
      errorElement.textContent = error;
    }

    return !error;
  }

  private validateForm(): ValidationResult {
    const formData = new FormData(this.form!);
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate all fields
    const requiredFields = ['carBrand', 'carModel', 'year', 'budgetRange', 'condition', 'financingPreference', 'name', 'phone', 'email'];
    
    requiredFields.forEach(field => {
      const value = formData.get(field) as string || '';
      if (!this.validateField(field, value)) {
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  private async handleSubmit(): Promise<void> {
    if (this.isSubmitting) return;

    const validation = this.validateForm();
    if (!validation.isValid) {
      return;
    }

    this.setSubmitting(true);

    try {
      const formData = new FormData(this.form!);
      const quoteData: QuoteFormData = {
        carBrand: formData.get('carBrand') as string,
        carModel: formData.get('carModel') as string,
        year: formData.get('year') as string,
        condition: formData.get('condition') as 'new' | 'used' | 'certified',
        budgetRange: formData.get('budgetRange') as string,
        financingPreference: formData.get('financingPreference') as 'cash' | 'finance' | 'lease',
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        additionalNotes: formData.get('additionalNotes') as string || undefined
      };

      // Simulate API call
      await this.submitQuote(quoteData);
      
      this.showSuccess();
      setTimeout(() => {
        this.close();
        this.resetForm();
      }, 2000);

    } catch (error) {
      console.error('Quote submission error:', error);
      this.showError('Failed to submit quote. Please try again.');
    } finally {
      this.setSubmitting(false);
    }
  }

  private async submitQuote(data: QuoteFormData): Promise<void> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          console.log('Quote submitted:', data);
          resolve();
        } else {
          reject(new Error('Simulated API error'));
        }
      }, 1500);
    });
  }

  private setSubmitting(submitting: boolean): void {
    this.isSubmitting = submitting;
    const submitBtn = document.getElementById('submit-quote');
    const submitText = submitBtn?.querySelector('.submit-text');
    const spinner = submitBtn?.querySelector('.loading-spinner');

    if (submitBtn) {
      submitBtn.setAttribute('disabled', submitting.toString());
      submitBtn.classList.toggle('opacity-75', submitting);
    }

    if (submitText && spinner) {
      submitText.classList.toggle('hidden', submitting);
      spinner.classList.toggle('hidden', !submitting);
    }
  }

  private showSuccess(): void {
    const modalContent = this.modal?.querySelector('.p-6');
    if (modalContent) {
      modalContent.innerHTML = `
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Quote Submitted Successfully!</h3>
          <p class="text-gray-600">We'll contact you within 24 hours with your personalized quote.</p>
        </div>
      `;
    }
  }

  private showError(message: string): void {
    const existingError = document.querySelector('.quote-error');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'quote-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.textContent = message;
    
    this.form?.prepend(errorDiv);
  }

  private resetForm(): void {
    this.form?.reset();
    // Clear all error messages
    const errorElements = this.form?.querySelectorAll('.form-error');
    errorElements?.forEach(element => {
      element.textContent = '';
    });
  }

  public open(): void {
    this.overlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
      const firstInput = this.form?.querySelector('input, select') as HTMLElement;
      firstInput?.focus();
    }, 100);
  }

  public close(): void {
    this.overlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  public isOpen(): boolean {
    return !this.overlay?.classList.contains('hidden');
  }
}