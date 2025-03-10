import { useState } from 'react'

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  const totalFeedback = good + neutral + bad
  const average = (good - bad) / totalFeedback || 0
  const positivePercentage = totalFeedback > 0 ? (good / totalFeedback) * 100 : 0

  return (
    <div>
      <h1>Unicafe Feedback App</h1>

      <div>
        <h2>Give Feedback:</h2>
        <Button text="Good" handleClick={handleGood} />
        <Button text="Neutral" handleClick={handleNeutral} />
        <Button text="Bad" handleClick={handleBad} />
      </div>

      {totalFeedback === 0 ? (
        <p>No feedback given</p>
      ) : (
        <div>
          <h2>Statistics:</h2>
          <table>
            <tbody>
              <StatisticLine text="Good" value={good} />
              <StatisticLine text="Neutral" value={neutral} />
              <StatisticLine text="Bad" value={bad} />
              <StatisticLine text="All" value={totalFeedback} />
              <StatisticLine text="Average" value={average.toFixed(2)} />
              <StatisticLine text="Positive" value={`${positivePercentage.toFixed(2)}%`} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App