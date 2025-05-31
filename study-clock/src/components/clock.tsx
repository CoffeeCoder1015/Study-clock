"use client"

import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, RefObject, useRef } from "react";
import { Input } from "./ui/input";

interface TimerProps {
    label: string
    time: { hours: number; minutes: number; seconds: number }
    className?: string
    isBreakTimer?: boolean
    value?:string
    onChange?: ChangeEventHandler<HTMLInputElement>
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>
    onBlur?: ChangeEventHandler<HTMLInputElement>
    ref? : RefObject<HTMLInputElement | null>
}

export const formatTime = (num: number) => num.toString().padStart(2, "0")

export function Clock({ label, time, className = "", isBreakTimer = false, value ,onChange,onKeyDown,onBlur,ref}: TimerProps)  {
    
    const handleOnClick = () => {
        ref?.current?.focus()
    }

    if (!isBreakTimer) {
        return (
            <div className={className}>
                <div className="text-2xl mb-4">{label}</div>
                <div className="text-8xl font-mono border-solid border-4 rounded-md focus-within:border-(--input-hover)">
                    <span id="hr">{formatTime(time.hours)}</span>:
                    <span id="min">{formatTime(time.minutes)}</span>:
                    <span id="sec">{formatTime(time.seconds)}</span>
                </div>
            </div>
        )
    } else {
        return ( <div className={className}>
            <div className="text-2xl mb-4">{label}</div>
            <div onClick={handleOnClick} className="text-8xl font-mono border-solid border-4 rounded-md focus-within:border-(--input-hover)">
                <div>
                    <span id="hr">{formatTime(time.hours)}</span>:
                    <span id="min">{formatTime(time.minutes)}</span>:
                    <span id="sec">{formatTime(time.seconds)}</span>
                </div>
                <Input
                    ref={ref}
                    id="break-input"
                    type="number"
                    value={value}
                    className="absolute opacity-0 w-0 h-0 -z-10"
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            </div>
        </div> )
    }
}
