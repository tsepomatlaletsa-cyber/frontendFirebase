// src/pages/MovieDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./MovieDetails.css";

function MovieDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    API.get("/movies")
      .then((res) => setMovie(res.data.find((m) => m.id === id)))
      .catch(console.error);

    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to submit a review");
    if (!newReview.comment || !newReview.rating) return;

    try {
      if (editingReviewId) {
        await API.put(`/reviews/${editingReviewId}`, { ...newReview });
        setEditingReviewId(null);
      } else {
        await API.post("/reviews", {
          movieId: id,
          userId: user.id,
          userName: user.name,
          comment: newReview.comment,
          rating: newReview.rating,
        });
      }
      setNewReview({ comment: "", rating: 0 });
      setHoverRating(0);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (rev) => {
    setEditingReviewId(rev.id);
    setNewReview({ comment: rev.comment, rating: rev.rating });
    setHoverRating(rev.rating);
  };

  const handleDelete = async (revId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`/reviews/${revId}`);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="movie-details-container">
      {movie ? (
        <>
          {/* Back Button */}
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

          {/* Movie Hero */}
          <div
            className="movie-hero"
            style={{ backgroundImage: `url(${movie.poster || "https://via.placeholder.com/1200x600?text=No+Poster"})` }}
          >
            <div className="movie-hero-overlay">
              <h1 className="movie-title">{movie.title}</h1>
              <p className="movie-genre-year">{movie.genre} | {movie.year}</p>
            </div>
          </div>

          {/* Movie Description */}
          <div className="movie-info card shadow rounded p-4 mt-4 animate-card">
            <p className="movie-description">{movie.description}</p>
          </div>

          {/* Reviews */}
          <h3 className="reviews-title mt-5">⭐ Reviews</h3>
          <div className="reviews-container">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="review-card card p-3 mb-3 shadow-sm d-flex align-items-start hover-card">
                  <div className="review-avatar">{rev.userName[0]}</div>
                  <div className="review-content ms-3 flex-grow-1">
                    <p className="review-user mb-1"><strong>{rev.userName}</strong> – ⭐ {rev.rating}</p>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                  {user && rev.userId === user.id && (
                    <div className="review-actions ms-3">
                      <button className="btn btn-edit me-2" onClick={() => handleEdit(rev)}>Edit</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(rev.id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>

          {/* Add/Edit Review Form */}
          {user ? (
            <form onSubmit={handleSubmit} className="review-form mt-4 card p-3 shadow-sm animate-card">
              <h5 className="text-warning">{editingReviewId ? "Edit Your Review" : "📝 Write a Review"}</h5>

              <textarea
                placeholder="Your review"
                className="form-control mb-2"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />

              {/* Star Rating */}
              <div className="star-rating mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoverRating || newReview.rating) ? "filled" : ""}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    ★
                  </span>
                ))}
              </div>

              <button className="btn btn-warning btn-hover">
                {editingReviewId ? "Update Review" : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="text-muted mt-3">Login to submit a review.</p>
          )}
        </>
      ) : (
        <p className="text-muted">Loading movie details...</p>
      )}
    </div>
  );
}

export default MovieDetails;
