interface TimerProps {
  timeLeft: number
}

export function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  
  return (
    <div className="text-center mb-6">
      <div className={`text-6xl font-mono font-bold ${timeLeft <= 60 ? "text-red-500 animate-pulse" : "text-foreground"}`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  )
}