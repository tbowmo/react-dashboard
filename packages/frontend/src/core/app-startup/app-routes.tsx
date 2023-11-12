import { RouterProvider, RouteObject } from 'react-router'
import {
    House,
    ShowChart,
    Radio,
    WbSunny,
    Videocam,
    Wifi,
    SvgIconComponent,
} from '@mui/icons-material'
import { RemoteTv } from 'mdi-material-ui'
import { createBrowserRouter } from 'react-router-dom'
import { AppRoot } from './app-root'
import { Controller } from '../../pages/media/media'
import { Streams } from '../../pages/streams/streams'
import { Scene } from '../../pages/scene/scene'
import { Weather } from '../../pages/weather/weather'
import { Surveilance } from '../../pages/surveilance/surveilance'
import { Electricity } from '../../pages/electricity/electricity'
import { WifiPassPhrase } from '../../pages/wifi/wifi-pass-phrase'

type MenuEntry = {
    label: string
    icon: SvgIconComponent
    component: JSX.Element
  }
  
const menuLinks: MenuEntry[] = [
    {
        label: 'Main',
        icon: House,
        component: <Controller />,
    },
    {
        label: 'TV',
        icon: Radio,
        component: <Streams />,
    },
    {
        label: 'Scene',
        icon: RemoteTv,
        component: <Scene />,
    },
    {
        label: 'Weather',
        icon: WbSunny,
        component: <Weather />,
    },
    {
        label: 'Video',
        icon: Videocam,
        component: <Surveilance />,
    },
    {
        label: 'Utility',
        icon: ShowChart,
        component: <Electricity />,
    },
    {
        label: 'Wifi',
        icon: Wifi,
        component: <WifiPassPhrase />,
    },
]
  

export function AppRoutes() {
    const routes = createBrowserRouter([
        {
            path: '/',
            element: <AppRoot menuLinks={menuLinks} />,
            children: menuLinks.map((item): RouteObject => ({
                index: item.label.toLocaleLowerCase() === 'main',
                path: `/${item.label.toLowerCase()}`,
                element: item.component,
            })),
        }])    

    return <RouterProvider router={routes} />
}
