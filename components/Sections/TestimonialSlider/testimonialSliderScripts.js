/* ======================================
   Media Slider Module
   - Powered by Flickity
====================================== */

export class Slider {
    constructor() {
      this.selectors = {
        section: '.js-contains-slider',
        slider: '.js-slider',
        nav: '.js-nav-slider',
        principal: '.js-slider-principal',
        agent: '.js-slider-agent',
        cell: '.js-slider-cell',
        index: '.js-slider-index',
        next: '.js-slider-next',
        prev: '.js-slider-prev',
        pause: '.js-slider-pause',
        play: '.js-slider-play',
        dots: '.js-slider-dots',
        dot: '.js-slider-dot',
        progressBar: '.js-slider-progress-bar'
      };
  
      this.activeClass = 'active';
      this.intsRegex = /\d/g;
  
      this.init();
    }
  
    setOpts(element) {
      const opts = {
        cellSelector: this.selectors.cell
      };
  
      Object.keys(element.dataset).forEach((key) => {
        if (key === 'fade' || key === 'wrapAround' || key === 'pauseAutoPlayOnHover' ||
            key === 'setGallerySize' || key === 'adaptiveHeight' || key === 'prevNextButtons' ||
            key === 'pageDots' || key === 'groupCells' || key === 'contain' || key === 'draggable') {
          opts[key] = element.dataset[key] === 'true';
        } else if (key === 'cellAlign' || key === 'asNavFor') {
          opts[key] = element.dataset[key];
        } else if (key === 'autoPlay' && this.intsRegex.test(element.dataset[key])) {
          opts[key] = parseInt(element.dataset[key], 10);
          this.autoplay = true;
        }
      });
  
      return opts;
    }
  
    pauseSlider(carousel) {
      carousel.pausePlayer();
      this.paused = true;
      this.playEl.style.display = 'block';
      this.pauseEl.style.display = 'none';
    }
  
    playSlider(carousel, autoplay) {
      if (autoplay) {
        carousel.playPlayer();
        this.paused = false;
        this.playEl.style.display = 'none';
        this.pauseEl.style.display = 'block';
      }
    }
  
    init() {
      document.querySelectorAll(this.selectors.section).forEach((section) => {
        const sliders = section.querySelectorAll(this.selectors.slider);
        const navEl = section.querySelector(this.selectors.nav);
  
        const pauseEl = section.querySelector(this.selectors.pause);
        const playEl = section.querySelector(this.selectors.play);
        const nextEl = section.querySelector(this.selectors.next);
        const prevEl = section.querySelector(this.selectors.prev);
        const dots = section.querySelector(this.selectors.dots);
        const progressBar = section.querySelector(this.selectors.progressBar);
  
        const principalEl = section.querySelector(this.selectors.principal);
        const agentEl = section.querySelector(this.selectors.agent);
        const hasPairedSliders = !!principalEl;
  
        let slideIndex = 0;
        let paused = false;
        let autoplay = false;
  
        sliders.forEach((slider) => {
          const opts = this.setOpts(slider);
  
          if (hasPairedSliders) {
            if (slider === principalEl) {
              opts.sync = agentEl;
              this.initiateCarousel(section, opts, this.selectors.principal);
            } else {
              this.initiateAgentCarousel(section, opts);
            }
          } else {
            this.initiateCarousel(section, opts, this.selectors.slider);
          }
        });
  
        if (navEl) {
          this.initiateNavSlider(section, navEl);
        }
  
        if (section.classList.contains('js-testimonials-slider')) {
          this.setupTestimonialSlider(section, principalEl, agentEl, navEl);
        }
  
        if (section.classList.contains('js-collections-slider')) {
          this.setupCollectionSlider(section);
        }
      });
    }
  
    initiateCarousel(section, opts, selector) {
      const sliderEl = section.querySelector(selector);
      const carousel = new Flickity(sliderEl, opts);
  
      const progressBar = section.querySelector(this.selectors.progressBar);
      const nextEl = section.querySelector(this.selectors.next);
      const prevEl = section.querySelector(this.selectors.prev);
  
      if (progressBar) {
        progressBar.style.width = `${100 / carousel.cells.length}%`;
      }
  
      if (nextEl) {
        nextEl.addEventListener('click', () => {
          carousel.next();
          this.pauseSlider(carousel);
        });
      }
  
      if (prevEl) {
        prevEl.addEventListener('click', () => {
          carousel.previous();
          this.pauseSlider(carousel);
        });
      }
  
      carousel.on('change', (index) => {
        slideIndex = index;
        if (progressBar) {
          progressBar.style.left = `${(100 / carousel.cells.length) * index}%`;
        }
      });
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            carousel.playPlayer();
          } else {
            carousel.pausePlayer();
          }
        });
      });
  
      if (opts.autoPlay) {
        observer.observe(sliderEl);
      }
    }
  
    initiateAgentCarousel(section, opts) {
      const sliderEl = section.querySelector(this.selectors.agent);
      new Flickity(sliderEl, opts);
    }
  
    initiateNavSlider(section, navEl) {
      const opts = this.setOpts(navEl);
      const navCarousel = new Flickity(navEl, opts);
  
      const companionCarousel = document.querySelector(opts.asNavFor);
  
      navEl.addEventListener('mouseenter', () => {
        this.pauseSlider(companionCarousel);
      });
  
      navEl.addEventListener('mouseleave', () => {
        this.playSlider(companionCarousel, !!companionCarousel.player.autoPlay);
      });
    }
  
    setupTestimonialSlider(section, principalEl, agentEl, navEl) {
      // Add custom logic for testimonial sliders
    }
  
    setupCollectionSlider(section) {
      // Add custom logic for collection sliders
    }
  }
  