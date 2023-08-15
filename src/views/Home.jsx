import React, { Fragment, useEffect, useState } from 'react'
import "../styles/home.css"
import axios from "axios"
import Topbar from '../components/Topbar'
import Loading from '../components/Loading'
import Select from 'react-select'
import URL_BASE from '../config'

function Home() {
  const [cards, setCards] = useState([])
  const [cardCounters, setCardCounters] = useState([])
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)

  const getCards = async () => {
    setLoading(true)
    // ALL CARDS
    let data = await axios.get(`${URL_BASE}/api/cards`)
    let filteredData = data.data.filter(e => e.type !== "Character")
    // ALL COUNTER CARDS
    let dataCounter = await axios.get(`${URL_BASE}/api/cardCounters`)
    // FILTER ALL CARDS DUPLICATE
    dataCounter.data.forEach(e => {
      filteredData = filteredData.filter(x => x._id !== e.refId)
    });

    setCards(filteredData)
    setCardCounters(dataCounter.data)

    let tempOptions = []
    filteredData.forEach(e => {
      tempOptions.push({ value: e._id, label: e.name })
    });
    setOptions(tempOptions)
    setLoading(false)
  }

  const addCardTable = async (id) => {
    setLoading(true)
    const card = cards.find(e => e._id === id)
    await axios({
      method: 'post',
      url: `${URL_BASE}/api/cardCounters`,
      data: {
        "name": card.name,
        "image": card.image,
        "refId": id,
        "counter": 0,
      }
    })
    await getCards()
    setLoading(false)
  }

  const addCounter = async (card) => {
    setLoading(true)
    await axios({
      method: 'put',
      url: `${URL_BASE}/api/cardCounters/${card._id}`,
      data: {
        "name": card.name,
        "image": card.image,
        "refId": card.refId,
        "counter": card.counter + 1,
      }
    })
    const dataCounter = await axios.get(`${URL_BASE}/api/cardCounters`)
    setCardCounters(dataCounter.data)
    setLoading(false)
  }

  const substractCounter = async (card) => {
    setLoading(true)
    await axios({
      method: 'put',
      url: `${URL_BASE}/api/cardCounters/${card._id}`,
      data: {
        "name": card.name,
        "image": card.image,
        "refId": card.refId,
        "counter": card.counter - 1,
      }
    })
    const dataCounter = await axios.get(`${URL_BASE}/api/cardCounters`)
    setCardCounters(dataCounter.data)
    setLoading(false)
  }
  const deleteCardCounter = async (card) => {
    setLoading(true)
    await axios({
      method: "delete",
      url: `${URL_BASE}/api/cardCounters/${card._id}`,
    })
    await getCards()
    setLoading(false)
  }
  useEffect(() => {
    getCards()
  }, [])


  return (
    <div>
      <Topbar />
      <h1 className='text-center'>Four Souls - Contador</h1>
      {loading
        ? <Loading />
        : <Fragment>
          <Select options={options} onChange={(e) => addCardTable(e.value)} />
          <div className='group-cards'>
            {cardCounters.map(card =>
              <div
                key={card._id}
                className='card'
                style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                <div
                  onClick={() => deleteCardCounter(card)}
                  className='delete-counter'
                >
                  X
                </div>
                <h3 className='text-center'>
                  {card.name}
                </h3>
                <img src={card.image} alt={card.name} style={{ width: '150px', margin: 'auto' }} />
                <div className='button-group'>
                  <button className='delete-button' style={{ fontSize: "1.5rem", padding: "5px 15px" }} onClick={() => substractCounter(card)}>-</button>
                  <span style={{ fontSize: "1.5rem" }}>{card.counter}</span>
                  <button className='update-button' style={{ fontSize: "1.5rem", padding: "5px 15px" }} onClick={() => addCounter(card)}>+</button>
                </div>
              </div>
            )}
          </div>
        </Fragment>
      }
    </div>
  )
}

export default Home
