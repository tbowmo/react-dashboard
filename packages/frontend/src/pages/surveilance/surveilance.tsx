import * as React from 'react'
import './surveilance.scss'

export function Surveilance() {
    return (
        <React.Fragment>
            <div className="surveilance">
                <div>
                    <img src="https://zm.juletraesfoden.dk/zm/cgi-bin/nph-zms?scale=100&width=640px&height=480px&mode=jpeg&maxfps=30&monitor=4&auth=a7432e25f55198a3136e35a8cd811ce5&connkey=39971&rand=1617648227" alt="" />
                </div>
                <div>
                    <img src="https://zm.juletraesfoden.dk/zm/cgi-bin/nph-zms?scale=100&width=1280px&height=720px&mode=jpeg&maxfps=30&monitor=1&auth=a7432e25f55198a3136e35a8cd811ce5&connkey=27115&rand=1617648293" alt="" />
                </div>
            </div>
        </React.Fragment>
    )
}
