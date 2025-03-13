import { useState, useEffect } from 'react';
import ReviewList from './components/ReviewList';

function App() {
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  // For development, use Vite's proxy. For production, use direct API.
  const isDev = import.meta.env.DEV;
  const API_URL = isDev ? '/api' : 'https://ghanish.in';

  const fetchReviews = async () => {
    try {
      let data;
      if (isDev) {
        // In development, use fetch with the proxy
        const response = await fetch(`${API_URL}/list_view`);
        data = await response.json();
      } else {
        // In production (GitHub Pages), try direct fetch first
        try {
          const response = await fetch(`${API_URL}/list_view`, {
            mode: 'cors',
            headers: {
              'Accept': 'application/json'
            }
          });
          data = await response.json();
        } catch (error) {
          console.error("Direct fetch failed:", error);
          // If direct fetch fails, use a fallback method
          // Create a temporary iframe that will load the content
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          
          // Wait for the iframe to load
          await new Promise(resolve => {
            iframe.onload = resolve;
            iframe.src = `${API_URL}/list_view`;
          });
          
          // Try to extract data from iframe
          try {
            // This may still fail due to security restrictions
            data = JSON.parse(iframe.contentDocument.body.textContent);
          } catch (iframeError) {
            console.error("Iframe method failed:", iframeError);
            // Provide sample data as a last resort
            data = [
              {"id":1,"review":"Sample review","sentiment":"Positive","sentiment_score":95.0},
              {"id":2,"review":"Another sample","sentiment":"Negative","sentiment_score":20.0}
            ];
          } finally {
            // Clean up
            document.body.removeChild(iframe);
          }
        }
      }
      
      setReviews([...data].reverse());
    } catch (error) {
      console.error("Error fetching reviews:", error);
      
      // If all fails, use a hardcoded sample for demonstration
      setReviews([
        {"id":1,"review":"Sample review","sentiment":"Positive","sentiment_score":95.0},
        {"id":2,"review":"Another sample","sentiment":"Negative","sentiment_score":20.0}
      ]);
    }
  };

  const analyzeSentiment = async (message) => {
    setLoading(true);
    try {
      const payload = { "review": message };
      
      if (isDev) {
        // In development, use regular fetch with the proxy
        const response = await fetch(`${API_URL}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        console.log("Analysis response:", data);
      } else {
        // In production, try direct fetch first
        try {
          const response = await fetch(`${API_URL}/analyze`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            mode: 'cors'
          });
          
          const data = await response.json();
          console.log("Analysis response:", data);
        } catch (error) {
          console.error("Direct POST failed:", error);
          
          // Fallback to form submission - this opens in a new tab
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = `${API_URL}/analyze`;
          form.target = '_blank'; // Opens in new tab
          
          // Add hidden input with the review
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'review';
          input.value = message;
          form.appendChild(input);
          
          // Submit the form
          document.body.appendChild(form);
          form.submit();
          
          // Clean up
          document.body.removeChild(form);
          alert("Analysis opened in a new tab due to security restrictions");
        }
      }
      
      // Refresh reviews list
      await fetchReviews();
      setMessage('');
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      alert("Error analyzing sentiment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (message.trim()) {
      analyzeSentiment(message);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            {/* Header */}
            <div className="text-center mb-2">
              <h2 className="mb-3">Movie Review Sentiment Analyzer</h2>
              <p className="text-muted">Enter your movie review below to analyze its sentiment</p>
            </div>

            {/* Input Section */}
            <div className="card shadow-sm mb-5">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="reviewText" className="form-label">Your Review</label>
                  <textarea
                    className="form-control"
                    id="reviewText"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your movie review here..."
                  ></textarea>
                </div>
                <div className="text-end mt-3">
                  <button 
                    className="btn btn-primary px-4"
                    onClick={handleSubmit}
                    disabled={!message.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Reviews List Section */}
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
