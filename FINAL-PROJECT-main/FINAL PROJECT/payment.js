const firebaseConfig = {
    apiKey: "AIzaSyD3MDqHIQpuvhUoi0FOOCVnfdzD_TcYeEM",
    authDomain: "fixer-d7b99.firebaseapp.com",
    projectId: "fixer-d7b99",
    storageBucket: "fixer-d7b99.appspot.com",
    messagingSenderId: "951386388638",
    appId: "1:951386388638:web:a379e6806b2c5cf3a4638f"
  };
 
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const servicer = sessionStorage.getItem('providername');
  const image = sessionStorage.getItem('providername');
  const totalamo = sessionStorage.getItem('grandtotal');
  document.getElementById('provider-name').textContent = servicer;
  document.getElementById('provider-img').textContent = image;
  document.getElementById('service-amount').textContent = totalamo;
 // Fetch current user's ID
const userId = localStorage.getItem('userId');
const orderId = sessionStorage.getItem('orderID');  // Retrieve orderID from session storage
console.log('Order ID:', orderId);

const orderRef = db.ref( `/users/${userId}/orders/${orderId}`);
console.log('Order Reference:', orderRef);

// Listen for changes to the order data
orderRef.on('value', (snapshot) => {
  if (snapshot.exists()) {
    const orderData = snapshot.val();
    console.log('Order Data:', orderData);  // Debugging: log the entire orderData object

    if (orderData.paymentstatus === 'ok') {
      // Payment is confirmed, redirect to service tracking page
      alert('Payment confirmed. Redirecting...');
      window.location.href = 'servicetracking.html';
    } else {
      console.log('Payment status is not "ok". Current status:', orderData.paymentstatus);
    }
  } else {
    console.error('No data available at the specified path.');
  }
});



// Get the elements
const qrCodeOption = document.getElementById('qrcode-option');
const qrCodeModal = document.getElementById('qrcode-modal');
const closeModal = document.getElementById('close-modal');
const cash = document.getElementById('cash-options');
cash.addEventListener('click', () => {
  window.location.href = "servicetracking.html";})
// Show the modal when the QR code option is clicked
qrCodeOption.addEventListener('click', () => {
  qrCodeModal.style.display = 'flex';
  orderRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
      const orderData = snapshot.val();
      console.log('Order Data:', orderData);  // Debugging: log the entire orderData object
      const orderata = {
        userId: userId,            // Replace with actual user email
        paymentDetails: orderData.GrandTotal,  // Replace with actual payment details
        orderDetails: "online", 
        orderId:orderId   // Replace with actual order details
      };
      const newOrderRef = db.ref('adminOrders').push();
  newOrderRef.set(orderData)         // Save the order data under the unique ID
    .then(() => {
      console.log("Order successfully added to admin database with unique ID:", newOrderRef.key);
    })
    .catch(error => {
      console.error("Error adding order to admin database:", error);
    });
    
    } else {
      console.error('No data available at the specified path.');
    }
  });
  
  // Generate a unique key for each order entry in "adminOrders
});


// Close the modal when the "x" is clicked
closeModal.addEventListener('click', () => {
  qrCodeModal.style.display = 'none';
});

// Close the modal if the user clicks outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === qrCodeModal) {
    qrCodeModal.style.display = 'none';
  }
});
