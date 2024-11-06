import React, { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/**
 * JokeList component.
 *
 * Fetches a list of jokes from the icanhazdadjoke API and allows users to vote on each joke.
 * The list of jokes is sorted by vote count each time a vote is cast.
 * Users can also refresh the list to load new jokes.
 *
 * Props:
 * - numJokesToGet (int): Number of jokes to fetch, defaults to 5.
 *
 * State:
 * - isLoading (boolean): Tracks loading state while fetching jokes.
 * - jokes (array): List of jokes, each with an id, text, and vote count.
 * - error (string|null): Holds error messages if fetching jokes fails.
 *
 * Renders:
 * - A loading spinner while fetching jokes
 * - An error message and retry button if the API call fails
 * - A list of Joke components sorted by vote count if fetching is successful
 */
function JokeList({ numJokesToGet = 5 }) {
  const [isLoading, setIsLoading] = useState(true);
  const [jokes, setJokes] = useState([]);
  const [error, setError] = useState(null);

  // Fetches jokes on initial component mount
  useEffect(() => {
    getJokes();
  }, []);

  /* Clears joke list, sets loading state, and fetches new jokes */
  async function generateNewJokes() {
    setIsLoading(true);
    setJokes([]);
    await getJokes();
  }

  /* Fetches a list of unique jokes from the API */
  async function getJokes() {
    try {
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        const { id, joke } = res.data;

        if (!seenJokes.has(id)) {
          seenJokes.add(id);
          jokes.push({ id, joke, votes: 0 });
        } else {
          console.log("duplicate found! Retrying...");
        }
      }

      setJokes(jokes);
      setIsLoading(false);
      setError(null); // Clear error if successful
    } catch (err) {
      console.error("Failed to fetch jokes:", err);
      setError("Failed to load jokes. Please try again.");
      setIsLoading(false);
    }
  }

  /**
   * Updates the vote count for a specific joke by id and sorts jokes by vote count.
   * @param {string} id - ID of the joke to be voted on.
   * @param {number} delta - Change in vote count (+1 or -1).
   */
  function vote(id, delta) {
    setJokes(jokes =>
        [...jokes]
            .map(j =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            )
            .sort((a, b) => b.votes - a.votes)  // Sort by votes in descending order
    );
  }

  return (
      <div className="JokeList">
        {isLoading ? (
            <div className="loading">
              <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        ) : error ? (
            <div className="error">
              <p>{error}</p>
              <button onClick={generateNewJokes}>Try Again</button>
            </div>
        ) : (
            <>
              <button
                  className="JokeList-getmore"
                  onClick={generateNewJokes}
              >
                Get New Jokes
              </button>

              {jokes.map(j => (
                  <Joke
                      text={j.joke}
                      key={j.id}
                      id={j.id}
                      votes={j.votes}
                      vote={vote}
                  />
              ))}
            </>
        )}
      </div>
  );
}

export default JokeList;
