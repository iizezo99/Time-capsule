document.addEventListener('DOMContentLoaded', function() {
    // Greeting logic
    const greeting = document.getElementById('greeting');
    const hour = new Date().getHours();
    if (hour < 12) {
        greeting.textContent = 'Good morning!';
    } else if (hour < 18) {
        greeting.textContent = 'Good afternoon!';
    } else {
        greeting.textContent = 'Good evening!';
    }

    // AJAX upload logic
    const uploadForm = document.getElementById('uploadForm');
    const uploadMsg = document.getElementById('uploadMsg');

    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            })
            .then(async response => {
                if (response.ok) {
                    uploadMsg.textContent = 'File uploaded successfully!';
                } else {
                    const text = await response.text();
                    uploadMsg.textContent = text;
                }
            })
            .catch(err => {
                uploadMsg.textContent = 'Upload failed: ' + err.message;
            });
        });
    }

    // Gallery fetch and display
    fetch('http://localhost:3000/gallery')
        .then(res => res.json())
        .then(urls => {
            const gallery = document.getElementById('gallery');
            if (gallery && Array.isArray(urls)) {
                gallery.innerHTML = urls.map(url =>
                    `<img src="http://localhost:3000${url}" alt="Gallery Image">`
                ).join('');
            }
        });
}); 