import React, { Fragment, useEffect, useState } from 'react'
import Topbar from '../components/Topbar'
import axios from "axios"
import URL_BASE from '../config'
import Loading from '../components/Loading'
import "../styles/games.css"
import { Link } from 'react-router-dom'

function Tournaments() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  const getGames = async () => {
    setLoading(true)
    const data = await axios.get(`${URL_BASE}/api/tournament`)    
    console.log(data.data);
    setGames(data.data)
    setLoading(false)
  }

  useEffect(() => {
    getGames()
  }, [])

  return (
    <div>
      <Topbar />
      {loading
        ? <Loading />
        : <Fragment>
          <div className='game-container'>
            {games.map((e, index) =>
              <Link className='link' to={`/four-souls-front/tournaments/${e._id}`} key={index}>
                <div key={e._id} className={e.winner ? 'game-completed' : 'game-progress'} >
                  <p>
                    PARTIDAS: {e.games.length}
                  </p>
                  <p>{e.winner ? `Ganador: ${e.winner.name}` : "En proceso"}</p>
                  {e.winner &&
                    <span className="material-symbols-outlined medal-icon">
                      workspace_premium
                    </span>
                  }
                </div>
              </Link>
            )}
            <Link className='link' to={`/four-souls-front/tournaments/create`}>
              <div className='empty-game'>
                <p className='text-center'>Crear campeonato</p>
                <span className="material-symbols-outlined add-icon">
                  add_circle
                </span>
              </div>
            </Link>
          </div>
        </Fragment>}
    </div>
  )
}

export default Tournaments
