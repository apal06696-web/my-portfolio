// Minimal interactivity: nav toggle, contact form, feedback handling, dynamic year
document.addEventListener('DOMContentLoaded', function(){
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  if (toggle && nav) {
    toggle.addEventListener('click', ()=>{
      const shown = nav.style.display === 'flex';
      nav.style.display = shown ? '' : 'flex';
      nav.style.flexDirection = 'column';
    });
  }

  // Set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form (existing)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = new FormData(form);
      // Simulate API send
      if (status) status.textContent = 'Sending…';
      setTimeout(()=>{
        if (status) status.textContent = 'Thanks! Your message has been received.';
        form.reset();
        setTimeout(()=> { if (status) status.textContent = ''; }, 5000);
      }, 800);
      console.log('Contact form data:', Object.fromEntries(data.entries()));
    });
  }

  // Feedback form: save to localStorage and render
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackStatus = document.getElementById('formStatusFeedback');
  const feedbackListEl = document.getElementById('feedbackList');

  function readFeedbacks(){
    try {
      const raw = localStorage.getItem('feedbacks');
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn('Could not parse feedbacks from storage', err);
      return [];
    }
  }

  function saveFeedback(feedback){
    const list = readFeedbacks();
    list.unshift(feedback); // newest first
    localStorage.setItem('feedbacks', JSON.stringify(list));
  }

  function renderFeedbacks(limit = 20){
    if (!feedbackListEl) return;
    const list = readFeedbacks().slice(0, limit);
    if (list.length === 0) {
      feedbackListEl.innerHTML = '<p class="lead">No feedback yet — be the first to leave a note.</p>';
      return;
    }
    feedbackListEl.innerHTML = list.map(f => `
      <article class="card" style="margin-bottom:.8rem;padding:0.75rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
          <strong>${escapeHtml(f.name || 'Anonymous')}</strong>
          <small style="color:var(--muted)">${new Date(f.ts).toLocaleString()}</small>
        </div>
        <div style="color:var(--muted);margin-bottom:.5rem">${escapeHtml(f.message)}</div>
        <div style="font-size:.9rem;color:var(--accent)">Rating: ${escapeHtml(String(f.rating || '—'))}</div>
      </article>
    `).join('');
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(feedbackForm);
      const feedback = {
        name: fd.get('name') || 'Anonymous',
        email: fd.get('email') || '',
        rating: fd.get('rating') || '',
        message: fd.get('message') || '',
        ts: Date.now()
      };
      saveFeedback(feedback);
      if (feedbackStatus) feedbackStatus.textContent = 'Thanks — your feedback has been saved.';
      feedbackForm.reset();
      renderFeedbacks();
      setTimeout(()=> { if (feedbackStatus) feedbackStatus.textContent = ''; }, 5000);
      console.log('Saved feedback:', feedback);
    });
  }

  // Attempt to send feedback to email or endpoint
  // If you'd like server-side delivery, set a global variable `FEEDBACK_ENDPOINT`
  // (e.g. created by Formspree: https://formspree.io/) — the script will POST JSON there.
  // Otherwise the script will open the user's mail client with a prefilled message to the
  // provided email below (quick fallback). You can edit the recipient as needed.
  const FALLBACK_EMAIL = 'apal06696@gmail.com';
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function(e){
      // The form submit handler above already runs; this second listener will try to deliver the message
      // without altering storage behavior. Note: if you don't want the mail client to open, remove the fallback.
      const fd = new FormData(feedbackForm);
      const payload = {
        name: fd.get('name') || 'Anonymous',
        email: fd.get('email') || '',
        rating: fd.get('rating') || '',
        message: fd.get('message') || '',
        ts: Date.now()
      };

      // Prefer an explicit endpoint if defined
      const endpoint = (window.FEEDBACK_ENDPOINT && String(window.FEEDBACK_ENDPOINT).trim()) || (feedbackForm.dataset && feedbackForm.dataset.endpoint) || '';
      if (endpoint) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            console.log('Feedback delivered to endpoint');
            const s = document.getElementById('formStatusFeedback');
            if (s) s.textContent = 'Feedback sent successfully.';
          } else {
            console.warn('Endpoint did not accept feedback', res.status);
            // fallback to mail client
            openMailClient(payload);
          }
        } catch (err) {
          console.warn('Could not send feedback to endpoint', err);
          openMailClient(payload);
        }
      } else {
        // No endpoint configured — open mail client with prefilled content
        openMailClient(payload);
      }

      function openMailClient(p) {
        try {
          const subject = encodeURIComponent('Website feedback from ' + (p.name || 'Anonymous'));
          const body = encodeURIComponent(
            `Name: ${p.name}\nEmail: ${p.email}\nRating: ${p.rating}\n\nMessage:\n${p.message}`
          );
          // Using window.location.href will open the user's mail client to send the message
          window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
        } catch (err) {
          console.error('Could not open mail client', err);
        }
      }
    });
  }

  // Render feedbacks if list container exists
  renderFeedbacks();

  // Animate skill bars (simple on load)
  document.querySelectorAll('.progress-fill').forEach(el=>{
    const w = el.style.width || '0%';
    requestAnimationFrame(()=> el.style.width = w);
  });
});