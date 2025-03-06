function ReviewList({reviews}) {
  return (
    <div>
      <div className="row g-4">
        {reviews?.map((review) => (
          <div className="col-12" key={review.id || `review-${review.id}`}>
            <div className="card mb-2 shadow-sm">
              <div className="card-body">
                {/* Review Text */}
                <p className="card-text">{review.review}</p>

                {/* Sentiment Display */}
                <div className="mt-3">
                  <div className="row align-items-center">
                    <div className="col">
                      <span className="text-primary">{review.sentiment}
                        {review.sentiment === "Positive" ? "😊" : 
                        review.sentiment === "Negative" ? "😞" : 
                        review.sentiment === "Neutral" ? "😐" : ""
                        }
                      </span>
                    </div>
                    <div className="col-auto">
                      <span
                        className={`badge ms-2 ${
                          review.sentiment_score  >= 70
                            ? "bg-success"
                            : review.sentiment_score  >= 40
                            ? "bg-warning"
                            : "bg-danger"
                        }`}
                      >
                        {(review.sentiment_score)?.toFixed(1)}%
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