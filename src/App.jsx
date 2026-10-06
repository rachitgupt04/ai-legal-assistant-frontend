import { useState } from "react";
import "./App.css";

const API_URL =
  "https://ai-legal-assistant-backend-2.onrender.com/ask";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async (question = query) => {
    const userQuery = question.trim();

    if (!userQuery || loading) return;

    setQuery(userQuery);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to get response from legal assistant."
        );
      }

      console.log("Backend response:", data);

      setResult(data);
    } catch (err) {
      console.error("API Error:", err);

      setError(
        err.message ||
          "Backend se connection nahi ho pa raha. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "What is Article 14?",
    "What is Article 21?",
    "What are Fundamental Rights?",
    "What is freedom of speech?",
  ];

  return (
    <div className="app">
      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">⚖️</div>

          <div>
            <h1>AI Legal Assistant</h1>
            <p>Indian Legal Information • RAG Based</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          RAG System
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="main">

        {/* ================= HERO ================= */}

        <section className="hero">
          <div className="hero-badge">
            AI-POWERED LEGAL INFORMATION
          </div>

          <h2>
            Understand Indian Law
            <br />
            <span>in Simple Language.</span>
          </h2>

          <p>
            Ask questions about the Constitution of India and get
            context-grounded legal information with relevant sources.
          </p>
        </section>

        {/* ================= SEARCH ================= */}

        <section className="search-card">
          <label>Ask your legal question</label>

          <div className="search-box">
            <input
              type="text"
              placeholder="e.g. What is Article 14?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askQuestion();
                }
              }}
              disabled={loading}
            />

            <button
              onClick={() => askQuestion()}
              disabled={loading || !query.trim()}
            >
              {loading ? "Thinking..." : "Ask →"}
            </button>
          </div>

          <div className="examples">
            <span>Try:</span>

            {examples.map((example) => (
              <button
                key={example}
                onClick={() => askQuestion(example)}
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        {/* ================= LOADING ================= */}

        {loading && (
          <section className="loading-card">
            <div className="loader"></div>

            <div>
              <strong>
                Searching legal knowledge base...
              </strong>

              <p>
                Finding relevant constitutional provisions and
                preparing your answer.
              </p>
            </div>
          </section>
        )}

        {/* ================= ERROR ================= */}

        {error && (
          <section className="error-card">
            <strong>⚠️ Connection Error</strong>

            <p>{error}</p>

            <small>
              The legal assistant backend may be waking up.
              Please try again in a few seconds.
            </small>
          </section>
        )}

        {/* ================= RESULT ================= */}

        {result && !loading && (
          <section className="result-section">

            <div className="section-title">
              <span>AI Response</span>

              <span className="grounded">
                ✓ Context Grounded
              </span>
            </div>

            {/* ANSWER */}

            <div className="answer-card">
              <div className="answer-icon">✦</div>

              <div className="answer-content">
                <h3>Answer</h3>

                <p className="answer-text">
                  {result.answer}
                </p>
              </div>
            </div>

            {/* SOURCES */}

            {result.sources &&
              result.sources.length > 0 && (
                <div className="source-card">

                  <div className="card-heading">
                    <span>📚</span>
                    <h3>Legal Sources</h3>
                  </div>

                  <div className="source-list">

                    {result.sources.map(
                      (source, index) => (
                        <div
                          className="source-item"
                          key={index}
                        >

                          <div>
                            <strong>
                              {source.document ||
                                "Constitution of India"}
                            </strong>

                            <p>
                              Article{" "}
                              {source.article}

                              {source.page
                                ? ` • Page ${source.page}`
                                : ""}
                            </p>
                          </div>

                          <span className="source-badge">
                            Source {index + 1}
                          </span>

                        </div>
                      )
                    )}

                  </div>
                </div>
              )}

            {/* NEXT STEPS */}

            {result.next_steps &&
              result.next_steps.length > 0 && (
                <div className="next-card">

                  <div className="card-heading">
                    <span>→</span>
                    <h3>Next Steps</h3>
                  </div>

                  <ul>
                    {result.next_steps.map(
                      (step, index) => (
                        <li key={index}>
                          {step}
                        </li>
                      )
                    )}
                  </ul>

                </div>
              )}

            {/* DISCLAIMER */}

            {result.disclaimer && (
              <div className="disclaimer">

                <strong>
                  ⚠️ Important Disclaimer
                </strong>

                <p>
                  {result.disclaimer}
                </p>

              </div>
            )}

          </section>
        )}

        {/* ================= INITIAL INFO ================= */}

        {!result &&
          !loading &&
          !error && (
            <section className="info-grid">

              <div>
                <span>01</span>

                <h3>Ask</h3>

                <p>
                  Enter your legal question in
                  English, Hindi or Hinglish.
                </p>
              </div>

              <div>
                <span>02</span>

                <h3>Retrieve</h3>

                <p>
                  Relevant information is retrieved
                  from the legal knowledge base.
                </p>
              </div>

              <div>
                <span>03</span>

                <h3>Understand</h3>

                <p>
                  Get a simple explanation along
                  with relevant legal sources.
                </p>
              </div>

            </section>
          )}
      </main>

      {/* ================= FOOTER ================= */}

      <footer>
        <p>
          AI Legal Assistant • RAG-based Legal Information System
        </p>

        <p>
          For informational purposes only • Not legal advice
        </p>
      </footer>
    </div>
  );
}

export default App;