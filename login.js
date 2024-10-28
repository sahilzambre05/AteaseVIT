// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZpr7SPiFIaPj8HWMPFfnenGU6UzBEm20",
    authDomain: "vitv-53e6b.firebaseapp.com",
    projectId: "vitv-53e6b",
    storageBucket: "vitv-53e6b.appspot.com",
    messagingSenderId: "405159326911",
    appId: "1:405159326911:web:884e10194a6aeb6663020a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to check email domain
function isValidEmailDomain(email) {
    const allowedDomains = ['vit.ac.in', 'vitstudent.ac.in'];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
}

// Ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Google Login
    document.getElementById('google-login').addEventListener('click', () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                const email = user.email;
                const name = user.displayName;
                const profilePic = user.photoURL;

                // Validate email domain
                if (isValidEmailDomain(email)) {
                    // Save user data to Firestore
                    await setDoc(doc(db, "users", user.uid), {
                        name: name,
                        email: email,
                        profilePic: profilePic,
                        lastLogin: new Date()
                    });

                    // Redirect to acknowledgment page
                    window.location.href = 'acknowledgement.html';
                } else {
                    // Sign out and show error message
                    signOut(auth);
                    alert('Access denied: Please use a vit.ac.in or vitstudent.ac.in email address.');
                }
            })
            .catch((error) => {
                console.error('Error during Google login:', error);
            });
    });

    // Email and Password Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validate email domain
        if (!isValidEmailDomain(email)) {
            alert('Access denied: Please use a vit.ac.in or vitstudent.ac.in email address.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Successfully logged in
                window.location.href = 'acknowledgement.html'; // Redirect to another page after login
            })
            .catch((error) => {
                console.error('Error logging in:', error);
            });
    });
});
