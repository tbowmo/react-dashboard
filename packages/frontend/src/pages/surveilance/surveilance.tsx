import * as React from 'react'
import './surveilance.scss'

export function Surveilance() {
    return (
        <React.Fragment>
            <div className="surveilance">
                <div>
                    <img src="https://zm.juletraesfoden.dk/zm/cgi-bin/nph-zms?scale=100&width=640px&height=480px&mode=jpeg&maxfps=30&monitor=6&auth=265314e47bf5414bd3030e21b7fb1ec9&connkey=559372&rand=1634554934" alt="" />
                </div>
                <div>   
                    <img src="https://zm.juletraesfoden.dk/zm/cgi-bin/nph-zms?scale=100&width=640px&height=480px&mode=jpeg&maxfps=30&monitor=4&auth=265314e47bf5414bd3030e21b7fb1ec9&connkey=860544&rand=1634554889" alt="" />
                </div>
            </div>
        </React.Fragment>
    )
}
