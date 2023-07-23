import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "../styles/singleTournament.css"
import Topbar from '../components/Topbar'
import URL_BASE from '../config'
import axios from 'axios'
import Loading from '../components/Loading'
import Select from 'react-select'

function SingleTournament() {
  const [tournament, setTournament] = useState(null)
  const [participantsOptions, setParticipantsOptions] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [disable, setDisable] = useState(false)
  const [options, setOptions] = useState([])
  const [tableData, setTableData] = useState([])
  const { id } = useParams()

  const getTournament = async () => {
    try {
      setLoading(true)
      let data = await axios.get(`${URL_BASE}/api/tournament/${id}`)
      let gameIds = []
      let winnersArray = []
      let counter = {}
      let tmpArr = []
      data.data.games.forEach(e => {
        gameIds.push(e._id)
        e.winner && winnersArray.push(e.winner)
      })
      for (let i = 0; i < winnersArray.length; i++) {
        let elemento = winnersArray[i];
        if (counter[elemento]) {
          counter[elemento]++;
        } else {
          counter[elemento] = 1;
        }
      }
      data.data.participants.forEach(e => {
        tmpArr.push({ player: e.name, wins: counter[e._id] || 0, id: e._id })
      })
      tmpArr.sort((a, b) => b.wins - a.wins)
      await getGamesByIds(gameIds)
      setTableData(tmpArr)
      setDisable(data.data.games.some(e => !e.winner))
      setTournament(data.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const getGamesByIds = async (ids) => {
    try {
      const data = await axios({
        method: 'post',
        url: `${URL_BASE}/api/game_ids`,
        data: { ids }
      })
      let tmpParticipants = []
      data.data[0]?.participants?.forEach(e => {
        tmpParticipants.push({ value: e.player._id, label: e.player.name })
      })
      setParticipantsOptions(tmpParticipants)
      setMatches(data.data)
    } catch (error) {
      console.error(error);
    }
  }

  const getCharactersCards = async () => {
    try {
      const data = await axios({
        method: 'get',
        url: `${URL_BASE}/api/cards_type/Character`,
      })
      let tmpOptions = []
      data.data.forEach(e => tmpOptions.push({ value: e._id, label: e.name }))
      setOptions(tmpOptions)
    } catch (error) {
      console.error(error);
    }
  }

  const createGame = async () => {
    try {
      if (disable) return
      setLoading(true)
      const newArr = []
      tournament.participants.map(e => newArr.push({ player: e._id }))
      const res = await axios({
        method: 'post',
        url: `${URL_BASE}/api/game`,
        data: {
          participants: newArr
        }
      })
      await axios({
        method: 'put',
        url: `${URL_BASE}/api/tournament/${id}`,
        data: {
          games: [...tournament.games, res.data._id]
        }
      })
      await getTournament()
    } catch (error) {
      console.error(error);
    }
    setLoading(false)
  }

  const assignCharacterToPlayer = async (match, idPlayer, idCard) => {
    try {
      let tmpArr = []
      match.participants.forEach(e => {
        if (e.character?._id)
          tmpArr.push({ player: e.player?._id ?? '', character: e.character?._id ?? null })
        else
          tmpArr.push({ player: e.player?._id ?? '' })
      })
      const index = tmpArr.findIndex(e => e.player === idPlayer)
      tmpArr[index] = { ...tmpArr[index], character: idCard }
      await axios({
        method: 'put',
        url: `${URL_BASE}/api/game/${match._id}`,
        data: {
          participants: tmpArr
        }
      })
      await getTournament()
    } catch (error) {
      console.error(error);
    }
  }

  const setGameWinner = async (match, userId) => {
    try {
      setLoading(true)
      await axios({
        method: 'put',
        url: `${URL_BASE}/api/game/${match._id}`,
        data: {
          winner: userId
        }
      })
      await getTournament()
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const checkOneWinner = () => {
    const firstPlacePoints = tableData[0].wins
    const secondPlacePoints = tableData[1].wins
    return firstPlacePoints > secondPlacePoints
  }

  const submitTournamentWinner = async () => {
    try {
      setLoading(true)
      if (!checkOneWinner()) return
      await axios({
        method: 'put',
        url: `${URL_BASE}/api/tournament/${id}`,
        data: {
          winner: tableData[0].id
        }
      })
    } catch (error) {
      console.error(error);
    } finally {
      await getTournament()
      setLoading(false)
    }
  }

  useEffect(() => {
    getCharactersCards()
    getTournament()
  }, [])

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Topbar />
      {loading
        ? <Loading />
        : <Fragment>
          {!tournament.winner &&
            <button
              className={`${!checkOneWinner() ? 'finish-disable' : 'finish-button'}`}
              onClick={submitTournamentWinner}
            >
              Terminar torneo
            </button>}
          {!checkOneWinner() && <p className='text-center' style={{ color: "red" }}>Tiene que haber uno solo en el primer lugar</p>}
          <table className="table">
            <thead>
              <tr className='table-head'>
                <td className='table-cell'>Jugador</td>
                <td className='table-cell'>Victorias</td>
              </tr>
            </thead>
            <tbody>
              {tableData.map((e, index) =>
                <tr key={index} >
                  <td className='table-cell'>{e.player}</td>
                  <td className='table-cell'>{e.wins || 0}</td>
                </tr>
              )}
            </tbody>
          </table>
          {!tournament.winner &&
            <div className={`create-game ${disable && 'disable'}`} onClick={() => createGame()}>
              Crear juego
            </div>
          }
          {matches?.map((match, index) => {
            return <Fragment key={index}>
              <div className="game">
                <p style={{ width: "100%" }}>Juego {index + 1}</p>
                {match.participants.map((x, index) =>
                  <div key={index} className={`${match.winner ? match.winner === x.player?._id ? 'card-winner' : 'card-loser' : 'game-card'}`}>
                    <p style={{ color: "white" }}>{x.player?.name ?? ''}</p>
                    <Select options={options} onChange={(e) => assignCharacterToPlayer(match, x.player._id, e.value)} />
                    {x.character?.image &&
                      <img src={x.character.image} alt={x.character.name} className='card-img' />}
                  </div>
                )}
                <div style={{ width: "100%" }}>
                  <p>Seleccione ganador</p>
                  <Select options={participantsOptions} onChange={(e) => setGameWinner(match, e.value)} />
                </div>
              </div>
            </Fragment>
          }).reverse()}
        </Fragment>}
    </div>
  )
}

export default SingleTournament
