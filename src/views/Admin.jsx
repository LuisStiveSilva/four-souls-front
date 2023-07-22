import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Link } from "react-router-dom";
import Topbar from '../components/Topbar';
import URL_BASE from '../config';


function Admin() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  const getCards = async () => {
    setLoading(true)
    const data = await axios.get(`${URL_BASE}/api/cards`)
    setCards(data.data)
    setLoading(false)
  }

  const deleteCard = async (cardId) => {
    setLoading(true)
    await axios({
      method: "delete",
      url: `${URL_BASE}/api/cards/${cardId}`,
    })
    getCards()
    setLoading(false)
  }

  useEffect(() => {
    getCards()
  }, [])

  return (
    <div>
      <Topbar />
      <h1 className='text-center'>Admin</h1>

      <div className='center-div'>
        <Link className='link' to="/four-souls-front/admin/card/create">
          <button className='add-button'>AGREGAR CARTA</button>
        </Link>
      </div>

      <div className='group-cards'>
        {cards.map(card =>
          <div className='card' key={card._id}>
            <h3 className='text-center'>{card.name}</h3>
            <img src={card.image} alt="" />
            <div className='button-group'>
              <Link className='link' to={`/four-souls-front/admin/card/${card._id}`}>
                <button className='update-button'>
                  Editar
                </button>
              </Link>
              {/* {card.type !== "Character" && <button className='delete-button' onClick={() => deleteCard(card._id)}>Eliminar</button>} */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
