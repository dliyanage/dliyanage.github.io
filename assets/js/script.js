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

  // Activate a page by its data-page name. Also syncs the URL hash so tabs are
  // deep-linkable (e.g. .../#dashboards opens the Dashboards tab directly).
  function activatePage(name, opts = {}) {
    const target = (name || '').trim().toLowerCase();
    const matchedPage = pages.find(p => (p.dataset.page || '').trim().toLowerCase() === target);
    if (!matchedPage) return false;

    navigationLinks.forEach(l => l.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    matchedPage.classList.add('active');
    const matchedLink = navigationLinks.find(l => l.textContent.trim().toLowerCase() === target);
    if (matchedLink) matchedLink.classList.add('active');

    if (opts.updateHash !== false && window.location.hash !== '#' + target) {
      history.replaceState(null, '', '#' + target);
    }
    if (opts.scroll !== false) window.scrollTo(0, 0);
    return true;
  }

  if (navigationLinks.length && pages.length) {
    navigationLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        activatePage(this.textContent.trim().toLowerCase());
      });
    });

    // Respond to back/forward navigation and manually edited hashes
    window.addEventListener('hashchange', () => {
      const name = window.location.hash.replace(/^#/, '');
      if (name) activatePage(name, { updateHash: false });
    });

    // On load: open the tab named in the URL hash, otherwise the first tab
    const initial = window.location.hash.replace(/^#/, '');
    if (!initial || !activatePage(initial, { updateHash: false, scroll: false })) {
      const firstName = (pages[0].dataset.page || '').trim().toLowerCase();
      activatePage(firstName, { updateHash: false, scroll: false });
    }
  } else {
    console.warn('Navigation setup incomplete. Found navigationLinks:', navigationLinks.length, 'pages:', pages.length);
  }
});
