import React, { useState } from "react";
import Axios from "axios";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import { FcSpeaker } from "react-icons/fc";

function App() {
  // Setting up the initial states using react hook 'useState'
  const [data, setData] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [error, setError] = useState(null); // State for handling errors

  // Function to fetch information on button click, and set the data accordingly
  function getMeaning() {
    Axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`
    )
      .then((response) => {
        setData(response.data[0]);
        setError(null); // Clear previous errors
      })
      .catch((err) => {
        setError("Error fetching data, please try again.");
        console.error(err); // Log the error for debugging
      });
  }

  // Function to play and listen to the phonetics of the searched word
  function playAudio() {
    if (data.phonetics && data.phonetics[0] && data.phonetics[0].audio) {
      const audioUrl = data.phonetics[0].audio;
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        setError("Error playing audio.");
        console.error(err); // Log the error for debugging
      });
    } else {
      setError("Audio not available for this word.");
    }
  }

  return (
    <div className="App">
      <h1>Free Dictionary</h1>
      <div className="searchBox">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
        />
        <button
          onClick={() => {
            getMeaning();
          }}
        >
          <FaSearch size="20px" />
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
      {data && (
        <div className="showResults">
          <h2>
            {data.word}{" "}
            <button
              onClick={() => {
                playAudio();
              }}
            >
              <FcSpeaker size="26px" />
            </button>
          </h2>
          <h4>Parts of speech:</h4>
          <p>{data.meanings[0].partOfSpeech}</p>
          <h4>Definition:</h4>
          <p>{data.meanings[0].definitions[0].definition}</p>
          {data.meanings[0].definitions[0].example && (
            <>
              <h4>Example:</h4>
              <p>{data.meanings[0].definitions[0].example}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;