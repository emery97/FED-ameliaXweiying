//Home page hovering images
function changeImage(productId, newImageUrl) {
    const imgElement = document.getElementById(productId + '-img');
    imgElement.src = newImageUrl;
}

function resetImage(productId, originalImageUrl) {
    const imgElement = document.getElementById(productId + '-img');
    imgElement.src = originalImageUrl;
}