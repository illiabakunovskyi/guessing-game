import React from 'react'
// styles
import './styles.css'

const History = (props) => {
  const { label, historyList } = props

  return (
    <div className="history">
      <div>{label}</div>
      <div className="history_body">
        {Object.values(historyList).reverse().map((item, index) => {
          return <div key={index}>
              {item.value + ' ' + item.result + ' ' + item.score}
            </div>
        })}
      </div>
    </div>
  )
}

export default History