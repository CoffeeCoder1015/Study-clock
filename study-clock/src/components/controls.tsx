import { Dispatch, SetStateAction } from "react"
import { Button } from "./ui/button"

interface controlProps{
    state:String
    setState: Dispatch<SetStateAction<"homescreen" | "study" | "break">>
}

export function SwitchButton() {
    return(
        <h1>
            Hello switch
        </h1>
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