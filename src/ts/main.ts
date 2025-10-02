import '../styles/main.css';
import { QuoteModal } from './components/QuoteModal.js';
import { Navigation } from './components/Navigation.js';
import { ContactForm } from './components/ContactForm.js';

class BossDealer {
  private quoteModal!: QuoteModal;
  private navigation!: Navigation;
  private contactForm: ContactForm | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  private initialize(): void {
    // Initialize components
    this.quoteModal = new QuoteModal();
    this.navigation = new Navigation();
    
    // Only initialize contact form if on contact page
    if (document.getElementById('contact-form')) {
      this.contactForm = new ContactForm();
    }

    // Initialize animations
    this.initializeAnimations();
    
    // Initialize scroll effects
    this.initializeScrollEffects();
    
    // Initialize other features
    this.initializeTestimonials();
    this.initializeCounters();
  }

  private initializeAnimations(): void {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with fade-in-on-scroll class
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  private initializeScrollEffects(): void {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallaxEffects();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private updateParallaxEffects(): void {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    
    parallaxElements.forEach((element) => {
      const rate = scrolled * -0.5;
      (element as HTMLElement).style.transform = `translateY(${rate}px)`;
    });
  }

  private initializeTestimonials(): void {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;

    let currentSlide = 0;
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    if (totalSlides <= 1) return;

    const nextSlide = () => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % totalSlides;
      slides[currentSlide].classList.add('active');
    };

    // Auto-advance testimonials every 5 seconds
    setInterval(nextSlide, 5000);

    // Add navigation buttons if they exist
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    prevBtn?.addEventListener('click', () => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      slides[currentSlide].classList.add('active');
    });

    nextBtn?.addEventListener('click', nextSlide);
  }

  private initializeCounters(): void {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target as HTMLElement;
          this.animateCounter(counter);
          observer.unobserve(counter);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  }

  private animateCounter(element: HTMLElement): void {
    const target = parseInt(element.getAttribute('data-target') || '0');
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * target);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  }

  // Public methods for external access
  public openQuoteModal(): void {
    this.quoteModal.open();
  }

  public getCurrentSection(): string {
    return this.navigation.getCurrentSection();
  }

  public navigateToSection(sectionId: string): void {
    this.navigation.navigateTo(sectionId);
  }

  public getContactForm(): ContactForm | null {
    return this.contactForm;
  }
}

// Initialize the application
const app = new BossDealer();

// Make app globally available for debugging
(window as any).BossDealer = app;

// Export for module systems
export default BossDealer;