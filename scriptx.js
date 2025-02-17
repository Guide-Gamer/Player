async function modifyAndDownload() {
    const fileInput = document.getElementById('fileUpload');
    const teamNumber = document.getElementById('teamSelect').value;
    const playerNumber = document.getElementById('playerSelect').value;
    const roundNumber = document.getElementById('roundSelect').value;
    const loadingIndicator = document.getElementById('loadingIndicator');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const notification = document.getElementById('notification');

    if (!fileInput.files.length) {
        showNotification('Please upload a file.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    loadingIndicator.style.display = 'block';
    progressContainer.style.display = 'block';

    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            progressBar.innerText = `${progress}%`;
        }
    }, 500);

    reader.onload = async function (event) {
        const fileData = event.target.result.split(',')[1];

        try {
            const response = await fetch('/api/zero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file: fileData, teamNumber, playerNumber, roundNumber })
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = file.name;
                downloadLink.click();
            } else {
                const error = await response.json();
                showNotification(error.error || 'An error occurred.');
            }
        } catch (error) {
            showNotification('Please check your internet connection.');
        } finally {
            clearInterval(progressInterval);
            loadingIndicator.style.display = 'none';
            progressContainer.style.display = 'none';
        }
    };

    reader.readAsDataURL(file);
}

document.getElementById('footer-link').innerHTML = '<a href="https://youtube.com/@guidegamer016" target="_blank">GUIDE GAMER</a>';

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
