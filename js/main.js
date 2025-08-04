document.addEventListener('DOMContentLoaded', function() {
  const topnav = document.querySelector('.topnav');
  const navLinks = topnav.querySelector('.nav-links');
  const dropdowns = topnav.querySelectorAll('.dropdown');

  function toggleMenu() {
    topnav.classList.toggle('expanded');
    navLinks.classList.toggle('show');
    console.log('Menu toggled. Expanded:', topnav.classList.contains('expanded'));
    if (!topnav.classList.contains('expanded')) {
      closeAllDropdowns();
    }
  }

  function closeAllDropdowns() {
    dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
  }

  topnav.addEventListener('click', function(event) {
    const target = event.target;
    
    // Handle menu icon click
    if (target.classList.contains('icon') || target.closest('.icon')) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
      return;
    }
    
    // Dropdown handling code
    if (target.classList.contains('dropdown-btn') && window.innerWidth <= 768) {
      event.preventDefault();
      const dropdown = target.closest('.dropdown');
      if (dropdown.classList.contains('active')) {
        closeAllDropdowns();
        window.location.href = target.getAttribute('href');
      } else {
        closeAllDropdowns();
        dropdown.classList.add('active');
      }
    }
  });

  document.addEventListener('click', function(event) {
    if (!topnav.contains(event.target)) {
      topnav.classList.remove('expanded');
      navLinks.classList.remove('show');
      closeAllDropdowns();
    }
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      topnav.classList.remove('expanded');
      navLinks.classList.remove('show');
      closeAllDropdowns();
    }
  });

  // Scroll event for navbar
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    topnav.classList.toggle('scrolled', scrollTop > 50);
    lastScrollTop = scrollTop;
  });

  // Animations for the cards
  const animatedCards = document.querySelectorAll('.feature-card, .testimonial-card, .valor-card');
  animatedCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in, .slide-up').forEach(el => observer.observe(el));

  // Testimonials
  const testimonials = [
    { name: 'Maria Silva', text: 'A Resolve Educação transformou minha vida acadêmica. Os professores são incríveis!' },
    { name: 'João Santos', text: 'Graças aos cursos da Resolve, consegui entrar na faculdade dos meus sonhos.' },
    { name: 'Ana Oliveira', text: 'A metodologia inovadora da Resolve fez toda a diferença no meu aprendizado.' }
  ];

  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    testimonialSlider.innerHTML = testimonials.map(testimonial => 
      `<div class="testimonial-card">
        <p>${testimonial.text}</p>
        <h4>${testimonial.name}</h4>
      </div>`
    ).join('');
  }

  // Contact form
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mensagem enviada com sucesso!');
      contactForm.reset();
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // OpenStreetMap implementation
  if (document.getElementById('map')) {
    const map = L.map('map').setView([-22.2887, -42.5341], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const unidades = [
      { name: 'Unidade Nova Friburgo', lat: -22.2733647811062, lng: -42.53241131579316, desc: 'Situada no coração da Serra Fluminense, oferece educação de qualidade com foco no desenvolvimento integral dos estudantes.' },
      { name: 'Unidade Cachoeiras de Macacu', lat: -22.46893999166889, lng: -42.6558394503189, desc: 'Em meio à exuberante natureza, combina inovação pedagógica com um ambiente acolhedor para uma experiência única.' },
      { name: 'Unidade Carmo', lat: -21.931788870643214, lng: -42.60916660430863, desc: 'Localizada em uma cidade de tradições históricas, é um polo de excelência educacional dedicado à formação de cidadãos conscientes.' },
      { name: 'Unidade Casimiro de Abreu', lat: -22.47947505455147, lng: -42.19997671492796, desc: 'Inspirada pelo poeta que dá nome à cidade, estimula a criatividade e o conhecimento com uma educação transformadora.' },
      { name: 'Unidade Cordeiro', lat: -22.025679580860736, lng: -42.36449421964805, desc: 'Promove uma educação moderna e acessível, voltada para o desenvolvimento acadêmico e pessoal dos alunos.' },
      { name: 'Unidade Bom Jardim', lat: -22.14866843415011, lng: -42.42413497546682, desc: 'Referência em ensino de qualidade, aliando tecnologia e tradição para potencializar o aprendizado.' },
      { name: 'Unidade Rio das Ostras', lat: -22.520208733545594, lng: -41.94727660613985, desc: 'Um centro de aprendizado que valoriza a inovação e a excelência acadêmica, proporcionando ensino transformador.' },
      { name: 'Unidade Bonsucesso', lat: -22.263059569904303, lng: -42.78651406012123, desc: 'Combina educação de alta qualidade com um ambiente acolhedor e seguro, onde os alunos encontram suporte para alcançar seus sonhos.' },
      { name: 'Unidade Sete Lagoas', lat: -19.466295648628954, lng: -44.250299104377284, desc: 'Se destaca por sua abordagem pedagógica inovadora e pelo compromisso em formar estudantes preparados para o futuro.' }
    ];

    const bounds = L.latLngBounds(unidades.map(unidade => [unidade.lat, unidade.lng]));
    const unidadesList = document.getElementById('unidades');

    unidades.forEach(unidade => {
      const marker = L.marker([unidade.lat, unidade.lng]).addTo(map)
        .bindPopup(`<strong>${unidade.name}</strong><br>${unidade.desc}`);

      if (unidadesList) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${unidade.name}</strong><span>${unidade.desc}</span>`;
        li.addEventListener('click', () => {
          map.setView([unidade.lat, unidade.lng], 13);
          marker.openPopup();
        });
        unidadesList.appendChild(li);
      }
    });

    map.fitBounds(bounds, { padding: [50, 50] });
  }

});
