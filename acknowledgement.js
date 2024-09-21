// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);

// Monitor the current user and fetch their data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Fetch and display the user's name
        const displayName = user.displayName || user.email; // Use display name or email if not available
        document.getElementById('displayName').textContent = displayName;

        // Populate the username field in the form
        document.getElementById('formUser').value = displayName;

        // Optionally, fetch student data from Firestore if needed
        const q = query(collection(db, "students"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const studentData = querySnapshot.docs[0].data();
            // Populate the form fields with existing student data if needed
        }
    } else {
        console.log("No user is logged in.");
    }
});

// Form submission handler
document.getElementById("studentForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission to server

    // Collect form data
    const formUser = document.getElementById("formUser").value;
    const regNo = document.getElementById("regNo").value;
    const course = document.getElementById("course").value;
    const semester = document.getElementById("semester").value;
    const totalCredits = document.getElementById("totalCredits").value;
    const cgpa = document.getElementById("cgpa").value;
    const expectedCredits = document.getElementById("expectedCredits").value;
    const remainingCredits = 162 - totalCredits;
    const averageCreditsPerSem = (remainingCredits / (8 - semester)).toFixed(2);

    // Get the current logged-in user ID
    const user = auth.currentUser;

    if (user) {
        try {
            // Save form data to Firestore with the userId and username
            await addDoc(collection(db, "students"), {
                userId: user.uid,
                userName: formUser, // Save the username as well
                regNo: regNo,
                course: course,
                semester: semester,
                totalCredits: totalCredits,
                cgpa: cgpa,
                expectedCredits: expectedCredits,
                remainingCredits: remainingCredits,
                averageCreditsPerSem: averageCreditsPerSem,
                timestamp: new Date(),
            });

            // Prepare acknowledgment message
            const ackMessage = `
                You Have To Run For ${remainingCredits} Credits <br><br>
                Average Credits Per Semester To Complete Your Credits List: ${averageCreditsPerSem} <br>
                <br>Thank you for providing your details!
            `;

            // Display acknowledgment message
            document.getElementById("ackMessage").innerHTML = ackMessage;
            document.getElementById("acknowledgment").classList.remove("hidden");
        } catch (error) {
            console.error("Error saving to Firestore: ", error);
            alert("An error occurred while saving your details. Please try again.");
        }
    } else {
        alert("No user is logged in. Please log in to continue.");
    }
});
