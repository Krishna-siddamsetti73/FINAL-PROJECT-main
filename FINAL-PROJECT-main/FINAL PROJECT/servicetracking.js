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
const auth = firebase.auth();
const database = firebase.database();
const userId = localStorage.getItem('userId');
const ordersRef = firebase.database().ref(`/users/${userId}/orders`);
console.log("final "+userId);
generateServiceCards(userId);
userdata(userId) 
function generateServiceCards(userId) {
    const ordersRef = database.ref(`/users/${userId}/orders`);
    
    // Fetch orders
    ordersRef.once('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const orderData = childSnapshot.val();
        const orderId = childSnapshot.key;
  
        // Check order status
        if (orderData.orderstatus !== 'cancelled' && orderData.orderstatus !== 'completed') {
          // Generate card
          const serviceCard = document.createElement('div');
          serviceCard.className = 'service-card';
          serviceCard.innerHTML = `
            <div class="description">
              <strong id="servicename">${orderData.servicelist.join(', ')}</strong><br>
              <p>Phone number: <span id='phnnmbr'>${orderData.providerId}</span></p>
            </div>
            <div class="price" id="price">₹${orderData.GrandTotal}</div>
            <div class="orderStatus" id="orderstatus">
            <strong> orderstatus : <span> ${orderData.orderstatus}</span>  </strong>
            </div>
          `;
          
          // Append the service card to a container
          document.getElementById('serviceContainer').appendChild(serviceCard);
          
        }
      });
    });
  }
  function userdata(userId){
    userref= database.ref(`/users/${userId}`);
    userref.on('value', (snapshot) => {
        const data = snapshot.val();
        document.getElementById('useremail').textContent = data.email;
       // Assuming `data` is an object containing user information
document.getElementById('userprofile').src = data.picture || 'no mage';

    });
  }
  // Function to capture the rating and review
function submitReview() {
 
  const userId = firebase.auth().currentUser.uid; 

  // Get the rating value
  let rating = document.querySelector('input[name="rating"]:checked').value;

  // Get the review text
  let review = document.querySelector('textarea').value;

  // Create a timestamp for when the review is submitted
  let timestamp = new Date().toISOString();

  // Create the review object to store
  const reviewData = {
    rating: parseInt(rating),
    review: review,
    timestamp: timestamp
  };

  const userExperienceRef = database.ref('userExperience/' + userId);
  userExperienceRef.once('value')
  .then((snapshot) => {
    if (snapshot.exists()) {
      // If the path exists, update the data
      userExperienceRef.update(reviewData)
        .then(() => {
          console.log("Review updated successfully!");
          alert("Thank you for updating your feedback!");
        })
        .catch((error) => {
          console.error("Error updating review:", error);
        });
    } else {
      // If the path does not exist, set the data (create a new entry)
      userExperienceRef.set(reviewData)
        .then(() => {
          console.log("Review saved successfully!");
          alert("Thank you for your feedback!");
          
        })
        .catch((error) => {
          console.error("Error saving review:", error);
        });
    }
  })
  .catch((error) => {
    console.error("Error checking user experience:", error);
  });

}

// Add an event listener to the "Submit Review" button
document.querySelector('button').addEventListener('click', submitReview);

