//Home page hovering images
document.addEventListener("DOMContentLoaded", function() {
    var productImages = document.querySelectorAll('.product-image');
  
    productImages.forEach(function(img) {
      // Preload hover images to reduce flickering on hover
      const hoverImageSrc = img.getAttribute('data-hover');
      const hoverImage = new Image();
      hoverImage.src = hoverImageSrc;
  
      var originalSrc = img.src;
  
      img.addEventListener('mouseenter', function() {
        img.src = hoverImageSrc;
      });
  
      img.addEventListener('mouseleave', function() {
        img.src = originalSrc;
      });
    });
  });
  