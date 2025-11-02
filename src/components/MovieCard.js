import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";

function MovieCard({ movie, hoverPreview }) {
  const [hover, setHover] = useState(false);

  // Convert rating to stars safely
  const rating = Math.max(0, Math.min(5, movie.averageRating || 0));
  const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

  return (
    <div
      className={`card h-100 shadow-sm movie-card ${hoverPreview ? "hoverable" : ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link to={`/movie/${movie.id}`} className="no-underline">
        <img
          src={movie.poster || "https://via.placeholder.com/300x450?text=No+Poster"}
          alt={movie.title}
          className="card-img-top movie-poster"
        />
        <div className="movie-info">
          <h5>{movie.title}</h5>
          <p className="movie-rating">{stars}</p>
          <p className="movie-description">
            {movie.description?.slice(0, 60)}
            {movie.description?.length > 60 ? "..." : ""}
          </p>
        </div>

        {hover && hoverPreview && (
          <div className="hover-overlay">
            <h5>{movie.title}</h5>
            <p className="movie-rating">{stars}</p>
            <p className="hover-description">{movie.description}</p>
          </div>
        )}
      </Link>
    </div>
  );
}

export default MovieCard;
