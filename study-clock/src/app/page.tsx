"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import styles from "@/app/ui/home.module.css";
import { Clock } from "@/components/clock";
import { Input } from "@/components/ui/input";

export default function Home() {
    const inputRef = useRef<HTMLInputElement>(null)
    const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
    const [breakTime, setBreakTime] = useState({ hours: 0, minutes: 0, seconds: 0 })

    // Wrapper for clock display + invisible input 
    // So you can click on clock display of breaktimer to set a new time
    function breakTimer() {
        const handleKeyDown = (e: React.KeyboardEvent) => {
            console.log(e.key)
        }
        
        const handleOnClick = () => {
            inputRef.current?.focus()
        }

        return (
            <div onClick={handleOnClick}>
                <Clock label="Break clock" time={breakTime} />
                <Input
                    ref={inputRef}
                    id="break-input"
                    type="number"
                    className="absolute opacity-0 w-0 h-0 -z-10"
                    onKeyDown={handleKeyDown}
                />
            </div>
        )
    }

    return (
        <div className={styles.main}>
            <div>
                <Clock label="Study clock" time={studyTime} />
                {breakTimer()}
            </div>
        </div>
    );
}
