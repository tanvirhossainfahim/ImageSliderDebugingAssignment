const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const imageDots = document.getElementById('imageDots');
const search = document.getElementById('search');
// selected image 
let sliders = [];
let options = {
  duration: undefined,
};


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  // check if api return any image
  if(images.length == 0){
    alert(`No images found by the keyword '${search.value}'`);
  }else{
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
let selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    // working with toggle
    element.classList.remove('added');
    sliders.splice(item, 1);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="nextPreviousItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="nextPreviousItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })

  // add image dots
  let dots = '';
  for (let i = 0; i < sliders.length; i++) {
    dots += `<span class="dot" data-index="${i}" onclick="changeItem(${i})"></span>`;
  }
  imageDots.innerHTML = dots;

  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
    console.log(slideIndex)
  }, options.duration);
}

// next previous item
const nextPreviousItem = (index) => {
  changeSlide(slideIndex += index);
  restartTimer();
}

// change slider index 
const changeItem = (index) => {
  slideIndex = index;
  changeSlide(index);
  // restart timer
  restartTimer();
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  // dots list
  const dots = document.querySelectorAll('.dot');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  // removing active class
  dots.forEach(dot => {
    dot.classList.remove('dot-active');
  })

  items[index].style.display = "block"
  // adding active class
  dots[index].classList.add('dot-active');
}

searchBtn.addEventListener('click', submitSearchForm)

// adding Enter press event listener to search input field
search.addEventListener('keydown', function (event) {
  if(event.key == 'Enter'){
    submitSearchForm();
  }
})

// function to prevent minus value and call createSlider
const checkInputAndCreateSlider = () => {
  const duration = document.getElementById('duration').value
  if (duration < 0) {
    alert('Only positive integers are allowed');
  }
  options.duration = document.getElementById('duration').value || 1000;
  createSlider();
  console.log(options)
}

// adding Enter press event listener to duration input field
document.getElementById('duration').addEventListener('keydown', function (event) {
  if (event.key == 'Enter') {
    checkInputAndCreateSlider();
  }
})

sliderBtn.addEventListener('click', checkInputAndCreateSlider)

function submitSearchForm(){
  clearInterval(timer);
  document.querySelector('.main').style.display = 'none';
  if(search.value.length > 0){
    getImages(search.value)
    sliders.length = 0;
  }else{
    alert('Please type something');
  }
}


function restartTimer(){
  clearInterval(timer);
  timer = setInterval(function () {
    slideIndex++;
    console.log(slideIndex)
    changeSlide(slideIndex);
  }, options.duration);
}











