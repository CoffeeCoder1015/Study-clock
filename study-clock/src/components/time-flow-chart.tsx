"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { dayStats, get_key, key } from "@/components/store/stats";
import { TrendingUp, TrendingDown } from "lucide-react";
import { DatePicker } from "./date-picker";
import { useEffect, useState } from "react";

// stats for comparing with previous sessions
function comparison_with_previous(label: string, current: number, previous: number) {
	const larger = current > previous
	var change = Math.abs(previous - current) / previous * 100
	if (previous === 0 && current === 0) {
		change = 0
	}
	const qualitative = larger ? "Increased" : "decreased"
	const TrendIcon = larger ? TrendingUp : TrendingDown
	return (
		<div className="flex items-center gap-2 leading-none font-medium">
			{label} has {qualitative} by {change.toFixed(1)}% from last time  <TrendIcon className="h-4 w-4" />
		</div>
	)
}

function max_stat(label: string, stat: number) {
	const formatTime = (num: string) => num.padStart(2, "0")
	var hours = (stat / 3600).toFixed(0)
	var remaining_sec = stat % 3600
	var minutes = (remaining_sec / 60).toFixed(0)
	remaining_sec %= 60
	return (
		<div>
			Longest {label} session of today is {formatTime(hours)}:{formatTime(minutes)}:{formatTime(remaining_sec.toString())}
		</div>
	)
}

export function MinuteEventChart(ingestData: dayStats, getter: (date: key) => dayStats) {
	const chartWidth = 800
	const chartHeight = 400
	const margin = { top: 30, right: 50, bottom: 55, left: 65 }
	const plotWidth = chartWidth - margin.left - margin.right
	const plotHeight = chartHeight - margin.top - margin.bottom

	// Calculate positions for blocks
	const getBlockPosition = (hour: number, startMinute: number, endMinute: number) => {
		const x = (hour / 23) * plotWidth
		const y = plotHeight - (endMinute / 60) * plotHeight
		const width = (plotWidth / 24) * 1.05 // 80% of hour width
		const height = ((endMinute - startMinute) / 60) * plotHeight

		return { x, y, width, height }
	}

	const getColor = (type: string) => {
		return type === "break" ? "#10b981" : "#3b82f6"
	}

	const [stats, setStats] = useState(ingestData)
	const [date, setDate] = useState<Date | undefined>((new Date()))

	useEffect(() => {
		setStats(getter(get_key(date)))
	}, [date, ingestData])

	return (
		<Card className="bg-(--stats-panel-bg) text-white">
			<CardHeader>
				<CardTitle>Event Duration Timeline  <DatePicker date={date} setDate={setDate} /> </CardTitle>
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
									x2={margin.left + plotWidth * (1+1/24)}
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
						{Array.from({ length: 25 }, (_, hour) => (
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
						{stats.sessions.map((event, idx) => {
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
										{`${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
Time: ${event.hour}:${event.startMinute.toFixed(1).toString().padStart(2, "0")} - ${event.hour}:${event.endMinute.toFixed(1).toString().padStart(2, "0")}
Duration: ${(event.endMinute - event.startMinute).toFixed(1)} minutes`}
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
				<div className="flex gap-10 text-sm text-muted-foreground">
					<div className="flex flex-col">
						{comparison_with_previous("Study time", stats.current_study, stats.previous_study)}
						{max_stat("studying", stats.max_study)}
					</div>
					<div className="flex flex-col">
						{comparison_with_previous("Break time", stats.current_break, stats.previous_break)}
						{max_stat("break", stats.max_break)}
					</div>
				</div>
			</CardFooter>
		</Card>
	)
}