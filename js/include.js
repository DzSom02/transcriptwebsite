/**
 * Includes the HTML content specified in the 'w3-include-html' attribute of elements.
 * Uses XMLHttpRequest to fetch and insert the content into the elements.
 */
function includeHTML() {
    let elements = document.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let file = element.getAttribute("w3-include-html");
        if (file) {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        element.innerHTML = this.responseText;
                    }
                    if (this.status === 404) {
                        element.innerHTML = "Page not found.";
                    }
                    // Remove the attribute and call this function once more
                    element.removeAttribute("w3-include-html");
                    includeHTML();
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            // Exit the loop after finding one element with 'w3-include-html' attribute
            return;
        }
    }
}
includeHTML();
