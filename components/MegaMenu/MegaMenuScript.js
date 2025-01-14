// megaMenu.js - A module for handling mega menu logic

export class MegaMenuScript {
	constructor() {
	  this.toggleSel = '.js-mega-toggle';
	  this.toggleEl = '.mega-toggle';
	  this.focusableSels = 'a, button, input, textarea, [tabindex="-1"]';
	  this.hasOpenMegaClass = 'has-open-mega';
	  this.openClass = 'open';
	  this.openSel = `.${this.openClass}`;
	  this.transDur = this.getTransitionDuration();
	  this.siteHeader = document.getElementById('js-header');
	  this.navIDs = ['js-nav--main--mega', 'js-nav--main--tray', 'js-nav--main-ctas--mega', 'js-nav--main-ctas--tray'];
  
	  this.navIDs.forEach((navID) => this.initNav(navID));
	}
  
	getTransitionDuration() {
	  const transDur = window.getComputedStyle(document.documentElement).getPropertyValue('--trans-dur');
	  return !isNaN(parseFloat(transDur)) ? parseFloat(transDur) * 1000 : 0;
	}
  
	initNav(navID) {
	  const allToggleSels = document.querySelectorAll(`#${navID} ${this.toggleSel}`);
	  const allToggleEls = document.querySelectorAll(`#${navID} ${this.toggleEl}`);
	  let megaHasOpenedWithinThisNav = false;
	  let currentAction = false;
  
	  allToggleSels.forEach((toggle) => {
		toggle.addEventListener('click', (e) => {
		  e.preventDefault();
		  this.setMega(toggle, 'toggle', (action) => {
			if (action === 'open') {
			  this.siteHeader.classList.add(this.hasOpenMegaClass);
			} else {
			  this.siteHeader.classList.remove(this.hasOpenMegaClass);
			}
		  });
  
		  if (!megaHasOpenedWithinThisNav) {
			megaHasOpenedWithinThisNav = true;
  
			window.addEventListener('click', (e) => {
			  if (!document.getElementById(navID).contains(e.target)) {
				currentAction = 'close';
				this.closeActiveMega(null, () => {
				  currentAction = false;
				  this.siteHeader.classList.remove(this.hasOpenMegaClass);
				});
			  }
			});
		  }
		});
	  });
	}
  
	setMega(toggle, action, callback) {
	  toggle = this.getMetaEl(toggle);
	  if (this.currentAction) return;
	  this.currentAction = 'tbd'; // Prevent concurrent actions
  
	  requestAnimationFrame(() => {
		const submenu = toggle.nextElementSibling;
		if (typeof action !== 'string' || action === 'toggle') {
		  action = toggle.classList.contains(this.openClass) ? 'close' : 'open';
		}
  
		this.currentAction = action;
		const focusTarget = action === 'open' ? submenu.querySelector(this.focusableSels) : toggle;
  
		requestAnimationFrame(() => {
		  if (action === 'open') {
			let closeDelayIfApplicable = this.transDur;
			let openDelayIfApplicable = this.transDur;
  
			this.closeActiveMega(
			  (foundActive) => {
				if (!foundActive) openDelayIfApplicable = 0;
				setTimeout(() => {
				  toggle.classList.add(this.openClass);
				  toggle.setAttribute('aria-expanded', 'true');
				  submenu.classList.add(this.openClass);
				  submenu.setAttribute('aria-hidden', 'false');
				  this.currentAction = false;
				}, openDelayIfApplicable);
			  },
			  (foundActive) => {
				this.currentAction = false;
			  },
			  closeDelayIfApplicable
			);
		  } else {
			this.closeMega(toggle, submenu, null, () => {
			  this.currentAction = false;
			});
		  }
  
		  if (focusTarget) {
			if (action === 'close') {
			  if (document.activeElement) document.activeElement.blur();
			  focusTarget.focus();
			}
		  }
  
		  if (typeof callback === 'function') {
			callback(action);
		  }
		});
	  });
	}
  
	getMetaEl(toggle) {
	  return toggle.closest('.mega-toggle');
	}
  
	hasActiveMega() {
	  return !!this.getActiveToggle().length;
	}
  
	getActiveToggle() {
	  return document.querySelector(`${this.toggleEl}${this.openSel}`);
	}
  
	closeActiveMega(before, after, closeDelay) {
	  const activeToggle = this.getActiveToggle();
	  if (activeToggle) {
		const activeSubmenu = activeToggle.nextElementSibling;
		this.closeMega(activeToggle, activeSubmenu, before, after, closeDelay);
	  } else {
		const foundActive = false;
		if (typeof before === 'function') before(foundActive);
		if (typeof after === 'function') after(foundActive);
	  }
	}
  
	closeMega(toggle, submenu, before, after, closeDelay) {
	  const foundActive = true;
	  const delay = closeDelay || 0;
  
	  if (typeof before === 'function') before(foundActive);
  
	  setTimeout(() => {
		requestAnimationFrame(() => {
		  toggle.classList.remove(this.openClass);
		  toggle.setAttribute('aria-expanded', 'false');
		  submenu.classList.remove(this.openClass);
		  submenu.setAttribute('aria-hidden', 'true');
		  if (typeof after === 'function') after(foundActive);
		});
	  }, delay);
	}
  }
  
  export default MegaMenuScript;
  