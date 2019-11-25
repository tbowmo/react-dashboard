import * as React from 'react'
import './surveilance.scss'

export function Surveilance() {
    return (
        <React.Fragment>
            <div className="surveilance">
                <div>
                    <img src="http://192.168.3.111/cgi-bin/hi3510/snap.cgi?&-getstream&-chn=2" alt="" />
                </div>
                <div>
                    <img src="http://192.168.3.112/cgi-bin/hi3510/snap.cgi?&-getstream&-chn=2" alt="" />
                </div>
            </div>
        </React.Fragment>
    )
}
