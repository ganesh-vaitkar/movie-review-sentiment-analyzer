import React from 'react'

function ReviewList({ reviews }) {
  return (
    <div>
      
      <div className="row g-4">
        {reviews?.map((review, index) => (
          <div className="col-12" key={index}>
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                {/* Review Text */}
                <p className="card-text">{review.text}</p>

                {/* Single Line Sentiment Display */}
                <div className="mt-3">
                  <div className="row align-items-center">
                    <div className="col">
                      <span className="text-primary">
                        This seems like a {review.sentiment_type} review. {
                          review.sentiment_type === 'very positive' ? '🤩' :
                          review.sentiment_type === 'positive' ? '😃' :
                          review.sentiment_type === 'neutral' ? '😐' :
                          review.sentiment_type === 'negative' ? '😕' :
                          review.sentiment_type === 'very negative' ? '😡' : '🤔'
                        }
                      </span>
                    </div>
                    <div className="col-auto">
                      <span className={`badge ms-2 ${
                        review.sentiment >= 75
                          ? "bg-success"
                          : review.sentiment >= 50
                          ? "bg-warning"
                          : "bg-danger"
                      }`}>
                        {review.sentiment}% Positive
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewList 