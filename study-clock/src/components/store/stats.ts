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
    
    return key
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


export interface dayStats{
    sessions: session[],
    max_study: number,
    max_break: number,
    previous_study: number,
    previous_break: number,
    current_study: number,
    current_break: number,
}

type statsStore = {
    timestamp: key,
    today: dayStats,
    archive: {[ key:string ]:dayStats},
    create_session: (type:string) => void
    update_session: () => void
    archive_today: () => void
}

function empty_today(){
    return {
        sessions: [],
        max_study: 0,
        max_break: 0,
        previous_study: 0,
        previous_break: 0,
        current_study: 0,
        current_break: 0,
    }
}

export const useStatsStore = create<statsStore>()(
    persist(
        (set,get) => ({
            timestamp:get_key(),
            today: empty_today(),
            archive:{},
            create_session: (type:string) => {
                if (get().timestamp != get_key()) {
                    get().archive_today()
                }

                const s = create_session(type)
                const old = get().today
                if (type == "study") {
                    set({
                        today: {
                            ...old,
                            sessions: [...old.sessions, s],
                            previous_break: old.current_break,
                            current_break: 0
                        }
                    })
                }else{
                    set({
                        today: {
                            ...old,
                            sessions: [...old.sessions, s],
                            previous_study: old.current_study,
                            current_study: 0
                        }
                    })
                }
            },
            update_session: () => {
                const old = get().today
                const old_sess = old.sessions
                const lidx = old_sess.length-1
                const last = old_sess[ lidx ]
                const sx = updateSession(last)
                if (get().timestamp != get_key()) {
                    get().archive_today()
                    get().create_session(last.type)
                }
                if (last.type == "study") {
                    var max = get().today.max_study
                    const new_study  = get().today.current_study+1
                    if (new_study>max) {
                       max = new_study 
                    }
                    set({
                        today: {
                            ...old,
                            sessions: [...old_sess.slice(0, lidx), ...sx],
                            current_study: new_study,
                            max_study: max
                        }
                    })
                }else{
                    var max = get().today.max_break
                    const new_break  = get().today.current_break+1
                    if (new_break>max) {
                       max = new_break 
                    }
                    set({
                        today: {
                            ...old,
                            sessions: [...old_sess.slice(0, lidx), ...sx],
                            current_break: new_break,
                            max_break: max
                        }
                    })
                }
            },
            archive_today: () => {
                const old = get()
                const key = JSON.stringify(old.timestamp)
                var new_archive = get().archive
                new_archive[key] = old.today
                set({
                    timestamp:get_key(),
                    today:empty_today(),
                    archive:new_archive
                })
            }

        }),
        {
            name:"session_statistics"
        }
    )
)