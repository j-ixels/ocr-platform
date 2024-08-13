document.getElementById('imageInput').addEventListener('change', function(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
    }
    
    reader.readAsDataURL(file);
});

document.getElementById('extractTextBtn').addEventListener('click', function() {
    const imagePreview = document.getElementById('imagePreview');
    const extractedTextDiv = document.getElementById('extractedText');
    const downloadTextBtn = document.getElementById('downloadTextBtn');
    const statusDiv = document.getElementById('status'); // added a status div to display feedback
    
    if (imagePreview.querySelector('img')) {
        statusDiv.innerText = 'Extracting text...'; // display extracting text message
        Tesseract.recognize(
            imagePreview.querySelector('img').src,
            'eng',
            {
                logger: (m) => console.log(m)
            }
        ).then(({ data: { text } }) => {
            extractedTextDiv.innerText = text;
            downloadTextBtn.style.display = 'block';
            statusDiv.innerText = 'Text extracted successfully!'; // display success message
            
            downloadTextBtn.addEventListener('click', function() {
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'extracted_text.txt';
                a.click();
                URL.revokeObjectURL(url);
            });
        }).catch((err) => {
            statusDiv.innerText = 'Error extracting text: ' + err.message; // display error message
        });
    } else {
        statusDiv.innerText = 'Please upload an image first.'; // display error message
    }
});
// Get the copy text button
const copyTextBtn = document.getElementById('copyTextBtn');

// Add an event listener to the copy text button
copyTextBtn.addEventListener('click', () => {
    const extractedText = document.getElementById('extractedText').innerText;
    navigator.clipboard.writeText(extractedText);
    document.getElementById('status').innerText = 'Text copied to clipboard!';
});

// Update the status div when the text is extracted
function updateStatus(message) {
    document.getElementById('status').innerText = message;
}

// Call the updateStatus function when the text is extracted
Tesseract.recognize(image)
    .then(result => {
        const extractedText = result.text;
        document.getElementById('extractedText').innerText = extractedText;
        updateStatus('Text extracted successfully!');
        copyTextBtn.style.display = 'block';
    })
    .catch(error => {
        updateStatus('Error extracting text: ' + error.message);
    });
    document.getElementById("get-started").addEventListener("click", function() {
        window.location.href = "#upload-section";
      });
      
      function resizeImage(imageUrl, maxWidth, maxHeight) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
    
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
    
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL());
            };
            img.src = imageUrl;
        });
    }
    function convertToGrayscale(imageDataURL) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
    
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
    
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = data[i + 1] = data[i + 2] = avg;
                }
    
                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL());
            };
            img.src = imageDataURL;
        });
    }
    async function processImage(imageUrl) {
        // Resize image
        const resizedImageDataURL = await resizeImage(imageUrl, 1024, 1024);
        
        // Convert to grayscale
        const grayscaleImageDataURL = await convertToGrayscale(resizedImageDataURL);
    
        // Perform OCR
        const text = await performOCR(grayscaleImageDataURL);
        console.log(text);
    }
    
    // Example usage
    processImage('path/to/your/image.png');
            
      
      
      