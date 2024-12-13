  import React, { useState, useEffect } from "react";
  import { HfInference } from "@huggingface/inference";
  import ReactMarkdown from "react-markdown";
  import remarkGfm from "remark-gfm";
  import "./App.css";

  function App() {
    const [weight, setWeight] = useState("");
    const [wingspan, setWingspan] = useState("");
    const [flightTime, setFlightTime] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      // Dynamically add Google Fonts link
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Montserrat&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      const link2 = document.createElement("link");
      link2.href = "https://fonts.googleapis.com/css2?family=Turret+Road:wght@200&display=swap";
      link2.rel = "stylesheet";
      document.head.appendChild(link2);
    }, []); // Empty dependency array ensures this runs once when the component mounts

    const handleSubmit = async () => {
      if (!weight || !wingspan || !flightTime) {
        alert("Please fill in all required fields!");
        return;
      }

      setLoading(true);
      const client = new HfInference("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");

      const prompt = `
        You are an expert in RC plane design. Based on the specifications below, provide detailed and actionable recommendations for:
        - Motor type (specific models or types)
        - Propeller size
        - Battery configuration (including battery type, capacity, and voltage)
        - Consider the following additional notes: ${additionalNotes}

        Specifications:
        - Weight: ${weight} kg
        - Wingspan: ${wingspan} m
        - Desired Flight Time: ${flightTime} minutes
        
        Format the recommendations in Markdown.
      `;

      try {
        const response = await client.chatCompletion({
          model: "meta-llama/Llama-3.2-1B-Instruct",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 750,
          temperature: 0.5,
        });

        setOutput(response.choices[0].message.content);
      } catch (error) {
        console.error("Error generating output:", error);
        setOutput("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="app">
        <header className="header">
          <h2>
            PlaneCraft.AI
          </h2>
          <div className="subtitle">
            <h2>AI enabled RC-Plane Calculator</h2>
          </div>
        </header>
        <div className="container">
          <div className="input-section">
            <h1 className="title">Input for RC Plane</h1>
            <div className="input-group">
              <label>Weight (kg):</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Wingspan (m):</label>
              <input
                type="number"
                value={wingspan}
                onChange={(e) => setWingspan(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Flight Time (minutes):</label>
              <input
                type="number"
                value={flightTime}
                onChange={(e) => setFlightTime(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Additional Notes:</label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Add any specific preferences or constraints..."
              />
            </div>
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Get Recommendations"}
            </button>
          </div>
          <div className="output-section">
            <h1>Recommendations</h1>
            <div className="output-box">
              {output ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {output}
                </ReactMarkdown>
              ) : (
                <p>Enter details and click "Get Recommendations" to see results.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default App;
