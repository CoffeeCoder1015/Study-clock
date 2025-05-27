"use client"

import { useState, useRef, useEffect, Dispatch, SetStateAction, useCallback, } from "react"

import homeStyles from "@/app/ui/home.module.css";
import sessionControlStyles from "@/app/ui/session.controls.module.css";
import { Clock } from "@/components/clock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface time { hours: number; minutes: number; seconds: number }
export default function Home() {
    const [state, setState] = useState<"homescreen" | "study" | "break">("homescreen")
    const inputRef = useRef<HTMLInputElement>(null)
    const [studyTime, setStudyTime] = useState<time>({ hours: 0, minutes: 0, seconds: 0 })
    const [breakTime, setBreakTime] = useState<time>({ hours: 0, minutes: 0, seconds: 0 })
    const [clockOrder,SetClockOrder] = useState("flex flex-col")
    
    const studyTimerRef = useRef<NodeJS.Timeout | null>(null)
    const breakTimerRef = useRef<NodeJS.Timeout | null>(null)

    const [inputValue, setInputValue] = useState("");
    const [breakCache, setBreakCache] = useState("");
    
    const alarmRef = useRef<HTMLAudioElement | null>(null)
    
    useEffect(() => {
        alarmRef.current = new Audio("/alarm.wav")
    },[])

    useEffect(()=>{
        console.log(state)
        if (state == "study") {
            resetTimers()
            startStudying()
        }else if (state == "break") {
            resetTimers()
            startBreak()
        }else{
            resetTimers()
        }
    },[state])
    
    const startStudying = useCallback(()=>{
        if (studyTimerRef.current) {
           return 
        }
        
        studyTimerRef.current = setInterval(() => {
            setStudyTime((prev) => { return recalculate({...prev,seconds:prev.seconds+1}) })
        }, 1000);
    },[])

    const startBreak = useCallback(()=>{
        if (breakTimerRef.current) {
           return 
        }
        
        var remainingTime = breakTime
        
        breakTimerRef.current = setInterval(() => {
            if (remainingTime.hours == 0 && remainingTime.minutes == 0 && remainingTime.seconds == 0) {
                if (alarmRef.current) {
                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => alarmRef.current?.play(), i * 1000)
                    }
                }
                if (breakTimerRef.current) {
                   clearInterval(breakTimerRef.current) 
                    breakTimerRef.current = null
                }
                return
            }
            remainingTime = recalculate({ ...remainingTime, seconds: remainingTime.seconds - 1 })
            if (document.activeElement != inputRef.current) {
                setBreakTime(remainingTime)
            }
        }, 1000);
    },[breakTime])
    
    const resetTimers = useCallback(() => {
        if (studyTimerRef.current) {
            clearInterval(studyTimerRef.current)
            studyTimerRef.current = null
            setStudyTime({hours:0,minutes:0,seconds:0})
        }
        if (breakTimerRef.current) {
            clearInterval(breakTimerRef.current)
            breakTimerRef.current = null
        }
        setInputValue(breakCache)
        processRawInputValue(breakCache)
    },[breakCache])
    
    function modulo(x :number, m: number) {
        return ( (x % m) + m ) % m
    }
    

    function recalculate({ hours,minutes,seconds }:time):time{
        var smult = 1
        var sec = seconds
        if (seconds < 0) {
            smult = 60 
        }

        var min = minutes + parseInt(( smult*sec/60 ).toString())
        sec = modulo(sec,60)
        var mmult = 1

        if (min < 0) {
           mmult = 60 
        }
        var hr  = hours + parseInt(( mmult*min/60 ).toString())
        min = modulo(min,60)
        return {
            seconds: sec,
            minutes: min,
            hours  : hr
        }
    }

    const processRawInputValue = (value: String) => {
        var text = value.padStart(6, "0")
        const hours = Number.parseInt(text.substring(0, 2))
        const minutes = Number.parseInt(text.substring(2, 4))
        const seconds = Number.parseInt(text.substring(4, 6))
        setBreakTime({ hours: hours, minutes: minutes, seconds: seconds })
    }


    // Wrapper for clock display + invisible input 
    // So you can click on clock display of breaktimer to set a new time
    function breakTimer() {
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
            setBreakTime(recalculate(breakTime))
        }
        
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            var value = e.target.value.replace(/[^0-9]/g, "")
            value = value.substring(value.length - 6, value.length)
            setInputValue(value)
            processRawInputValue(value)
            if (breakTimerRef.current) {
                clearInterval(breakTimerRef.current)
                breakTimerRef.current = null
            }
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
