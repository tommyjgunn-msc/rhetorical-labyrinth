// app/page.tsx
import LoginForm from '@/components/LoginForm'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          The Rhetorical Labyrinth
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Professor Logos has been trapped in the Labyrinth of Persuasion by the Sophist!
          Can your team solve the puzzles and escape within 75 minutes?
        </p>
      </div>
      
      <LoginForm />
    </div>
  )
}