// Get the necessary elements
const carousel = document.querySelector('.carousel');
const slides = Array.from(carousel.querySelectorAll('.slide'));
const prevButton = carousel.querySelector('.prev');
const nextButton = carousel.querySelector('.next');

// Set the initial slide
let currentSlide = 0;
slides[currentSlide].classList.add('active');

// Function to go to the previous slide
function prevSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
}

// Function to go to the next slide
function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

// Event listeners for the navigation buttons
prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);