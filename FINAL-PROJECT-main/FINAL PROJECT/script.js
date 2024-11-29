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

function storeServiceCategory(serviceCategory) {
        // Save the service category in session storage
        sessionStorage.setItem('selectedService', serviceCategory);
        console.log(serviceCategory)
        
      }

    
