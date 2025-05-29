"use client"

import { useState, useRef, useEffect, Dispatch, SetStateAction, useCallback, } from "react"

import homeStyles from "@/app/ui/home.module.css";
import sessionControlStyles from "@/app/ui/session.controls.module.css";
import buttonStyles from "@/app/ui/buttons.module.css";
import { Clock } from "@/components/clock";
import { Button } from "@/components/ui/button";
import { MinuteEventChart } from "@/components/time-flow-chart";
import { log_break_cache,get_break_cache} from "@/components/stats";

interface time { hours: number; minutes: number; seconds: number }
export default function Home() {
    const [state, setState] = useState<"homescreen" | "study" | "break">("homescreen")
    const inputRef = useRef<HTMLInputElement>(null)
    const [studyTime, setStudyTime] = useState<time>({ hours: 0, minutes: 0, seconds: 0 })
    const [breakTime, setBreakTime] = useState<time>({ hours: 0, minutes: 0, seconds: 0 })
    const [clockOrder,SetClockOrder] = useState("flex flex-col")
    
    const studyTimerRef = useRef<NodeJS.Timeout | null>(null)
    const breakTimerRef = useRef<NodeJS.Timeout | null>(null)

    const [inputValue, setInputValue] = useState("")
    const [breakCache, setBreakCache] = useState("")
    
    const [breakAnim, setBreakAnim] = useState("")
    const [studyAnim, setStudyAnim] = useState(sessionControlStyles.homescreen_state)
    
    const alarmRef = useRef<HTMLAudioElement | null>(null)
    
    useEffect(() => {
        alarmRef.current = new Audio("/alarm.wav")
        const cache_result = get_break_cache()
        setBreakCache(cache_result)
        processRawInputValue(cache_result)
    },[])

    useEffect(()=>{
        if (state == "study") {
            resetTimers()
            startStudying()
        }else if (state == "break") {
            resetTimers()
            startBreak()
        }else{
            resetTimers()
        }
    },[state,breakCache])
    
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
            processRawInputValue(breakCache)
            setBreakTime(recalculate(breakTime))
        }
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
    
    const handleOnBlur = () => {
        setBreakCache(inputValue)
        log_break_cache(inputValue)
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

    const sessionSwitch = () => {
        if (state == "study") {
            SetClockOrder("flex flex-col-reverse")
            setState("break") 
            setStudyAnim(sessionControlStyles.slideout)
            setBreakAnim(sessionControlStyles.slidein)
        }else{
            SetClockOrder("flex flex-col")
            setState("study")
            setStudyAnim(sessionControlStyles.slidein)
            setBreakAnim(sessionControlStyles.slideout)
        }
    }
    
    const startStop = () => {
        if (state == "homescreen") {
            setState("study")
            setBreakAnim(sessionControlStyles.start_session_b)
            setStudyAnim(sessionControlStyles.start_session)
        } else {
            setState("homescreen")
            setStudyAnim(sessionControlStyles.homescreen_state)
            setBreakAnim("")
        }
        SetClockOrder("flex flex-col")
    }
    
    return (
        <div className={homeStyles.main}>
            <div>
                <div className={clockOrder}>
                    <Clock label="Study 📝" time={studyTime} className={studyAnim} />
                    <Clock label="Break 🥳" time={breakTime} className={breakAnim} isBreakTimer
                        value={inputValue}
                        onKeyDown={handleKeyDown}
                        onBlur={handleOnBlur}
                        onChange={handleInputChange}
                        ref={inputRef}
                    />
                </div>
                <div className="relative z-10">
                    {state != "homescreen" && <Button onClick={sessionSwitch} className={`${buttonStyles.control_btn} block`}>
                        {state == "study" ? "Break 🥳" : "Study 📝"}
                    </Button>}
                    <Button onClick={startStop} className={`${buttonStyles.control_btn} ${state=="homescreen" && buttonStyles.start} block`}>
                        {state == "homescreen" ? "Start!" : "End!"}
                    </Button>
                </div>
            </div>
            <MinuteEventChart/>
        </div>
    )
}
