import { useState } from 'react';
// import axios from 'axios';
import ReviewList from './components/ReviewList';

function App() {
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate API call with dummy response
  const analyzeSentiment = async (text) => {
    setLoading(true);
    try {
      // In a real app, this would be your actual API endpoint
      // const response = await axios.post('https://api.example.com/analyze-sentiment', { text });
      
      // Simulated API response
      const dummyResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              text: text,
              sentiment: Math.floor(Math.random() * (100 - 30 + 1)) + 30, // Random score between 30-100
              sentiment_type: Math.random() > 0.5 ? 'positive' : 'negative'
            }
          });
        }, 1000); // Simulate network delay
      });

      const newReview = {
        text: dummyResponse.data.text,
        sentiment: dummyResponse.data.sentiment,
        sentiment_type: dummyResponse.data.sentiment_type
      };

      setReviews(prevReviews => [newReview, ...prevReviews]);
      setMessage(''); // Clear input
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      alert('Failed to analyze sentiment. Please try again.');
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
            <div className="text-center mb-4">
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
