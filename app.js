let mediaBox = document.getElementById('mediaBox');
let spinner = document.getElementById('spinner');
let categoryTitle = document.getElementById('categoryTitle');
let categories = ['image', 'video', 'apod', 'epic'];
let currentPage = 1; // Track the current page
const itemsPerPage = 15; // Display 15 items per page
let mediaItems = []; // Store media items globally for pagination

async function getMedia(type) {
    const apiKey = 'HTNeFGecSJFKq4565KeE3v6Msfy8aO52saqGgSiP';
    let url = `https://images-api.nasa.gov/search?q=space&media_type=${type}`;

    try {
        spinner.style.visibility = 'visible';
        const response = await fetch(url);
        const data = await response.json();
        spinner.style.visibility = 'hidden';
        mediaItems = data.collection.items; // Store items for pagination
        currentPage = 1; // Reset to the first page on new data
        displayMedia(mediaItems, currentPage);
    } catch (error) {
        console.error('Error fetching media:', error);
    }
}

function displayMedia(items, page) {
    mediaBox.innerHTML = '';  // Clear previous content
    categoryTitle.innerText = 'NASA Media';  // Set title

    // Calculate pagination
    let start = (page - 1) * itemsPerPage;
    let end = page * itemsPerPage;
    let paginatedItems = items.slice(start, end); // Get only items for the current page

    let mediaHTML = '';
    paginatedItems.forEach((item, index) => {
        let description = item.data[0].description || 'No description available.';
        if (description.length > 100) {
            description = description.substring(0, 100) + '...';  // Truncate description
        }

        // Construct the detail link from item.href which contains the metadata
        let readMoreLink = item.href ? `https://images.nasa.gov/details-${item.data[0].nasa_id}` : '#';

        if (index % 3 === 0) {
            mediaHTML += `<div class="row">`;  // Start new row after every 3 items
        }

        let media = `
        <div class="col-md-4">
            <div class="mediaCard card">
                <img src="${item.links[0].href}" class="card-img-top img-thumbnail" alt="Media">
                <h5 class="card-header">${item.data[0].title}</h5>
                <div class="card-body">
                    <p class="card-text">${description}</p>
                    <a target="_blank" href="${readMoreLink}" class="btn btn-primary">Read more</a> <!-- Redirects to NASA detail page -->
                </div>
            </div>
        </div>`;

        mediaHTML += media;

        if ((index + 1) % 3 === 0 || index === paginatedItems.length - 1) {
            mediaHTML += `</div>`;  // Close the row after every 3 items or at the last item
        }
    });

    mediaBox.innerHTML = mediaHTML;
    mediaBox.style.visibility = 'visible';

    // Add pagination controls
    createPaginationControls(items.length, page);
}

function createPaginationControls(totalItems, currentPage) {
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = `<nav aria-label="Page navigation">
                            <ul class="pagination justify-content-center">`;

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item">
                            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
                           </li>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                           </li>`;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item">
                            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
                           </li>`;
    }

    paginationHTML += `</ul></nav>`;

    mediaBox.innerHTML += paginationHTML;  // Append pagination to the media box
}

function changePage(page) {
    currentPage = page;
    displayMedia(mediaItems, currentPage);
}

function sendCategory(index) {
    getMedia(categories[index]);
}

getMedia('image');  // Default to images

async function getAPOD() {
    const apiKey = 'HTNeFGecSJFKq4565KeE3v6Msfy8aO52saqGgSiP';
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    try {
        spinner.style.visibility = 'visible';
        const response = await fetch(url);
        const data = await response.json();
        spinner.style.visibility = 'hidden';
        displayAPOD(data);  // Function to display APOD data
    } catch (error) {
        console.error('Error fetching APOD:', error);
    }
}

function displayAPOD(item) {
    mediaBox.innerHTML = '';  // Clear previous content
    categoryTitle.innerText = 'Astronomy Picture of the Day';  // Set title

    let mediaHTML = `
    <div class="col-md-12">
        <div class="mediaCard card">
            <img src="${item.url}" class="card-img-top img-thumbnail" alt="APOD">
            <h5 class="card-header">${item.title}</h5>
            <div class="card-body">
                <p class="card-text">${item.explanation}</p>
                <p class="card-text"><strong>Date:</strong> ${item.date}</p>
                <a target="_blank" href="${item.hdurl}" class="btn btn-primary">View in HD</a> <!-- Link to high-definition image -->
            </div>
        </div>
    </div>`;

    mediaBox.innerHTML = mediaHTML;
    mediaBox.style.visibility = 'visible';
}

// code for epic data

async function getEPICData() {
    const apiKey = 'HTNeFGecSJFKq4565KeE3v6Msfy8aO52saqGgSiP';
    let url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKey}`;

    try {
        spinner.style.visibility = 'visible';
        const response = await fetch(url);
        const data = await response.json();
        spinner.style.visibility = 'hidden';
        mediaItems = data;  // Store EPIC items for pagination
        currentPage = 1;  // Reset to first page on new data
        displayEPICMedia(mediaItems, currentPage);
    } catch (error) {
        console.error('Error fetching EPIC data:', error);
    }
}

function displayEPICMedia(items, page) {
    mediaBox.innerHTML = '';  // Clear previous content
    categoryTitle.innerText = 'EPIC Earth Imagery';  // Set title

    // Calculate pagination
    let start = (page - 1) * itemsPerPage;
    let end = page * itemsPerPage;
    let paginatedItems = items.slice(start, end);  // Get only items for the current page

    let mediaHTML = '';
    paginatedItems.forEach((item, index) => {
        let imageUrl = `https://api.nasa.gov/EPIC/archive/natural/${item.date.slice(0, 4)}/${item.date.slice(5, 7)}/${item.date.slice(8, 10)}/png/${item.image}.png?api_key=HTNeFGecSJFKq4565KeE3v6Msfy8aO52saqGgSiP`;
        let description = item.caption || 'No description available.';

        if (index % 3 === 0) {
            mediaHTML += `<div class="row">`;  // Start new row after every 3 items
        }

        let media = `
        <div class="col-md-4">
            <div class="mediaCard card">
                <img src="${imageUrl}" class="card-img-top img-thumbnail" alt="EPIC Image">
                <h5 class="card-header">EPIC Image: ${item.date}</h5>
                <div class="card-body">
                    <p class="card-text">${description}</p>
                    <a target="_blank" href="${imageUrl}" class="btn btn-primary">View Image</a>
                </div>
            </div>
        </div>`;

        mediaHTML += media;

        if ((index + 1) % 3 === 0 || index === paginatedItems.length - 1) {
            mediaHTML += `</div>`;  // Close the row after every 3 items or at the last item
        }
    });

    mediaBox.innerHTML = mediaHTML;
    mediaBox.style.visibility = 'visible';

    // Add pagination controls
    createPaginationControls(items.length, page);
}

function sendCategory(index) {
    if (categories[index] === 'image') {
        getMedia('image');
    } else if (categories[index] === 'video') {
        getMedia('video');
    } else if (categories[index] === 'apod') {
        getAPOD();
    } else if (categories[index] === 'epic') {
        getEPICData();  // Fetch and display EPIC data
    }
}


