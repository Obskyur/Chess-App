'use client'

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import AuthWrapper from '@/app/components/AuthWrapper'
import { GameMember } from '@/logic/chessLogic'

interface Game {
  id: string
  createdAt: Date
  history: string[]
  members: GameMember[]
  result?: string
}

export default function ReviewPage() {
  const [games, setGames] = useState<Game[]>([])
  const [expandedGame, setExpandedGame] = useState<string | null>(null)
  const [user] = useAuthState(auth)
  
  useEffect(() => {
    const fetchGames = async () => {
      const gamesQuery = query(
        collection(db, 'games'),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(gamesQuery)
      const gamesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Game[]
      
      setGames(gamesData)
    }
    
    fetchGames()
  }, [])

  const handleDelete = async (gameId: string) => {
    try {
      await deleteDoc(doc(db, 'games', gameId))
      setGames(games.filter(game => game.id !== gameId))
    } catch (error) {
      console.error('Error deleting game:', error)
    }
  }

  return (
    <AuthWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Game History</h1>
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="bg-bg-light p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                {game.members[0]?.name} vs {game.members[1]?.name}
                </h2>
                <p className="text-sm text-gray-400">
                {game.createdAt.toLocaleDateString()} -{' '}
                {game.result || 'Ongoing'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                onClick={() => 
                  setExpandedGame(expandedGame === game.id ? null : game.id)}
                className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                >
                {expandedGame === game.id ? 'Hide' : 'Show'} Moves
                </button>
                {user?.phoneNumber === '+12082509089' && (
                <button
                  onClick={() => handleDelete(game.id)}
                  className="px-3 py-1 text-sm rounded bg-red-700 hover:bg-red-600 cursor-pointer"
                >
                  Delete
                </button>
                )}
              </div>
              </div>
              {expandedGame === game.id && (
              <div className="mt-4 pl-4 border-l-2 border-gray-700">
                {game.history.map((move, index) => (
                <div key={index} className="text-sm">
                  {index + 1}. {move}
                </div>
                ))}
              </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AuthWrapper>
  )
}