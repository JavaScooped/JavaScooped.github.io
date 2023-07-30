// Array to store shared content
let sharedContentArray = [];

// Function to add shared content to the webpage
function addSharedContent(imageUrl, text) {
    const sharedContentDiv = document.getElementById("sharedContent");
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    if (imageUrl) {
        const imageElement = document.createElement("img");
        imageElement.classList.add("image");
        imageElement.src = imageUrl;
        cardDiv.appendChild(imageElement);
    }

    const textElement = document.createElement("p");
    textElement.textContent = text;

    cardDiv.appendChild(textElement);
    sharedContentDiv.appendChild(cardDiv);
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const imageUrl = document.getElementById("imageUrl").value;
    const text = document.getElementById("text").value;
    sharedContentArray.push({ imageUrl, text });
    addSharedContent(imageUrl, text);
    // You can add code here to send the data to a server for proper storage.
    // This example does not include the backend part, so the data won't persist.
}

// Attach form submission event listener
const form = document.getElementById("imageTextForm");
form.addEventListener("submit", handleFormSubmit);
