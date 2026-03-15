import { useAuth } from './hooks/useAuth'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (!session) return <AuthPage />

  return <Dashboard userId={session.user.id} />
}
