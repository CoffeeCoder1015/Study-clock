// Session structure:
// Start time,
// End time,
// type
// 
// End time is constantly updated while session is underway
// Entire session is constantly being pushed into localStorage
// 
// Session key would be the relevant date
// 

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface timestamp{
    hour: number
    minute: number
    second: number
}

export interface session{
    type: string
    hour: number
    startMinute: number
    endMinute: number
}

interface key{
    year: number
    month: number
    date: number
}

function get_key() {
    var date = new Date()
    const key:key = {
        year:date.getFullYear(),
        month:date.getMonth()+1,
        date:date.getDate()
    }
    
    const store_key = JSON.stringify(key)
    return store_key
}

function getTimeStamp(): timestamp {
    var date = new Date()
    return {hour:date.getHours(),minute:date.getMinutes(),second:date.getSeconds()}
}

function updateSession(old: session): session[] {
    const current_time = getTimeStamp()
    const newMinute = current_time.minute + current_time.second/60
    var updated_stats: session = {...old,endMinute:newMinute}
    if (old.hour == current_time.hour) {
        return [updated_stats]
    }
    updated_stats.endMinute = 59+59/60
    var second_updated_stats: session = {
        type:old.type,
        hour:current_time.hour,
        startMinute:0,
        endMinute:newMinute
    }
    return [updated_stats,second_updated_stats]
}

// if session already exists it should load the session
function create_session(type:string) {
    const current_time = getTimeStamp()
    const current_min = current_time.minute + current_time.second/60
    var today_stats:session = {
        type:type,
        hour:current_time.hour,
        startMinute: current_min,
        endMinute: current_min
    }
    return today_stats
}


type statsStore = {
    sessions: session[],
    create_session: (type:string) => void
    update_session: () => void
}

export const useStatsStore = create<statsStore>()(
    persist(
        (set,get) => ({
            sessions:[],
            create_session: (type:string) => {
                const s = create_session(type)
                set({sessions:[...get().sessions,s]})
            },
            update_session: () => {
                const old = get().sessions
                const lidx = old.length-1
                const last = old[ lidx ]
                const sx = updateSession(last)
                set({sessions:[...old.slice(0,lidx),...sx]})
            }
        }),
        {
            name:get_key()
        }
    )
)