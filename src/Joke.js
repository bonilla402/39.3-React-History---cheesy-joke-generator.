import React from "react";
import "./Joke.css";

/**
 * Joke component.
 *
 * Represents a single joke with a voting interface.
 * Allows users to vote up or down and displays the current vote count.
 *
 * Props:
 * - id (string): Unique identifier for the joke.
 * - text (string): Text content of the joke.
 * - votes (number): Current vote count for the joke.
 * - vote (function): Function to handle voting, called with joke id and vote change (+1 or -1).
 *
 * Renders:
 * - The joke text
 * - Thumbs-up and thumbs-down buttons for voting
 * - The current vote count
 */
function Joke({ id, vote, votes, text }) {
    return (
        <div className="Joke">
            <div className="Joke-votearea">
                <button onClick={() => vote(id, +1)}>
                    <i className="fas fa-thumbs-up" />
                </button>

                <button onClick={() => vote(id, -1)}>
                    <i className="fas fa-thumbs-down" />
                </button>

                {votes}
            </div>

            <div className="Joke-text">{text}</div>
        </div>
    );
}

export default Joke;
