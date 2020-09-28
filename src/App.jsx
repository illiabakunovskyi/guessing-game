import React, { useEffect, useState, useRef } from 'react'
// components
import Modal from './components/ViewElements/Modal/Modal'
import History from './components/ViewElements/History/History'
import Button from './components/UIElements/Buttons/Button/Button'
// styles
import './App.css'
// constants
import { deck, api } from './utils/constants'

function App() {
  const [round, setRound] = useState(1)
  const [isModalVisible, setModalVisible] = useState(false)
  const [lastCard, setLastCard] = useState({})
  const [points, setPoints] = useState(0)
  const [history, setHistory] = useState({})

  const imageRef = useRef(null)

  const gamesHistory = JSON.parse(localStorage.getItem('gamesHistory'))
  const lastCardData = JSON.parse(localStorage.getItem('lastCard'))

  useEffect(() => {
    if (gamesHistory && gamesHistory[Object.keys(gamesHistory).length-1].round !== 30) {
      setModalVisible(true)
      setLastCard({
        value: gamesHistory && gamesHistory[Object.keys(gamesHistory).length-1].value,
        image: lastCardData && lastCardData.image
      })
      return
    }

    fetch(api.url + api.getRandomCard)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          setLastCard({ value: res.cards[0].value, image: res.cards[0].image})
          localStorage.setItem('lastCard', JSON.stringify({ image: res.cards[0].image }))
          // gamesHistory && setHistory(gamesHistory)
        }
      })
      .catch(err => console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (round === 31) {
      setRound(1)
      setPoints(0)
    }
  }, [round])

  useEffect(() => {
    localStorage.setItem('gamesHistory', JSON.stringify({ ...gamesHistory, ...history }))
  }, [gamesHistory, history])

  const handleClick = (param) => () => {
    fetch(api.url + api.getRandomCard)
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          const card = res.cards[0]
          let isWin = false

          setLastCard({ value: card.value, image: card.image})
          localStorage.setItem('lastCard', JSON.stringify({ image: card.image }))
          imageRef.current.src = card.image

          if (param === 'less' && deck.indexOf(card.value) < deck.indexOf(lastCard.value)) {
            setPoints(+(points + 0.1).toFixed(1))
            isWin = true
          }
          if (param === 'more' && deck.indexOf(card.value) > deck.indexOf(lastCard.value)) {
            setPoints(+(points + 0.1).toFixed(1))
            isWin = true
          }
          setRound(round + 1)

          setHistory({
            ...history,
            [Object.keys(history).length]:
              {
                value: card.value,
                result: isWin ? 'WIN' : 'LOSE',
                score: isWin ? +(points + 0.1).toFixed(1) : points,
                round: round
              }
          })
        }
      })
      .catch(err => console.log(err))
  }

  const handleContinueClick = (param) => () => {
    if (param === 'yes') {
      const lastRound = gamesHistory[Object.keys(gamesHistory).length-1]
      setPoints(
        lastRound.result === 'WIN'
        ? +(lastRound.score + 0.1).toFixed(1)
        : lastRound.score
        )
      setRound(lastRound.round + 1)
    }
    if (param === 'no') {
      fetch(api.url + api.getRandomCard)
      .then(res => res.json())
      .then(res => {
        setLastCard({ value: res.cards[0].value, image: res.cards[0].image})
        localStorage.setItem('lastCard', JSON.stringify({ image: res.cards[0].image }))
      })
      .catch(err => console.log(err))
    }
    setHistory(gamesHistory)
    setModalVisible(false)
  }

  return (
    <div className="App">
      {isModalVisible &&
        <Modal
          text={'Do you want to continue last game?'}
          onYesClick={handleContinueClick('yes')}
          onNoClick={handleContinueClick('no')}
        />
      }
      <div className="playing_table">
        <img ref={imageRef} src={lastCard && lastCard.image} alt={'card'} />
        <Button name={'less'} onClick={handleClick('less')} />
        <Button name={'more'} onClick={handleClick('more')} />
        <div>{'Score: ' + points}</div>
        <div>{'Round: ' + round + '/30'}</div>
        <br/>
        <History
          label={'History'}
          historyList={history}
        />
      </div>
    </div>
  )
}

export default App
