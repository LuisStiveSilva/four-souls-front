import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/create-card.css'
import axios from 'axios';
import Topbar from '../components/Topbar';
import URL_BASE from '../config';

function CreateCard() {
  const [card, setCard] = useState({ name: '', image: '', type: '' })
  const { id } = useParams()
  const navigate = useNavigate()

  const getCardById = async () => {
    const data = await axios.get(`${URL_BASE}/api/cards/${id}`)
    const { name, image, type } = data.data
    console.log(type);
    setCard({ name, image, type })
  }

  useEffect(() => {
    if (id !== 'create')
      getCardById()
  }, [])

  const submitData = async () => {
    try {
      if (id !== 'create')
        await axios({
          method: 'put',
          url: `${URL_BASE}/api/cards/${id}`,
          data: {
            "name": card.name,
            "image": card.image,
            "type": card.type
          }
        })
      else
        await axios({
          method: 'post',
          url: `${URL_BASE}/api/cards`,
          data: {
            "name": card.name,
            "image": card.image,
            "type": card.type
          }
        })
      navigate('/admin')
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='form'>
      <Topbar />
      <label htmlFor="name">
        Nombre
        <input
          name="name"
          type="text"
          placeholder='Ingrese el nombre'
          value={card.name}
          onChange={e => setCard({ ...card, name: e.target.value })}
        />
      </label>
      <label htmlFor="image">
        Imagen
        <input
          name="image"
          type="text"
          placeholder='Ingrese la ruta de la imagen'
          value={card.image}
          onChange={e => setCard({ ...card, image: e.target.value })}
        />
      </label>
      <label htmlFor="type">
        Tipo
        <select
          name="type"
          value={card.type}
          onChange={e => setCard({ ...card, type: e.target.value })}
        >
          <option value={null}>Elije</option>
          <option value="item">Item</option>
          <option value="trinket">Baratija</option>
          <option value="eternal">Eterno</option>
          <option value="soul">Alma</option>
          <option value="monster">Monstruo</option>
          <option value="character">Personaje</option>
        </select>
      </label>
      <button className='add-button' onClick={submitData}>GUARDAR</button>
    </div>
  )
}

export default CreateCard
