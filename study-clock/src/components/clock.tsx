"use client"

interface TimerProps {
  label: string
  time: { hours: number; minutes: number; seconds: number }
}

export function Clock({ label, time}: TimerProps)  {
  const formatTime = (num: number) => num.toString().padStart(2, "0")
  return(
    <div>
      <div className="text-2xl mb-4">{label}</div>
      <div className="text-8xl font-mono border-solid border-4 rounded-md focus-within:border-(--input-hover)">
        <span id="hr">{formatTime(time.hours)}</span>:
        <span id="min">{formatTime(time.minutes)}</span>:
        <span id="sec">{formatTime(time.seconds)}</span>
      </div>
    </div>
  )
}