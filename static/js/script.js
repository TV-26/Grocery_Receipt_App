// script.js

// Function to handle the receipt upload
async function uploadReceipt(event) {
    event.preventDefault();  // Prevent the default form submission

    const fileInput = document.getElementById('receipt');
    const file = fileInput.files[0];
    const responseMessage = document.getElementById('responseMessage');
    const extractedItemsDiv = document.getElementById('extractedItems');

    if (!file) {
        responseMessage.textContent = "Please select a file.";
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/receipts', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        responseMessage.textContent = `Success! Total: $${data.total}`;
        
        // Display extracted items
        extractedItemsDiv.innerHTML = '<h3>Extracted Items:</h3>';
        data.items.forEach(item => {
            const itemElement = document.createElement('p');
            itemElement.textContent = item;
            extractedItemsDiv.appendChild(itemElement);
        });
    } catch (error) {
        responseMessage.textContent = `Error: ${error.message}`;
    }
}

// Function to preview the uploaded receipt
function previewReceipt(event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById('previewImage');

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block'; // Show the image preview
        };

        reader.readAsDataURL(file);
    } else {
        previewImage.src = ''; // Clear the preview if no file is selected
        previewImage.style.display = 'none';
    }
}

// Attach event listeners
document.getElementById('receiptForm').addEventListener('submit', uploadReceipt);
document.getElementById('receipt').addEventListener('change', previewReceipt);
