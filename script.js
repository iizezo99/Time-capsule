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

    // Gallery fetch and display (using filenames)
    let allFilenames = [];
    const gallery = document.getElementById('gallery');
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm ? searchForm.querySelector('input[type="text"]') : null;

    function renderGallery(filenames) {
        if (gallery && Array.isArray(filenames)) {
            gallery.innerHTML = filenames.map(filename =>
                `<div class="gallery-item">
                    <img src="http://localhost:3000/uploads/${filename}" alt="Gallery Image">
                    <div class="gallery-filename">${filename}</div>
                </div>`
            ).join('');
        }
    }

    fetch('http://localhost:3000/gallery')
        .then(res => res.json())
        .then(filenames => {
            allFilenames = filenames;
            renderGallery(allFilenames);
        });

    function filterGallery() {
        const query = searchInput ? searchInput.value.trim() : '';
        let filtered = allFilenames;
        if (query) {
            try {
                const regex = new RegExp(query, 'i');
                filtered = allFilenames.filter(filename => regex.test(filename));
            } catch (e) {
                // If regex is invalid, show all images
                filtered = allFilenames;
            }
        }
        renderGallery(filtered);
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterGallery();
        });
        searchInput.addEventListener('input', function() {
            filterGallery();
        });
    }
}); 