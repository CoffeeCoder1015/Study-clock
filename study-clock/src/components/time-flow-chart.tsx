"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { session  } from "@/components/store/stats";

interface data{
  eventData: session[]  
}

export function MinuteEventChart({eventData}:data) {
  const chartWidth = 800
  const chartHeight = 400
  const margin = { top: 30, right: 20, bottom: 55, left: 65 }
  const plotWidth = chartWidth - margin.left - margin.right
  const plotHeight = chartHeight - margin.top - margin.bottom

  // Calculate positions for blocks
  const getBlockPosition = (hour: number, startMinute: number, endMinute: number) => {
    const x = (hour / 23) * plotWidth
    const y = plotHeight - (endMinute / 60) * plotHeight
    const width = (plotWidth / 24) *1.05 // 80% of hour width
    const height = ((endMinute - startMinute) / 60) * plotHeight

    return { x, y, width, height }
  }

  const getColor = (type: string) => {
    return type === "break" ? "#10b981" : "#3b82f6"
  }

  return (
    <Card className="bg-black text-white">
      <CardHeader>
        <CardTitle>Event Duration Timeline</CardTitle>
        <CardDescription>Events shown as blocks spanning from start to end time (Y-axis: 0-60 minutes)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg width={chartWidth} height={chartHeight} className="border border-gray-200">
            {/* Y-axis grid lines */}
            {[0, 10, 20, 30, 40, 50, 60].map((minute) => (
              <g key={minute}>
                <line
                  x1={margin.left}
                  y1={margin.top + plotHeight - (minute / 60) * plotHeight}
                  x2={margin.left + plotWidth}
                  y2={margin.top + plotHeight - (minute / 60) * plotHeight}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={margin.left - 10}
                  y={margin.top + plotHeight - (minute / 60) * plotHeight + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {minute}m
                </text>
              </g>
            ))}

            {/* X-axis grid lines and labels */}
            {Array.from({ length: 24 }, (_, hour) => (
              <g key={hour}>
                <line
                  x1={margin.left + (hour / 23) * plotWidth}
                  y1={margin.top}
                  x2={margin.left + (hour / 23) * plotWidth}
                  y2={margin.top + plotHeight}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={margin.left + (hour / 23) * plotWidth}
                  y={margin.top + plotHeight + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {hour}h
                </text>
              </g>
            ))}

            {/* Event blocks */}
            {eventData.map((event,idx) => {
              const { x, y, width, height } = getBlockPosition(event.hour, event.startMinute, event.endMinute)
              return (
                <g key={idx}>
                  <rect
                    x={margin.left + x}
                    y={margin.top + y}
                    width={width}
                    height={height}
                    fill={getColor(event.type)}
                    stroke="#ffffff"
                    strokeWidth="1"
                    rx="4"
                    className="cursor-pointer hover:opacity-80"
                  />
                  <title>
                    {`${event.type.charAt(0).toUpperCase() + event.type.slice(1)}\nTime: ${event.hour}:${event.startMinute.toString().padStart(2, "0")} - ${event.hour}:${event.endMinute.toString().padStart(2, "0")}\nDuration: ${event.endMinute - event.startMinute} minutes`}
                  </title>
                </g>
              )
            })}

            {/* Axis labels */}
            <text
              x={margin.left + plotWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="14"
              fill="#374151"
              fontWeight="500"
            >
              Hour of Day
            </text>
            <text
              x={15}
              y={margin.top + plotHeight / 2}
              textAnchor="middle"
              fontSize="14"
              fill="#374151"
              fontWeight="500"
              transform={`rotate(-90, 15, ${margin.top + plotHeight / 2})`}
            >
              Minute in Hour
            </text>
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm">Breaks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Studying</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          🦶
        </div>
      </CardFooter>
    </Card>
  )
}