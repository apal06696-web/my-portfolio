// Minimal interactivity: nav toggle, contact form, dynamic year
document.addEventListener('DOMContentLoaded', function(){
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', ()=>{
    const shown = nav.style.display === 'flex';
    nav.style.display = shown ? '' : 'flex';
    nav.style.flexDirection = 'column';
  });

  // Set year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Contact form
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(form);
    // Here you'd send to an API. We'll simulate success and clear the form.
    status.textContent = 'Sending…';
    setTimeout(()=>{
      status.textContent = 'Thanks! Your message has been received.';
      form.reset();
      setTimeout(()=> status.textContent = '', 5000);
    }, 800);
    console.log('Contact form data:', Object.fromEntries(data.entries()));
  });

  // Animate skill bars (simple on load)
  document.querySelectorAll('.progress-fill').forEach(el=>{
    const w = el.style.width || '0%';
    requestAnimationFrame(()=> el.style.width = w);
  });
});