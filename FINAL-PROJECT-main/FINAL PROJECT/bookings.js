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
  const auth = firebase.auth();
  let image;
  let wname;
  let servicetotal;
  let userId;
  let serviceDuration;
  let gr;
  let serl=[];
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is logged in, fetch their profile data
        userId = user.uid;
        console.log(userId);
        
    } else {
        // Fetch userId from localStorage if available
        userId = localStorage.getItem('userId');
        console.log(userId);
    }
});
const workerId = sessionStorage.getItem('workerid');
const serviceCategory = sessionStorage.getItem('selectedService');
function fetchProviderData() {
    const providerRef = db.ref('/workers/'+serviceCategory+'/'+workerId);

    providerRef.once('value', (snapshot) => {
        const data = snapshot.val();
        
        // Dynamically update the provider's details
        document.getElementById('provider-name').textContent = data.name;
        document.getElementById('provider-email').textContent = data.email || 'N/A';
        document.getElementById('provider-phone').textContent = data.phonenumber;
        document.getElementById('provider-ratings').textContent = `Rating: ★${data.rating || 'N/A'}`;
        document.getElementById('provider-img').src = data.picture;
        image=data.picture
        wname=data.name
       
        // Load services dynamically
        const servicesList = document.getElementById('services-list');
        servicesList.innerHTML = '';  // Clear existing services
        let total = 0;

        // Loop through the 'srvicesandprice' object
        const services = data.srvicesandprice;
        for (const serviceKey in services) {
            if (services.hasOwnProperty(serviceKey)) {
                const service = services[serviceKey];
                
                // Create label and checkbox for each service
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('service-checkbox');
                checkbox.dataset.price = service.price;
                checkbox.dataset.servicename = service.servicename;
                
                // Event listener to update the total price
                checkbox.addEventListener('change', (e) => {
                    document.getElementById('serviceduration').addEventListener('input', function() {
                        serviceDuration = parseInt(document.getElementById('serviceduration').value);
                   gr = total * serviceDuration;
                 document.getElementById('totalgr').textContent = `Rs.${gr}`;
                    });
                    total += e.target.checked ? parseInt(service.price) : -parseInt(service.price);
                     e.target.checked?serl.push(service.servicename):null;
                    document.getElementById('total').textContent = `Rs.${total}`;
                     servicetotal= total
                    console.log(serl);
                });

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(`${service.servicename} - Rs.${service.price}`));
                servicesList.appendChild(label);
            }
        }
    });
}
function fetchReviews() {
    const reviewsRef = db.ref('reviews/' + workerId);
    reviewsRef.once('value', (snapshot) => {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = '';  // Clear existing reviews
        snapshot.forEach((childSnapshot) => {
            const review = childSnapshot.val();
            const card = document.createElement('div');
            card.classList.add('review-card');  // Add class for styling
            
            // Create card content
            card.innerHTML = `
                <h3><strong>user:</strong> ${review.username} </h3>
                <p><strong>Rating:</strong> ${review.rating || 'N/A'}</p>
                <p><strong>time taken for service:</strong> ${review.timetook}</p>
                <p><strong>Review:</strong> ${review.text}</p>
                
            `;
            reviewsContainer.appendChild(card);
        });
    });
}

document.getElementById('back-btn').addEventListener('click', function() {
    window.location.href = 'workers.html';  // Redirect to workers.html
});

document.getElementById('continue-btn').addEventListener('click', function() {
    sessionStorage.setItem('providerImage', image);
    sessionStorage.setItem('providername', wname);
    sessionStorage.setItem('grandtotal', gr);
    console.log(wname +image+ servicetotal)
    orderRef=db.ref(`/users/${userId}/orders`).push();
    const orderId = orderRef.key;
    sessionStorage.setItem('orderID',orderId);
    const orderData = {
        providerName: wname,
        providerId: workerId,
        serviceTotal: servicetotal,
        servicelist:serl,
        userId:userId,
        orderstatus:"placedorder",
        serviceDuration:serviceDuration,
        GrandTotal:gr,
        orderId: orderId,
        orderTime: new Date().toISOString()  // Store current date and time
    };
    
    // Write the order to Firebase Realtime Database
    orderRef.set(orderData)
        .then(() => {
            alert(`orders saved for services ${serl} with total ${gr}`);
            setTimeout(function() {
                window.location.href = "payment.html";
              }, 100);
        })
        .catch((error) => {
           alert('Error saving order: ', error);
        });
    // Redirect to workers.html
});


// Call the function to fetch the data
fetchProviderData(workerId);
fetchReviews(workerId);
