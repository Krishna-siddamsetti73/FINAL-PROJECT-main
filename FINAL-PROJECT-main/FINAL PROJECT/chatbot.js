// Basic Chatbot logic
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Function to handle sending messages
function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        displayMessage('User: ' + message);
        userInput.value = '';

        // Simple response logic
        setTimeout(() => {
            const response = getBotResponse(message);
            displayMessage('Bot: ' + response);
        }, 1000);
    }
}

// Function to display messages in chatbox
function displayMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    chatbox.appendChild(msgDiv);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to bottom
}

// Function to generate bot responses
function getBotResponse(input) {
    // Simple response logic
    const responses = {
        'hello': 'Hi there! How can I assist you today?',
        'who are you?': 'I am Fixer’s chatbot, here to help you book services with ease!',
        'what services do you offer?': 'We offer a range of services like plumbing, cleaning, electrical repairs, and more.',
        'how to book a service?': 'Just select a service, choose a provider, and schedule your booking – it’s easy!',
        'how can I track my service provider?': 'Once booked, you can track your service provider in real-time through the app.',
        'do you offer any discounts?': 'We often have discounts! Check the promotions section for any ongoing offers.',
        'is payment online or cash?': 'We offer both options. You can pay online or choose cash-on-delivery if available.',
        'is my information safe?': 'Absolutely! We prioritize user privacy and security.',
        'how do I cancel a booking?': 'You can cancel a booking through the "My Bookings" section before the scheduled time.',
        'what is your refund policy?': 'Refunds are available for cancellations within the eligible timeframe. Please see our policy for details.',
        'are your service providers verified?': 'Yes, all our providers undergo verification to ensure quality and safety.',
        'where can I find reviews?': 'You can view reviews on each provider’s profile before booking.',
        'how can I contact customer support?': 'You can reach our support team through the "Help" section in the app.',
        'how to update my profile information?': 'Go to the "Profile" section, and you can easily update your details there.',
        'default': 'I am not sure how to respond to that. Could you rephrase your question?'
    }
    
    return responses[input.toLowerCase()] || responses['default'];
}

// Event listener for the send button
sendBtn.addEventListener('click', sendMessage);

// Allow pressing "Enter" to send a message
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
