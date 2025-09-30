export class Navigation {
  private nav: HTMLElement | null = null;
  private menuToggle: HTMLElement | null = null;
  private mobileMenu: HTMLElement | null = null;
  private isMenuOpen: boolean = false;
  private activeSection: string = '';

  constructor() {
    this.init();
  }

  private init(): void {
    this.nav = document.querySelector('nav');
    this.menuToggle = document.getElementById('mobile-menu-toggle');
    this.mobileMenu = document.getElementById('mobile-menu');
    
    this.attachEventListeners();
    this.setupScrollSpy();
    this.handleScroll();
  }

  private attachEventListeners(): void {
    // Mobile menu toggle
    this.menuToggle?.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!this.nav?.contains(target) && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Handle navigation link clicks
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      const navLink = target.closest('.nav-link[href^="#"]') as HTMLAnchorElement;
      
      if (navLink) {
        e.preventDefault();
        const href = navLink.getAttribute('href');
        if (href && href !== '#') {
          this.scrollToSection(href);
          this.closeMobileMenu();
        }
      }
    });

    // Handle scroll events for navbar styling
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  private toggleMobileMenu(): void {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  private openMobileMenu(): void {
    this.isMenuOpen = true;
    this.mobileMenu?.classList.remove('hidden');
    this.mobileMenu?.classList.add('animate-fade-in');
    
    // Update hamburger icon
    const hamburgerIcon = this.menuToggle?.querySelector('.hamburger-icon');
    const closeIcon = this.menuToggle?.querySelector('.close-icon');
    
    hamburgerIcon?.classList.add('hidden');
    closeIcon?.classList.remove('hidden');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add aria attributes
    this.menuToggle?.setAttribute('aria-expanded', 'true');
    this.mobileMenu?.setAttribute('aria-hidden', 'false');
  }

  private closeMobileMenu(): void {
    this.isMenuOpen = false;
    this.mobileMenu?.classList.add('hidden');
    this.mobileMenu?.classList.remove('animate-fade-in');
    
    // Update hamburger icon
    const hamburgerIcon = this.menuToggle?.querySelector('.hamburger-icon');
    const closeIcon = this.menuToggle?.querySelector('.close-icon');
    
    hamburgerIcon?.classList.remove('hidden');
    closeIcon?.classList.add('hidden');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Add aria attributes
    this.menuToggle?.setAttribute('aria-expanded', 'false');
    this.mobileMenu?.setAttribute('aria-hidden', 'true');
  }

  private scrollToSection(href: string): void {
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navHeight = this.nav?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update active state immediately
      this.updateActiveSection(targetId);
    }
  }

  private setupScrollSpy(): void {
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0% -60% 0%',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateActiveSection(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  private updateActiveSection(sectionId: string): void {
    if (this.activeSection === sectionId) return;
    
    this.activeSection = sectionId;
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  private handleScroll(): void {
    // Navigation scroll behavior disabled for homepage
    // The navbar remains navy blue with shadow
  }

  // Public methods
  public getCurrentSection(): string {
    return this.activeSection;
  }

  public navigateTo(sectionId: string): void {
    this.scrollToSection(`#${sectionId}`);
  }

  public closeMenu(): void {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  public isOpen(): boolean {
    return this.isMenuOpen;
  }
}