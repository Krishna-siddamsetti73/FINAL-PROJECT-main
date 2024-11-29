// Firebase configuration (make sure to replace these with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyD3MDqHIQpuvhUoi0FOOCVnfdzD_TcYeEM",
    authDomain: "fixer-d7b99.firebaseapp.com",
    projectId: "fixer-d7b99",
    storageBucket: "fixer-d7b99.appspot.com",
    messagingSenderId: "951386388638",
    appId: "1:951386388638:web:a379e6806b2c5cf3a4638f"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to the orders list
const ordersList = document.getElementById('ordersList');
const reviewDialog = document.getElementById('reviewDialog');
const submitReviewButton = document.getElementById('submitReview');
const userId = localStorage.getItem('userId');
// Fetch orders from Firebase
function loadOrders() {
     // Replace with actual user ID
    const ordersRef = firebase.database().ref('users/' + userId + '/orders');

    ordersRef.once('value').then(snapshot => {
        snapshot.forEach(orderSnapshot => {
            const order = orderSnapshot.val();
            createOrderCard(order);
        });
    });
}

// Create order card dynamically
function createOrderCard(order) {
    // Card structure
    const card = document.createElement('div');
    card.classList.add('order-card');

    const orderInfo = `
        <div class="order-info">
            <p><strong>Worker Name:</strong> ${order.providerName}</p>
            <p><strong>Worker ID:</strong> ${order.providerId}</p>
            <p><strong>Services:</strong> ${order.servicelist.join(', ')}</p>
            <p><strong>Service Duration:</strong> ${order.serviceDuration} hours</p>
            <p><strong>Service Total:</strong> ₹${order.serviceTotal}</p>
            <p><strong>Grand Total:</strong> ₹${order.GrandTotal}</p>
        </div>
    `;
    card.innerHTML = orderInfo;

    // Buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    const rebookButton = document.createElement('button');
    rebookButton.textContent = 'Rebook Service';
    rebookButton.classList.add('rebook-button');
    rebookButton.onclick = () => window.location.href = 'bookings.html';

    const ratingButton = document.createElement('button');
    ratingButton.textContent = 'Give Rating';
    ratingButton.classList.add('rating-button');
    ratingButton.onclick = () => openReviewDialog(order.providerId);

    buttonsDiv.appendChild(rebookButton);
    buttonsDiv.appendChild(ratingButton);

    card.appendChild(buttonsDiv);
    ordersList.appendChild(card);
}

// Open review dialog box
function openReviewDialog(workerId) {
    reviewDialog.style.display = 'block';

    submitReviewButton.onclick = () => {
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const review = document.getElementById('reviewText').value;

        const reviewData = {
            rating: parseInt(rating),
            review: review,
            timestamp: new Date().toISOString()
        };

        firebase.database().ref('userExperience/' + workerId).set(reviewData)
            .then(() => {
                alert('Review submitted!');
                reviewDialog.style.display = 'none';
            })
            .catch((error) => {
                console.error('Error submitting review:', error);
            });
    };
}

// Close the review dialog box on submit
document.getElementById('submitReview').addEventListener('click', () => {
    reviewDialog.style.display = 'none';
});

// Load orders on page load
window.onload = loadOrders;
