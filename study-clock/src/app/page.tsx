"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import styles from "@/app/ui/home.module.css";
import { Clock } from "@/components/clock";
import { Input } from "@/components/ui/input";
import { StartStopButton, SwitchButton } from "@/components/controls";

export default function Home() {
    const [state, setState] = useState<"homescreen" | "study" | "break">("homescreen")
    const inputRef = useRef<HTMLInputElement>(null)
    const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
    const [breakTime, setBreakTime] = useState({ hours: 0, minutes: 0, seconds: 0 })

    // Wrapper for clock display + invisible input 
    // So you can click on clock display of breaktimer to set a new time
    function breakTimer() {
        const [inputValue,setInputValue] = useState("");
        const [breakCache,setBreakCache] = useState("");

        const handleKeyDown = (e: React.KeyboardEvent) => {
            var block_set = ["e","-","+"]
            if(block_set.includes(e.key)){
                e.preventDefault()
            }
            var text = String(inputRef.current?.value)
            if(e.code == "Backspace" && text == ""){
                text = "0"
                setInputValue("0")
                processRawInputValue(text)
            }
            if(e.code == "Escape"){
                setInputValue(breakCache)
                processRawInputValue(breakCache)
            }
        }
        
        const handleOnClick = () => {
            inputRef.current?.focus()
        }
        
        const handleOnBlur = () => {
            setBreakCache(inputValue)
            setInputValue("")
        }
        
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/[^0-9]/g, "")
            setInputValue(value)
            processRawInputValue(value)
        }
        
        const processRawInputValue = (value: String) => {
            var text  = value.padStart(6,"0")
            const hours = Number.parseInt(text.substring(0, 2))
            const minutes = Number.parseInt(text.substring(2, 4))
            const seconds = Number.parseInt(text.substring(4, 6))
            setBreakTime({hours:hours,minutes:minutes,seconds:seconds})
        }

        return (
            <div onClick={handleOnClick}>
                <Clock label="Break clock" time={breakTime} />
                <Input
                    ref={inputRef}
                    id="break-input"
                    type="number"
                    value={inputValue}
                    className="absolute opacity-0 w-0 h-0 -z-10"
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                    onBlur={handleOnBlur}
                />
            </div>
        )
    }

    return (
        <div className={styles.main}>
            <div>
                <Clock label="Study clock" time={studyTime} />
                {breakTimer()}
                {state != "homescreen" && <SwitchButton state={state} setState={setState}/ > }
                <StartStopButton state={state} setState={setState}/>
            </div>
        </div>
    )
}
