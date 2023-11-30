// Generate a unique session identifier
const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);

let uploadStatus = {
    "file1": false,
    "file2": false,
    "file3": false,
    "file4": false
};

function checkAllFilesUploaded() {
    return Object.values(uploadStatus).every(status => status);
}

// Handle file upload for each drop area
document.querySelectorAll('.drop-area input[type="file"]').forEach((input, index) => {
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            const file = input.files[0];
            handleFileUpload(file, index + 1);
        }
    });
});

function handleFileUpload(file, fileIndex) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        headers: { 'X-Session-ID': sessionId },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        uploadStatus[`file${fileIndex}`] = true;

        const uploadArea = document.getElementById(`upload-button-${fileIndex}`).parentElement;
        uploadArea.classList.add('success');  // Add the success class


        if (checkAllFilesUploaded()) {
            
            fetchDropdownData();
            const createSettingsBtn = document.getElementById('create-settings-btn');
            createSettingsBtn.classList.remove('disabled');
            createSettingsBtn.disabled = false;
        }
    })
    .catch(error => console.error('Error uploading file:', error));
}

document.getElementById('create-settings-btn').addEventListener('click', () => {
    processFiles(sessionId);
});
function processFiles(sessionId) {
    // Get selected values from dropdowns
    const frameStartValue = document.getElementById('frame-start-select').value;
    const frameEndValue = document.getElementById('frame-end-select').value;
    const settingsValue = document.getElementById('setting-select').value;

    // Create a data object to send to the server
    const dataToSend = {
        frameStart: frameStartValue,
        frameEnd: frameEndValue,
        settingsType: settingsValue
    };

    fetch('/process', {
        method: 'POST',
        headers: { 
            'X-Session-ID': sessionId,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        document.querySelector('.processing-section').classList.add('hidden');
        document.querySelector('.download-section').classList.remove('hidden');

        const createSettingsBtn = document.getElementById('create-settings-btn');
        createSettingsBtn.classList.add('settings-btn-success');
    })
    .catch(error => console.error('Error processing files:', error));
}


document.getElementById('download-btn').addEventListener('click', () => {
    fetch(`/download`, {
        method: 'GET',
        headers: { 'X-Session-ID': sessionId }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        // Create a new URL for the blob and open it to initiate download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'settings.txt';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        document.getElementById('refresh-message').classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error downloading file:', error);
    });
});

function fetchDropdownData() {
    fetch('/frame-data', {
        method: 'GET',
        headers: { 'X-Session-ID': sessionId }
    })
    .then(response => response.json())
    .then(data => {
        populateDropdowns(data);
    })
    .catch(error => console.error('Error fetching frame data:', error));
}

function populateDropdowns(data) {
    const startSelect = document.getElementById('frame-start-select');
    const endSelect = document.getElementById('frame-end-select');

    // Clear existing options
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';

    // Populate both dropdowns with the full array
    data.forEach((timestamp, index) => {
        startSelect.add(new Option(timestamp, timestamp));
        endSelect.add(new Option(timestamp, timestamp));
    });

    // Set default selections
    if (data.length >= 2) {
        startSelect.value = data[0]; // First entry for the first dropdown
        endSelect.value = data[data.length - 2]; // Second-to-last entry for the second dropdown
    }

    startSelect.disabled = false;
    endSelect.disabled = false;
}

document.querySelectorAll('.drop-area').forEach((dropArea, index) => {
  // Drag over event
  dropArea.addEventListener('dragover', (event) => {
      event.stopPropagation();
      event.preventDefault();
      dropArea.classList.add('dragover-big');
  });

  // Drag leave event
  dropArea.addEventListener('dragleave', (event) => {
      dropArea.classList.remove('dragover-big');
  });

  // Drop event
  dropArea.addEventListener('drop', (event) => {
      event.stopPropagation();
      event.preventDefault();
      dropArea.classList.remove('dragover-big'); // Reset the size

      const file = event.dataTransfer.files[0]; // Get the dropped file
      if (file) {
          handleFileUpload(file, index + 1); // Handle the file upload
      }
  });
});
