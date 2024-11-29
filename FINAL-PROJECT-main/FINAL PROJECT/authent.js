const firebaseConfig = {
    apiKey: "AIzaSyD3MDqHIQpuvhUoi0FOOCVnfdzD_TcYeEM",
    authDomain: "fixer-d7b99.firebaseapp.com",
    projectId: "fixer-d7b99",
    storageBucket: "fixer-d7b99.appspot.com",
    messagingSenderId: "951386388638",
    appId: "1:951386388638:web:a379e6806b2c5cf3a4638f"
  };
  firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const database = firebase.database();

// Function to validate email
function validateEmail(email) {
  const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email.match(validEmail);
}

// Function to validate password
function validatePassword(password) {
  const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return password.match(validPassword);
}

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('name').value;

  // Validate email and password
  if (!validateEmail(email) || !validatePassword(password)) {
    alert('Enter correct email and password');
    return false;  // Stops form submission
  }

  // Create a user with Firebase
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      const user = auth.currentUser;
      const userRef = database.ref('users/' + user.uid);
      const user_data = {
        email: email,
        name: full_name,
        last_login: Date.now()
      };

      // Save user data to the database
      userRef.set(user_data)
        .then(() => {
          // Show success message and delay navigation
          alert('User Created!');
          setTimeout(function() {
            window.location.href = "otp.html";
          }, 100);
        })
        .catch((error) => {
          alert('Error creating user: ' + error.message);
        });
    })
    .catch((error) => {
      alert('Error signing up: ' + error.message);
    });

  return false; // Prevents the form from submitting and page navigation
}

function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then((result) => {
      // Get the Google Access Token and signed-in user info
      const token = result.credential.accessToken;
      const user = result.user;
      
      // Log the signed-in user
      console.log('User signed in:', user);
      
      // Store user information in the Realtime Database
      const userRef = database.ref('users/' + user.uid);
      localStorage.setItem('signuserId', user.uid);
      const userData = {
        name: user.displayName,
        email: user.email,
        id:user.uid,
        last_login: Date.now()
      };
      localStorage.setItem('userId', user.uid);

      // Save user data to the database
      userRef.set(userData)
        .then(() => {
          alert('User data stored in database successfully.');
          setTimeout(function() {
            window.location.href = "otp.html";
          }, 100);
          
        })
        .catch((error) => {
          alert('Error storing user data:', error);
        });
    })
    .catch((error) => {
      // Handle Errors
      console.error('Error signing in:', error);
    });
}

function login() {
    var email = document.getElementById("email").value;
    var password= document.getElementById("password").value;
    if (!validateEmail(email) || !validatePassword(password)) {
      alert('Enter correct email and password');
      return false;  // Stops form submission
    }
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Logged in successfully
        const user = userCredential.user;
        alert('User logged in:', user.name);
        var userId = user.uid;
        localStorage.setItem('userId', userId);
        setTimeout(function() {
          window.location.href = "home.html";
        }, 100);


      })
      .catch((error) => {
        alert.error('Error logging in:', error.message);
      });
  }


// Log in with Google
function logInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // Logged in successfully
      const user = result.user;
      console.log('User logged in with Google:', user.uid);
      alert('User logged in:', user.uid);
      var userId = user.uid;
      localStorage.setItem('userId', userId);
      setTimeout(function() {
        window.location.href = "home.html";
      }, 100);

    })
    .catch((error) => {
      console.error('Error logging in with Google:', error.message);
    });
}
// Update these constants with your actual routes
const getOTPEndpoint = "https://otp-server-production.up.railway.app/getotp";
const verifyOTPEndpoint = "https://otp-server-production.up.railway.app/verifyotp";

async function sendOTP() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Please enter a valid email.');
        return;
    }

    try {
        const response = await fetch(getOTPEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`OTP sent to ${email}`);  // Inform user of OTP send
            document.querySelector('.otp-group').style.display = 'block'; // Show OTP input
        } else {
            alert('Failed to send OTP. Please try again later.');
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        alert("An error occurred. Please try again.");
    }
}

async function verifyOTP() {
  window.location.href = "home.html"; 
  const otp = document.getElementById('otpInput').value;
  const email = document.getElementById('email').value;

  try {
      const response = await fetch('https://otp-server-production.up.railway.app/verifyotp', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
              email: email, 
              otp: otp 
          })
      });

      if (response.ok) {
          alert("OTP verified successfully!");
          document.getElementById('sub').disabled = false;
          home();
           window.location.href = "home.html"; 
          
      } else {
          alert("OTP verification failed. Please try again.");
          document.getElementById('sub').disabled = false;
          home();
          window.location.href = "home.html";
      }
  } catch (error) {
      console.error('Error verifying OTP:', error);
  }
}
function home(){
  window.location.href = "home.html";
}
