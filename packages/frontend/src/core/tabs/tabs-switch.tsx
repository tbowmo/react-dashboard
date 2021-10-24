import * as React from 'react'
import { Streams } from '../../pages/streams/streams'
import { Controller } from '../../pages/media/media'
import { Scene } from '../../pages/scene/scene'
import { Surveilance } from '../../pages/surveilance/surveilance'
import { House } from '../../pages/house/house'
import { Weather } from '../../pages/weather/weather'
import { Wifi } from '../../pages/wifi/wifi'
import { Switch, Route } from 'react-router'

function StreamRender(props : { match: { params: {type: any}} }) {
    const { type } = props.match.params
    return (
        <Streams type={type} />
    )
}

export function TabsSwitch() {
    return (
        <Switch>
            <Route 
                path="/scene"
                exact={true}
                component={Scene}
            />
            <Route
                path="/streams/:type"
                exact={false}
                component={StreamRender}
            />
            <Route
                path="/surveilance"
                exact={true}
                component={Surveilance}
            />
            <Route
                path="/house"
                exact={true}
                component={House}
            />
            <Route
                path="/weather"
                exact={false}
                component={Weather}
            />
            <Route
                path="/wifi"
                exact={false}
                component={Wifi}
            />
            <Route
                path="/"
                exact={false}
                component={Controller}
            />
        </Switch>
    )
}