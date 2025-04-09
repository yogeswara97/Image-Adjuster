// Declare reusable DOM elements and variables at the top
let src, dst;
const imageUpload = document.getElementById("imageUpload");

const brightnessSlider = document.getElementById("brightness");
const contrastSlider = document.getElementById("contrast");
const saturationSlider = document.getElementById("saturation");
const hueSlider = document.getElementById("hue");

const brightValue = document.getElementById("brightValue");
const contrastValue = document.getElementById("contrastValue");
const saturationValue = document.getElementById("saturationValue");
const hueValue = document.getElementById("hueValue");

const inputCanvas = document.getElementById("inputCanvas");
const outputCanvas = document.getElementById("outputCanvas");
const saveButton = document.getElementById("saveButton");


function toggleSliders(disabled) {
    brightnessSlider.disabled = disabled;
    contrastSlider.disabled = disabled;
    saturationSlider.disabled = disabled;
    hueSlider.disabled = disabled;
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
        saturationSlider.value = 1;
        hueSlider.value = 0;
        brightValue.textContent = 0;
        contrastValue.textContent = "1.0";
        saturationValue.textContent = "1.0";
        hueValue.textContent = "0";

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
    const saturation = parseFloat(saturationSlider.value);
    const hue = parseInt(hueSlider.value);

    let hsv = new cv.Mat();
    cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV);

    let channels = new cv.MatVector();
    cv.split(hsv, channels);

    let hueChannel = channels.get(0);
    let hueMat = new cv.Mat();
    hueChannel.convertTo(hueMat, -1, 1, hue);

    let satChannel = channels.get(1);
    let satMat = new cv.Mat();
    satChannel.convertTo(satMat, -1, saturation, 0);

    let adjustedChannels = new cv.MatVector();
    adjustedChannels.push_back(hueMat);
    adjustedChannels.push_back(satMat);
    adjustedChannels.push_back(channels.get(2)); 
    
    cv.merge(adjustedChannels, hsv);

    cv.cvtColor(hsv, dst, cv.COLOR_HSV2RGB);
    dst.convertTo(dst, -1, contrast, brightness);

    cv.imshow("outputCanvas", dst);
    
    hsv.delete();
    channels.delete();
    hueMat.delete();
    satMat.delete();
    adjustedChannels.delete();
}

saturationSlider.addEventListener("input", function (e) {
    saturationValue.textContent = parseFloat(e.target.value).toFixed(1);
    applyAdjustments();
});

hueSlider.addEventListener("input", function (e) {
    hueValue.textContent = e.target.value;
    applyAdjustments();
});


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