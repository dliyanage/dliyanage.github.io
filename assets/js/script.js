// script.js — robust version
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const elementToggleFunc = (elem) => elem.classList.toggle('active');

  // small helpers
  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));

  /* --------------------------
     Sidebar
  ---------------------------*/
  const sidebar = q('[data-sidebar]');
  const sidebarBtn = q('[data-sidebar-btn]');
  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
  } else if (sidebarBtn && !sidebar) {
    console.warn('Sidebar button found but no [data-sidebar] element exists.');
  }

  /* --------------------------
     Custom select + filter
  ---------------------------*/
  const select = q('[data-select]');
  const selectItems = qa('[data-select-item]');
  const selectValue = q('[data-select-value]'); // ensure your HTML uses data-select-value
  const filterBtn = qa('[data-filter-btn]');
  const filterItems = qa('[data-filter-item]');

  if (select) {
    select.addEventListener('click', function () { elementToggleFunc(this); });
  }

  selectItems.forEach(item => {
    item.addEventListener('click', function () {
      const selectedValue = this.textContent.trim().toLowerCase();
      if (selectValue) selectValue.textContent = this.textContent.trim();
      if (select) elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  });

  function filterFunc(selectedValue) {
    if (!filterItems.length) return;
    filterItems.forEach(fi => {
      const cat = (fi.dataset.category || '').trim().toLowerCase();
      if (selectedValue === 'all' || selectedValue === cat) {
        fi.classList.add('active');
      } else {
        fi.classList.remove('active');
      }
    });
  }

  if (filterBtn.length) {
    let lastClickedBtn = filterBtn[0];
    filterBtn.forEach(btn => {
      btn.addEventListener('click', function () {
        const selectedValue = this.textContent.trim().toLowerCase();
        if (selectValue) selectValue.textContent = this.textContent.trim();
        filterFunc(selectedValue);
        if (lastClickedBtn) lastClickedBtn.classList.remove('active');
        this.classList.add('active');
        lastClickedBtn = this;
      });
    });
  }

  /* --------------------------
     Contact form validation
  ---------------------------*/
  const form = q('[data-form]');
  const formInputs = qa('[data-form-input]');
  const formBtn = q('[data-form-btn]');

  if (form && formInputs.length && formBtn) {
    formInputs.forEach(inp => {
      inp.addEventListener('input', () => {
        try {
          if (form.checkValidity()) formBtn.removeAttribute('disabled');
          else formBtn.setAttribute('disabled', '');
        } catch (err) {
          console.warn('Form validation threw an error:', err);
        }
      });
    });
  } else if (form || formInputs.length || formBtn) {
    console.warn('Form wiring incomplete. Check presence of data-form, data-form-input, data-form-btn.');
  }

  /* --------------------------
     Page navigation (fixed)
     - robust matching (trim + lowercase)
     - removes active from all before setting
  ---------------------------*/
  const navigationLinks = qa('[data-nav-link]');
  const pages = qa('[data-page]');

  if (navigationLinks.length && pages.length) {
    navigationLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const linkText = this.textContent.trim().toLowerCase();

        // clear all
        navigationLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        // find page by matching data-page (trim + lower)
        const matchedPage = pages.find(p => (p.dataset.page || '').trim().toLowerCase() === linkText);

        if (matchedPage) {
          matchedPage.classList.add('active');
          this.classList.add('active');
          window.scrollTo(0, 0);
        } else {
          console.warn(`No page matched for nav link "${linkText}". Check your data-page values.`);
        }
      });
    });
  } else {
    console.warn('Navigation setup incomplete. Found navigationLinks:', navigationLinks.length, 'pages:', pages.length);
  }

  // If no page is active, activate the first one (graceful default)
  if (pages.length && !pages.some(p => p.classList.contains('active'))) {
    pages[0].classList.add('active');
    if (navigationLinks[0]) navigationLinks[0].classList.add('active');
    console.info('No active page found — defaulted to first page.');
  }
});
