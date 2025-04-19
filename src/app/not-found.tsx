import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Checkmate! Page Not Found</h2>
      
      <div className="mb-8 text-4xl">
        ♟️
      </div>
      
      <p className="mb-6 text-gray-600 max-w-md">
        Looks like this move led to a dead end. The page you're looking for has been captured or never existed.
      </p>
      
      <Link 
        href="/play" 
        className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
      >
        Back to the Game
      </Link>
    </div>
  )
}