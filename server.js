import express from "express";
import cors from "cors";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import db from "./firebase.js";

const app = express();
app.use(express.json());




// ===================== CORS FIX =====================
const allowedOrigins = [
  "http://localhost:3000", 
  "https://movies-review-53dfa.web.app" 
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());




// REGISTER USER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    // Check if email already exists
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return res.status(400).json({ error: "Email already exists" });

    // Add new user
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
      password, // In production, hash passwords!
      profilePic: profilePic || "",
      joinedAt: Timestamp.now(),
    });

    res.json({ id: docRef.id, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// LOGIN USER
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const q = query(collection(db, "users"), where("email", "==", email), where("password", "==", password));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return res.status(400).json({ error: "Invalid credentials" });

    const user = snapshot.docs[0].data();
    const id = snapshot.docs[0].id;

    res.json({ id, name: user.name, email: user.email, profilePic: user.profilePic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login user" });
  }
});


// ===================== MOVIES =====================
app.get("/api/movies", async (req, res) => {
  try {
    const moviesSnap = await getDocs(collection(db, "movies"));
    const movies = moviesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.post("/api/movies", async (req, res) => {
  try {
    const { title, genre, poster, description, year } = req.body;
    const docRef = await addDoc(collection(db, "movies"), {
      title,
      genre,
      poster,
      description,
      year,
      averageRating: 0,
      createdAt: Timestamp.now(),
    });
    res.json({ id: docRef.id, message: "Movie added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// ===================== USERS =====================
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, profilePic } = req.body;
    const docRef = await addDoc(collection(db, "users"), {
      name,
      email,
      profilePic,
      joinedAt: Timestamp.now(),
    });
    res.json({ id: docRef.id, message: "User added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const userRef = doc(db, "users", req.params.id);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return res.status(404).json({ error: "User not found" });
    res.json({ id: userSnap.id, ...userSnap.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});


// ===================== REVIEWS =====================
app.get("/api/reviews/:movieId", async (req, res) => {
  try {
    const q = query(collection(db, "reviews"), where("movieId", "==", req.params.movieId));
    const snap = await getDocs(q);
    const reviews = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { movieId, userId, userName, rating, comment } = req.body;
    const docRef = await addDoc(collection(db, "reviews"), {
      movieId,
      userId,
      userName,
      rating,
      comment,
      createdAt: Timestamp.now(),
    });
    res.json({ id: docRef.id, message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add review" });
  }
});

app.put("/api/reviews/:id", async (req, res) => {
  try {
    const reviewRef = doc(db, "reviews", req.params.id);
    await updateDoc(reviewRef, req.body);
    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const reviewRef = doc(db, "reviews", req.params.id);
    await deleteDoc(reviewRef);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// ===================== SERVER START =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));