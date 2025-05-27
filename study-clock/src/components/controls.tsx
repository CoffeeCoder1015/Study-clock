import { Dispatch, SetStateAction } from "react"
import { Button } from "./ui/button"

interface controlProps{
    state:String
    setState: Dispatch<SetStateAction<"homescreen" | "study" | "break">>
}

export function SwitchButton({ state,setState }:controlProps) {
    var displayString = state == "study" ?  "Break 🥳": "Study 📝" 
    
    const switchState = () => {
        if(state == "study"){
            setState("break")
        }else{
            setState("study")
        }
    }

    return(
        <Button onClick={switchState}>
            {displayString}
        </Button>
    )
}

export function StartStopButton({ state,setState }:controlProps) {
    var displayString = state == "homescreen" ?  "Start!" : "End!"
    
    const switchState = () => {
        if(state == "homescreen"){
            setState("study")
        }else{
            setState("homescreen")
        }
    }

    return (
        <Button onClick={switchState}>
            {displayString}
        </Button>
    ) 
}