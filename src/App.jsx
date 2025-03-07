import { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewList from './components/ReviewList';

function App() {
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    fetchReviews();
  },[])

  const fetchReviews = () => {
    axios.get("/api/list_view")
      .then((response) => {
        setReviews([...response.data].reverse());
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  };

  const analyzeSentiment = (message) => {
    setLoading(true);
    const payload = { "review": message };
    
    axios.post("/api/analyze", payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        console.log("Analysis response:", response.data);
        fetchReviews();
        setMessage('');
      })
      .catch((error) => {
        console.error("Error analyzing sentiment:", error);
        alert("Error analyzing sentiment. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
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
