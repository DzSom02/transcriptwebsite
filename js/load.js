/**
 * Asynchronously pauses the execution for the specified duration.
 * @param {number} ms - The duration to sleep in milliseconds.
 * @returns {Promise<void>} - A Promise that resolves after the specified duration.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retrieves the value of the 'post' query parameter from the current URL.
 * @returns {string|null} - The value of the 'post' query parameter, or null if not found.
 */
function getQueryParams() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('post');
}

/**
 * Loads and displays the content of a post on the webpage.
 * @param {string} path - The path to the post to be loaded.
 * @returns {void}
 */
async function loadPost(path) {
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Display the loading overlay before fetching the content
    loadingOverlay.style.display = 'flex';

    try {
        // Fetch the content of the specified post
        const content = await fetchPostContent(path);

        // Display the fetched content on the webpage
        const blogContent = document.getElementById('blogContent');
        blogContent.innerHTML = content;

        // Hide the loading overlay once the content is loaded
        loadingOverlay.style.display = 'none';

        // Update the URL with the current post as a query parameter
        window.history.replaceState(null, null, `?post=${encodeURIComponent(path)}`);
    } catch (error) {
        console.error('Error loading post content:', error);

        // Hide the loading overlay in case of an error
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Initializes the blog by loading the appropriate post based on the URL parameters.
 * If no post parameter is provided, the default post or homepage is loaded.
 */
function initialize() {
    // Get the 'post' query parameter from the URL
    const postParam = getQueryParams();

    if (postParam) {
        // Load the post specified in the URL parameter
        loadPost(decodeURIComponent(postParam));
    } else {
        // Load the default post or homepage
        loadPost('/posts/index.html'); // Change this to your default post URL
    }
}

/**
 * Fetches the content of a post from the server.
 * @param {string} path - The path to the post.
 * @returns {Promise<string>} A Promise that resolves with the post content.
 */
function fetchPostContent(path) {
    // Make a GET request to the server to fetch the content of the selected postPath
    // Replace 'your-server-url' with the actual URL of your server
    return fetch(`${path}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    // If the post is not found, load the '404.html' page
                    return fetch('/errors/404.html') // Change this to your '404' page URL
                        .then(errorResponse => errorResponse.text())
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            return response.text();
        });
}

document.addEventListener('DOMContentLoaded', initialize);

