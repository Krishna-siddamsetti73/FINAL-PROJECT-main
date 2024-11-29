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
  async function searchServices() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';  // Clear previous results

    if (!searchQuery) return;  // Don't query if input is empty

    // Fetch matching services from Firestore
    try {
        const snapshot = await db.collection('services')
            .where('name', '>=', searchQuery)
            .where('name', '<=', searchQuery + '\uf8ff')  // Range query for text
            .get();

        if (snapshot.empty) {
            resultsDiv.innerHTML = '<p>No matching services found.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const service = doc.data();
            const serviceId = doc.id;  // Assume each service document has a unique ID

            // Create a result item and set an onclick event to redirect to the service page
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.textContent = service.name;

            // Redirect to specific page with service ID on click
            resultItem.onclick = () => {
                window.location.href = `/service.html?id=${serviceId}`;
            };

            resultsDiv.appendChild(resultItem);
        });
    } catch (error) {
        console.error("Error searching services:", error);
        resultsDiv.innerHTML = '<p>There was an error performing the search.</p>';
    }
}