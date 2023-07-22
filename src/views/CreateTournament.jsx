import React, { Fragment, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Topbar from '../components/Topbar'
import "../styles/create-game.css"
import axios from 'axios'
import URL_BASE from '../config'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'

function CreateGame() {
  const [users, setUsers] = useState([])
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getUsers = async () => {
    try {
      setLoading(true)
      const data = await axios.get(`${URL_BASE}/api/user`)
      let tmpArr = []
      data.data.map(e => tmpArr.push({ value: e._id, label: e.name }))
      setUsers(tmpArr)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const handleSelect = (options) => {
    let ids = []
    options.forEach(option => {
      ids.push(option.value)
    })
    setParticipants(ids)
  }

  const create = async () => {
    try {
      setLoading(true)
      if (participants.length > 1) {
        await axios({
          method: 'post',
          url: `${URL_BASE}/api/tournament`,
          data: {
            participants
          }
        })
        navigate(`/four-souls-front/tournaments`)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])


  return (
    <div>
      <Topbar />
      {loading
        ? <Loading />
        : <Fragment>
          <div style={{ margin: "20px auto" }}>
            <p>Seleccione jugadores</p>
            <Select
              isMulti
              name="players"
              options={users}
              onChange={(e) => handleSelect(e)}
            />
          </div>
          <button className='add-button' onClick={create}>Guardar torneo</button>
        </Fragment>
      }

    </div>
  )
}

export default CreateGame
