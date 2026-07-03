/**
 * The Responsive Architecture - Interactivity Controller
 * DecodeLabs Internship Program 2026
 * Native Vanilla ES6 JavaScript for UI state changes and keyboard compliance
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initCardInteractivity();
  initFormBridge();
  initProjectModal();
});

/**
 * Initializes the responsive navigation drawer toggle behavior.
 * Manages standard ARIA roles and expands state transitions.
 *
 * @returns {void}
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  // Toggle mobile navigation when hamburger button is clicked
  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    
    // Toggle active classes and accessibility states
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('nav-active');
  });

  // Closes navigation menu when a link inside is clicked (useful on small devices)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('nav-active');
    });
  });

  // Closes the menu if focus leaves the navigation structure (WCAG 2.1 compliance)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('nav-active')) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('nav-active');
      toggleBtn.focus();
    }
  });
}

/**
 * Initializes the card hover and focus states, including the active interactive trigger.
 * Handles both click interactions and keydown events for keyboards.
 *
 * @returns {void}
 */
function initCardInteractivity() {
  const cards = document.querySelectorAll('.card');

  if (!cards.length) return;

  cards.forEach(card => {
    const actionBtn = card.querySelector('.btn-card-action');
    
    // Function to handle the active selection style
    const toggleCardState = () => {
      // Clear active classes from other sibling cards to focus current selection
      cards.forEach(c => {
        if (c !== card) c.classList.remove('is-active');
      });
      card.classList.toggle('is-active');
    };

    if (actionBtn) {
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid double bubbling trigger
        toggleCardState();
      });
    }

    // Direct card wrapper click toggle for touch friendliness
    card.addEventListener('click', toggleCardState);

    // Support keyboard activation on cards (Enter key)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        toggleCardState();
      }
    });
  });
}

/**
 * Initializes the form submission event listener and bridges
 * the frontend with the backend REST API. It applies the "Shield"
 * defensive programming pattern to validate inputs client-side,
 * prevent server overload, manage button loading states, and handle
 * connection failures gracefully.
 *
 * @returns {void}
 */
function initFormBridge() {
  const form = document.getElementById('consultation-form');
  const statusContainer = document.getElementById('form-status');

  if (!form || !statusContainer) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Clear previous error messages and reset styles
    statusContainer.hidden = true;
    statusContainer.className = 'form-status';
    statusContainer.textContent = '';
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => input.classList.remove('is-invalid'));

    // Extract values
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');
    const messageInput = document.getElementById('message');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const ageVal = ageInput.value.trim();
    const message = messageInput.value.trim();

    // 1. FRONTEND SHIELD: Pre-flight validation before network dispatch
    const errors = [];

    if (!name) {
      errors.push('Full name is required.');
      nameInput.classList.add('is-invalid');
    }

    if (!email) {
      errors.push('Email address is required.');
      emailInput.classList.add('is-invalid');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please provide a valid email format.');
        emailInput.classList.add('is-invalid');
      }
    }

    if (!ageVal) {
      errors.push('Age is required.');
      ageInput.classList.add('is-invalid');
    } else {
      const age = parseInt(ageVal, 10);
      if (isNaN(age) || age < 18) {
        errors.push('You must be at least 18 years old to submit this form.');
        ageInput.classList.add('is-invalid');
      }
    }

    if (!message) {
      errors.push('Message is required.');
      messageInput.classList.add('is-invalid');
    }

    // If pre-flight validations fail, abort and display messages
    if (errors.length > 0) {
      statusContainer.textContent = errors.join(' ');
      statusContainer.classList.add('error');
      statusContainer.hidden = false;
      return;
    }

    // Disable submit controls during processing to shield against double clicks
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // 2. NETWORK SHIELD: Try/catch wrapper for HTTP dispatch
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          age: parseInt(ageVal, 10)
        })
      });

      const responseData = await response.json().catch(() => ({}));

      // Validate HTTP response status
      if (!response.ok) {
        const errorMsg = responseData.error || `Server responded with status ${response.status}`;
        throw new Error(errorMsg);
      }

      // Clear inputs and present success indication
      statusContainer.textContent = 'Project consultation request submitted successfully!';
      statusContainer.classList.add('success');
      statusContainer.hidden = false;
      form.reset();

    } catch (networkError) {
      // Capture server validations (e.g. duplicate email) or network offline errors
      statusContainer.textContent = `Submission failed: ${networkError.message}`;
      statusContainer.classList.add('error');
      statusContainer.hidden = false;
    } finally {
      // Re-enable submission controls once request settles
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

/**
 * Dynamic mapping details for the featured projects.
 * Maps project names to their extensive case study logs.
 * @type {Object<string, string>}
 */
const PROJECT_DETAILS = {
  'Kinetic Pavilions': 'Our Kinetic Pavilions utilize solar-tracking smart panels that adjust shading dynamically. Over a 12-month period, these structures demonstrated a 34% reduction in peak HVAC consumption and gathered clean electricity to feed back into the community grid.',
  'Eco-Adapt Shells': 'Eco-Adapt Shells are self-ventilating structural envelopes constructed from custom biopolymers. These organic shell designs contract during cold, damp conditions to retain heat, and expand under high humidity to maximize structural natural ventilation.',
  'Parametric Hubs': 'Parametric Hubs use computational geometry to optimize sunlight distribution, acoustic pathways, and modular workspace density. The result is a fluid structural ecosystem that scales and restructures along with evolving community needs.'
};

/**
 * Initializes the interactive project details modal dialog.
 * Registers click handlers on "Learn More" triggers and handles Escape key closing,
 * modal backdrop overlay dismissal, scroll locks, and ARIA attributes updates.
 *
 * @returns {void}
 */
function initProjectModal() {
  const overlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const modalContainer = overlay?.querySelector('.modal-container');

  if (!overlay || !closeBtn || !modalContainer) return;

  const modalImg = document.getElementById('modal-image');
  const modalTag = document.getElementById('modal-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');

  const learnMoreButtons = document.querySelectorAll('.btn-card-action');

  /**
   * Opens the project details modal with dynamic data injection.
   *
   * @param {HTMLElement} cardElement - The target parent card article element.
   * @returns {void}
   */
  const openModal = (cardElement) => {
    const titleText = cardElement.querySelector('.card-title')?.textContent || '';
    const tagText = cardElement.querySelector('.card-tag')?.textContent || '';
    const imgSrc = cardElement.querySelector('.card-image')?.src || '';
    const imgAlt = cardElement.querySelector('.card-image')?.alt || '';

    // Fetch deep description from our structural mapping or fallback to card text
    const deepDesc = PROJECT_DETAILS[titleText] || cardElement.querySelector('.card-text')?.textContent || '';

    // Inject data
    modalImg.src = imgSrc;
    modalImg.alt = imgAlt;
    modalTag.textContent = tagText;
    modalTitle.textContent = titleText;
    modalDesc.textContent = deepDesc;

    // Show modal and apply styling triggers
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalContainer.focus();
  };

  /**
   * Closes the project details modal and returns focus.
   *
   * @returns {void}
   */
  const closeModal = () => {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  // Wire event handlers to all "Learn More" buttons
  learnMoreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentCard = btn.closest('.card');
      if (parentCard) openModal(parentCard);
    });
  });

  // Wire close buttons
  closeBtn.addEventListener('click', closeModal);

  // Close when clicking outside container (overlay backdrop)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Accessibility: Listen for Escape key down
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) {
      closeModal();
    }
  });
}
