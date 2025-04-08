// Declare reusable DOM elements and variables at the top
let src, dst;
const imageUpload = document.getElementById("imageUpload");
const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const brightValue = document.getElementById("brightValue");
const contrastValue = document.getElementById("contrastValue");
const inputCanvas = document.getElementById("inputCanvas");
const outputCanvas = document.getElementById("outputCanvas");
const saveButton = document.getElementById("saveButton");


function toggleSliders(disabled) {
    brightnessSlider.disabled = disabled;
    contrastSlider.disabled = disabled;
}

imageUpload.addEventListener("change", function (e) {
    const imgElement = new Image();
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    imgElement.onload = function () {
        const ctx = inputCanvas.getContext("2d");

        inputCanvas.width = imgElement.width;
        inputCanvas.height = imgElement.height;
        outputCanvas.width = imgElement.width;
        outputCanvas.height = imgElement.height;

        ctx.drawImage(imgElement, 0, 0);

        // Reset sliders to default values
        brightnessSlider.value = 0;
        contrastSlider.value = 1;
        brightValue.textContent = 0;
        contrastValue.textContent = "1.0";

        src = cv.imread(inputCanvas);
        dst = new cv.Mat();
        src.copyTo(dst);
        cv.imshow("outputCanvas", dst);
        
        toggleSliders(false);
    };
});

function applyAdjustments() {
    if (!src) return;

    const brightness = parseInt(brightnessSlider.value);
    const contrast = parseFloat(contrastSlider.value);

    src.convertTo(dst, -1, contrast, brightness);
    cv.imshow("outputCanvas", dst);
}


brightnessSlider.addEventListener("input", function (e) {
    brightValue.textContent = e.target.value;
    applyAdjustments();
});

contrastSlider.addEventListener("input", function (e) {
    contrastValue.textContent = parseFloat(e.target.value).toFixed(1);
    applyAdjustments();
});

saveButton.addEventListener("click", function () {
    if (!dst || dst.empty()) {
        alert('Please upload an image first!');
        return;
    }

    const dataURL = outputCanvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'adjusted_image.png';
    downloadLink.click();
});