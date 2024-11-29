const firebaseConfig = {
  apiKey: "AIzaSyD3MDqHIQpuvhUoi0FOOCVnfdzD_TcYeEM",
  authDomain: "fixer-d7b99.firebaseapp.com",
  projectId: "fixer-d7b99",
  storageBucket: "fixer-d7b99.appspot.com",
  messagingSenderId: "951386388638",
  appId: "1:951386388638:web:a379e6806b2c5cf3a4638f"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to display workers
function displayWorkers() {
  const serviceCategory = sessionStorage.getItem('selectedService');

  if (!serviceCategory) {
      console.error("Service category not found in session storage.");
      return;
  }

  console.log(serviceCategory);
  const workersRef = database.ref('/workers/' + serviceCategory);

  workersRef.once('value', (snapshot) => {
      const workersData = snapshot.val();
      const grid = document.getElementById('workers-grid');
      grid.innerHTML = ''; // Clear the grid before displaying new data

      if (workersData) {
          for (const id in workersData) {
              const worker = workersData[id];
              const onlineStatus = worker.online ? 'online' : 'offline'; // Determine the worker's status
              const workerCard = `
                   <a href="booking.html" onclick="workerid('${worker.id}'); return false;"><div class="grid-item" >
                      <div class="status-dot ${onlineStatus}"></div> <!-- Dot indicating online/offline status -->
                      <img src="${worker.picture}" alt="${worker.name}">
                      <h2>${worker.name}</h2>
                      <p>${worker.id}</p>
                      <p>${worker.phonenumber}</p>
                      <p>${worker.services}</p>
                  </div></a>
              `;
              grid.innerHTML += workerCard;
              

          }
      } else {
          grid.innerHTML = '<p>No workers available for this category.</p>';
      }
  });
}

// Ensure the function is called once the DOM is fully loaded
window.onload = function() {
  displayWorkers();
};

function workerid(workerid){
  sessionStorage.setItem('workerid',workerid);
  console.log(workerid);
  setTimeout(function() {
    window.location.href = "bookings.html";
  }, 100);

}
