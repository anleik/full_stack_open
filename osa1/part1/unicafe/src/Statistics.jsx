const Statistics = ({ good, neutral, bad }) => {
    const totalFeedback = good + neutral + bad
    const average = (good - bad) / totalFeedback || 0
    const positivePercentage = totalFeedback > 0 ? (good / totalFeedback) * 100 : 0
  
    return (
      <div>
        <h2>Statistics:</h2>
        <p>Good: {good}</p>
        <p>Neutral: {neutral}</p>
        <p>Bad: {bad}</p>
        <p>Total feedback: {totalFeedback}</p>
        <p>Average score: {average.toFixed(2)}</p>
        <p>Positive feedback percentage: {positivePercentage.toFixed(2)}%</p>
      </div>
    )
  }
  
  export default Statistics