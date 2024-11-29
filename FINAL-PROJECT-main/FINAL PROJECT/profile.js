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
const db = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    const editIcon = document.getElementById('edit-icon');
    const formFields = document.querySelectorAll('#profile-form input, #personal-details-form input');
    const saveButton = document.getElementById('save-button');

    let userId = null;

    // Check if the user is logged in (restores the session if already authenticated)
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, fetch their profile data
            userId = user.uid;
            fetchDataFromFirebase(userId);
        } else {
            // Fetch userId from localStorage if available
            userId = localStorage.getItem('userId');
            if (userId) {
                fetchDataFromFirebase(userId);
            } else {
                alert("User is not logged in and no userId found in localStorage.");
            }
        }
    });
    change.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Only accept images
        fileInput.click();

        // Handle file selection
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                uploadImage(file, userId); // Call the upload function
            }
        };
    });

    // Function to upload image to Firebase Storage and save the URL to Firebase Realtime Database
    
    function uploadImage(file, userId) {
        const storageRef = firebase.storage().ref('profile_pictures/' + userId + '/' + file.name);
        const uploadTask = storageRef.put(file);
    
        uploadTask.on('state_changed', (snapshot) => {
            // Optional: Track upload progress if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) => {
            // Handle unsuccessful uploads
            console.error('Upload failed:', error);
        }, () => {
            // Handle successful upload
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
    
                // Save the download URL to Firebase Realtime Database
                db.ref('/users/' + userId).update({
                    picture: downloadURL
                }).then(() => {
                    alert('Profile picture updated successfully.');
                    document.getElementById('image').src = downloadURL; // Update the image on the page
                }).catch((error) => {
                    console.error('Error updating database:', error);
                });
            });
        });
    }
    
    function fetchDataFromFirebase(userId) {
        const userref = db.ref('/users/' + userId);

        userref.once('value', (snapshot) => {
            const profileData = snapshot.val();
            document.getElementById('mobile').value = profileData.mobilenumber || "";
            document.getElementById('email').value = profileData.email || "";
            document.getElementById('name').value = profileData.name || "";
            document.getElementById('birthday').value = profileData.DOB || "";
            document.getElementById('gender').value = profileData.Gender || "";
            document.getElementById('married').value = profileData.married || "";
            const imageUrl = profileData.picture || "";
            document.getElementById('image').src = imageUrl ? imageUrl : "https://res.cloudinary.com/ds9icar9t/image/upload/v1724175281/elv65cxcqqkw02yp4yox.png";
            document.getElementById('second-number').value = profileData.secondNumber || "";
        }).catch((error) => {
            console.error("Error fetching document: ", error);
        });
    }

  
    editIcon.addEventListener('click', () => {
        formFields.forEach(field => {
            field.disabled = !field.disabled; // Toggle disabled state
        });

        // Show the save button if fields are enabled
        const anyFieldEnabled = [...formFields].some(field => !field.disabled);
        saveButton.style.display = anyFieldEnabled ? 'block' : 'none';
    });

    // Save updated details to Firebase when the Save button is clicked
    saveButton.addEventListener('click', () => {
        const updatedData = {
            mobilenumber: document.getElementById('mobile').value,
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
            DOB: document.getElementById('birthday').value,
            Gender: document.getElementById('gender').value,
            married: document.getElementById('married').value,
            picture: document.getElementById('image').src,
            secondNumber: document.getElementById('second-number').value
        };

        // Update the Firebase Realtime Database
        const userref = db.ref('/users/' + userId);
        userref.update(updatedData)
            .then(() => {
                alert("Profile updated successfully!");
                saveButton.style.display = 'none'; // Hide the Save button after saving
                formFields.forEach(field => {
                    field.disabled = true; // Disable fields after saving
                });
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    });
});

