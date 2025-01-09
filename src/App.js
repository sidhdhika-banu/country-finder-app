import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [country, setCountry] = useState(null);
  const [error, setError] = useState("");
  const [countriesList, setCountriesList] = useState([]);

  // Fetch country list once when the app loads
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Failed to fetch countries.");
        const data = await response.json();
        setCountriesList(data); // Store all countries
        console.log("Countries list fetched", data); // Debugging line
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCountries();
  }, []);

  // Handle searching and displaying suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = countriesList
      .filter((country) =>
        country.name.common.toLowerCase().startsWith(search.toLowerCase())
      )
      .map((country) => country.name.common);

    console.log("Filtered suggestions", filteredSuggestions); // Debugging line
    setSuggestions(filteredSuggestions);
  }, [search, countriesList]);

  // Handle country search when user selects a suggestion or clicks search
  const handleSearch = async (countryName) => {
    const query = countryName || search;
    if (!query.trim()) {
      setError("Please enter a country name.");
      setCountry(null);
      return;
    }
    setSearch(query);
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
      if (!response.ok) throw new Error("Country not found!");

      const data = await response.json();
      setCountry(data[0]);
      setError("");
    } catch (err) {
      setError(err.message);
      setCountry(null);
    }

    setSuggestions([]);
  };

  return (
    <div className="app">
      <Header />
      <main>
        <h1>Search Country Details</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter country name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => handleSearch()}>Search</button>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((name, index) => (
                <li key={index} onClick={() => handleSearch(name)}>
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        {country && (
          <div className="country-info">
            <h2>{country.name.common}</h2>
            <img
              src={country.flags.svg}
              alt={`${country.name.common} flag`}
              className="flag"
            />
            <p>
              <b>Capital:</b> {country.capital?.[0] || "N/A"}
            </p>
            <p>
              <b>Population:</b> {country.population.toLocaleString()}
            </p>
            <p>
              <b>Region:</b> {country.region}
            </p>
            <p>
              <b>Languages:</b>{" "}
              {Object.values(country.languages || {}).join(", ")}
            </p>
            <p>
              <b>Currencies:</b>{" "}
              {Object.values(country.currencies || {})
                .map((cur) => cur.name)
                .join(", ")}
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Country Info Finder</h1>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
  <div className="footer-content">
    <span>Developed by: M.S. Sidhdhikabanu</span>
    <span>Copyright © 2025</span>
    <span>
      Data Source:{" "}
      <a href="https://restcountries.com/" target="_blank" rel="noopener noreferrer">
        REST Countries API
      </a>
    </span>
    <span>
      Contact: <a href="mailto:sidhdhikabanu01@gmail.com">sidhdhikabanu01@gmail.com</a>
    </span>
  </div>
</footer>
  );
}

export default App;
