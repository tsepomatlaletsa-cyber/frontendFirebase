// src/pages/Movies.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MovieCard from "../components/MovieCard"; // use the same MovieCard as in Home
import "./Movies.css";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies");
        const data = response.data;
        setMovies(data);
        setFilteredMovies(data);

        // Extract unique genres
        const genreSet = new Set();
        data.forEach((movie) => {
          if (movie.genre) {
            movie.genre.split(",").forEach((g) => genreSet.add(g.trim()));
          }
        });
        setGenres(["All", ...Array.from(genreSet)]);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleGenreClick = (genre) => {
    setActiveGenre(genre);
    if (genre === "All") {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter((movie) =>
          movie.genre?.split(",").map((g) => g.trim()).includes(genre)
        )
      );
    }
  };

  if (loading)
    return <p style={{ color: "#fff", textAlign: "center" }}>Loading movies...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="movies-page">
      <h2 className="movies-title">🎬 Movies</h2>

      {/* Genre Filter Buttons */}
      <div className="genre-buttons">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-btn ${activeGenre === genre ? "active" : ""}`}
            onClick={() => handleGenreClick(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movies Grid */}
      <div className="movies-grid">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id || movie.title}
              movie={movie}
              onClick={() => navigate(`/movies/${movie.id}`)} // ✅ Clickable like Home.js
            />
          ))
        ) : (
          <p style={{ color: "#fff", textAlign: "center" }}>No movies found.</p>
        )}
      </div>
    </div>
  );
}
