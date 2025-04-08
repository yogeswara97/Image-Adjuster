let src, dst;

function onOpenCvReady() {
    console.log("OpenCV.js is ready");
}

document.getElementById("imageUpload").addEventListener("change", function (e) {
    const imgElement = new Image();
    imgElement.src = URL.createObjectURL(e.target.files[0]);
    imgElement.onload = function () {
        let inputCanvas = document.getElementById("inputCanvas");
        let outputCanvas = document.getElementById("outputCanvas");
        let ctx = inputCanvas.getContext("2d");

        inputCanvas.width = imgElement.width;
        inputCanvas.height = imgElement.height;
        outputCanvas.width = imgElement.width;
        outputCanvas.height = imgElement.height;

        ctx.drawImage(imgElement, 0, 0);

        src = cv.imread(inputCanvas);
        dst = new cv.Mat();
        src.copyTo(dst);
        cv.imshow("outputCanvas", dst);
    };
});

// Brightness Slider
document.getElementById("brightness").addEventListener("input", function (e) {
    if (!src) return;

    let brightnessValue = parseInt(e.target.value);
    document.getElementById("brightValue").textContent = brightnessValue;


    let contrastValue = parseFloat(document.getElementById("contrast").value);

    src.convertTo(dst, -1, contrastValue, brightnessValue);
    cv.imshow("outputCanvas", dst);
});

// Contrast Slider
document.getElementById("contrast").addEventListener("input", function (e) {
    if (!src) return;

    let contrastValue = parseFloat(e.target.value);
    document.getElementById("contrastValue").textContent = contrastValue.toFixed(1);

    let brightnessValue = parseInt(document.getElementById("brightness").value);

    src.convertTo(dst, -1, contrastValue, brightnessValue);
    cv.imshow("outputCanvas", dst);
});

// Save Image Button
document.getElementById('saveButton').addEventListener("click", function(){
    if (!dst || dst.empty()) {
        alert('Please upload an image first!');
        return;
    }

    let outputCanvas = document.getElementById('outputCanvas');
    let dataURL = outputCanvas.toDataURL('image/png');
    let downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'adjusted_image.png';
    downloadLink.click();
    
})