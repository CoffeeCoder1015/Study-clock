"use client"

import { useState, useRef, } from "react"

import homeStyles from "@/app/ui/home.module.css";
import sessionControlStyles from "@/app/ui/session.controls.module.css";
import { Clock } from "@/components/clock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
    const [state, setState] = useState<"homescreen" | "study" | "break">("homescreen")
    const inputRef = useRef<HTMLInputElement>(null)
    const [studyTime, setStudyTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
    const [breakTime, setBreakTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
    const [clockOrder,SetClockOrder] = useState("flex flex-col")


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
            <div onClick={handleOnClick} className={getAnimation("break")}>
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
    
    const sessionSwitch = () => {
        if (state == "study") {
            SetClockOrder("flex flex-col-reverse")
            setState("break") 
        }else{
            SetClockOrder("flex flex-col")
            setState("study")
        }
    }
    
    const startStop = () => {
        if (state == "homescreen") {
           setState("study") 
        }else{
            setState("homescreen")
        }
        SetClockOrder("flex-col")
    }
    
    const getAnimation = (type:string):string => {
        if(type == "break"){
            if (state == "break") {
               return sessionControlStyles.slidein 
            }else if (state == "study"){
                return sessionControlStyles.slideout 
            }
        }else if (type == "study"){
            if (state == "break") {
                return sessionControlStyles.slideout 
            }else if (state == "study"){
                return sessionControlStyles.slidein 
            }            
        }
        return ""
    }
    
    return (
        <div className={homeStyles.main}>
            <div>
                <div className={clockOrder}>
                    <div className={getAnimation("study")}>
                        <Clock label="Study clock" time={studyTime} />
                    </div>
                    {breakTimer()}
                </div>
                <div className="relative z-10">
                    {state != "homescreen" && <Button onClick={sessionSwitch}>
                        {state == "study" ? "Break 🥳" : "Study 📝"}
                    </Button>}
                    <Button onClick={startStop}>
                        {state == "homescreen" ? "Start!" : "End!"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
