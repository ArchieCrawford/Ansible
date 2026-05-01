import { Button } from './ui/Button'

export function SplashScreen({ onEnter }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Asset Tracker
        </h1>
        <p className="mt-4 text-base text-slate-300">
          Demo build — track items and maintenance history.
        </p>
        <Button
          size="lg"
          onClick={onEnter}
          className="mt-10 bg-white text-slate-900 hover:bg-slate-100"
        >
          Enter
        </Button>
      </div>
    </div>
  )
}
