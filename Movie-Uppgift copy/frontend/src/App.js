




import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [genre, setGenre] = useState(''); 
  const [year, setYear] = useState(''); 
  const [searchType, setSearchType] = useState('top100'); 

  
  const fetchMovies = useCallback(async () => {
    try {
      let url = '';
      if (searchType === 'top100') {
        url = `/api/movies/top100`;
      } else if (searchType === 'top50') {
        url = `/api/movies/top50/genre/${genre}`;
      } else if (searchType === 'top25') {
        url = `/api/movies/top25/year/${year}`;
      }
      const res = await axios.get(url);
      const moviesData = res.data;
      setPageCount(Math.ceil(moviesData.length / 10));
      setMovies(moviesData.slice(currentPage * 10, (currentPage + 1) * 10));
    } catch (err) {
      console.error(err);
    }
  }, [currentPage, genre, year, searchType]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setCurrentPage(0); 
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <div className="App">
      <h1>Movie Finder</h1>

     
      <div>
        <label>
          <input
            type="radio"
            value="top100"
            checked={searchType === 'top100'}
            onChange={handleSearchTypeChange}
          />
          Top 100 Movies
        </label>
        <label>
          <input
            type="radio"
            value="top50"
            checked={searchType === 'top50'}
            onChange={handleSearchTypeChange}
          />
          Top 50 by Genre
        </label>
        <label>
          <input
            type="radio"
            value="top25"
            checked={searchType === 'top25'}
            onChange={handleSearchTypeChange}
          />
          Top 25 by Year
        </label>
      </div>

  
      {searchType === 'top50' && (
        <div>
          <label>
            Genre:
            <input type="text" value={genre} onChange={handleGenreChange} />
          </label>
        </div>
      )}

      
      {searchType === 'top25' && (
        <div>
          <label>
            Year:
            <input type="number" value={year} onChange={handleYearChange} />
          </label>
        </div>
      )}

      <div className="movies">
        {movies.map((movie, index) => (
          <div key={index} className="movie">
            <img src={movie.poster} alt={movie.title} />
            <h2>{movie.title}</h2>
            <p>Rating: {movie.imdb.rating}</p>
            <p>Year: {movie.year}</p>
          </div>
        ))}
      </div>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default App;

