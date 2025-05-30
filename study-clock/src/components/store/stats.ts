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
    max_study: number,
    max_break: number,
    previous_study: number,
    previous_break: number,
    current_study: number,
    current_break: number,
    create_session: (type:string) => void
    update_session: () => void
}

export const useStatsStore = create<statsStore>()(
    persist(
        (set,get) => ({
            sessions:[],
            max_study: 0,
            max_break: 0,
            previous_study: 0,
            previous_break: 0,
            current_study: 0,
            current_break: 0,
            create_session: (type:string) => {
                const s = create_session(type)
                if (type == "study") {
                    set({sessions:[...get().sessions,s],
                        previous_break:get().current_break,
                        current_break:0
                    })
                }else{
                    set({sessions:[...get().sessions,s],
                        previous_study:get().current_study,
                        current_study:0
                    })
                }
            },
            update_session: () => {
                const old = get().sessions
                const lidx = old.length-1
                const last = old[ lidx ]
                const sx = updateSession(last)
                if (last.type == "study") {
                    var max = get().max_study
                    const new_study  = get().current_study+1
                    if (new_study>max) {
                       max = new_study 
                    }
                    set({sessions:[...old.slice(0,lidx),...sx],
                        current_study:new_study,
                        max_study:max
                    })
                }else{
                    var max = get().max_break
                    const new_break  = get().current_break+1
                    if (new_break>max) {
                       max = new_break 
                    }
                    set({sessions:[...old.slice(0,lidx),...sx],
                        current_break:new_break,
                        max_break:max
                    })
                }
            }
        }),
        {
            name:get_key()
        }
    )
)