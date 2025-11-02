// src/pages/Home.js
import React, { useEffect, useState } from "react";
import API from "../api";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import "./Home.css";

function Home({ user, setUser }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get("/movies");
        const movieList = Array.isArray(res.data)
          ? res.data
          : res.data.movies || [];
        setMovies(movieList);
        setFilteredMovies(movieList);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // ✅ Combine genre + search filtering
  useEffect(() => {
    let result = [...movies];

    if (selectedGenre !== "All") {
      result = result.filter((m) =>
        m.genre?.split(",").map((g) => g.trim()).includes(selectedGenre)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.genre?.toLowerCase().includes(q)
      );
    }

    setFilteredMovies(result);
  }, [movies, selectedGenre, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // ✅ Genres
  const genres = Array.from(
    new Set(
      movies.flatMap((m) =>
        m.genre ? m.genre.split(",").map((g) => g.trim()) : []
      )
    )
  );

  const trending = filteredMovies.filter((m) => m.rating >= 4);
  const topRated = filteredMovies.filter((m) => m.averageRating >= 4.5);
  const newReleases = filteredMovies.filter((m) => Number(m.year) >= 2023);
  const heroMovie = filteredMovies[0];

  return (
    <div className="home-container">
      {/* ✅ Add header with search support */}
       <h1>WELCOME TO V-WATCH</h1>

      {/* Top-right login/register buttons */}
      {!user && (
        <div className="top-auth-buttons">
          <Link to="/login" className="btn btn-login">
            Login
          </Link>
          <Link to="/register" className="btn btn-register">
            Register
          </Link>
        </div>
      )}

      {/* Genre Selector */}
      <div className="genre-selector">
        <button
          className={selectedGenre === "All" ? "active" : ""}
          onClick={() => setSelectedGenre("All")}
        >
          All
        </button>
        {genres.map((genre) => (
          <button
            key={genre}
            className={selectedGenre === genre ? "active" : ""}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Hero Banner */}
      {heroMovie && (
        <div
          className="hero-banner"
          style={{
            backgroundImage: heroMovie.poster
              ? `url(${heroMovie.poster})`
              : `url("https://via.placeholder.com/1200x600?text=No+Poster")`,
          }}
        >
          <div className="hero-overlay">
            <h1 className="hero-title">{heroMovie.title}</h1>
            <p className="hero-description">
              {heroMovie.description || "No description available."}
            </p>
          </div>
        </div>
      )}

      {/* Popular Movies */}
      <div className="section">
        <h2>🎬 Popular Movies</h2>
        {loading ? (
          <p className="loading">Loading movies...</p>
        ) : filteredMovies.length > 0 ? (
          <div className="movie-row">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id || movie.title} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="loading">No movies found.</p>
        )}
      </div>

      {/* Trending */}
      <div className="section">
        <h2>🔥 Trending</h2>
        {trending.length > 0 ? (
          <div className="movie-row">
            {trending.map((movie) => (
              <MovieCard key={movie.id || movie.title} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="loading">No trending movies yet.</p>
        )}
      </div>

      {/* Top Rated */}
      <div className="section">
        <h2>⭐ Top Rated</h2>
        {topRated.length > 0 ? (
          <div className="movie-row">
            {topRated.map((movie) => (
              <MovieCard key={movie.id || movie.title} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="loading">No top-rated movies yet.</p>
        )}
      </div>

      {/* New Releases */}
      <div className="section">
        <h2>🆕 New Releases</h2>
        {newReleases.length > 0 ? (
          <div className="movie-row">
            {newReleases.map((movie) => (
              <MovieCard key={movie.id || movie.title} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="loading">No new releases yet.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
