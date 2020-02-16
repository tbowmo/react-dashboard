import { Home } from '@dashboard/types'

const store: Home = {}

export function updateStore(topic: string, value: string): boolean {
    if (topic.endsWith('/dt') || topic.endsWith('/set')) {
        return false
    }
    let changed = false
    const [, room, type, sensor] = topic.match(/home\/(\w+)\/(\w+)\/(\w+)/) || []
    if (!store[room]) {
        store[room] = {}
    }
    if (!store[room][type]) {
        store[room][type] = {}
    }

    let v = value;
    try  {
        v = JSON.parse(value)
    } catch {}
    changed = !(store[room][type][sensor] === v)
    store[room][type][sensor] = v

    // switch (type) {
    //     case 'presence':
    //         const [, person, device] = topic.match(/presence\/(\w+)\/(\w+)/) || []
    //         if (!store.presence[person]) {
    //             store.presence[person] = {}
    //         }

    //         if (store.presence[person][device] !== JSON.parse(value)) {
    //             changed = 'other'
    //         }
    //         store.presence[person][device] = JSON.parse(value)
    //         break;
    //     case 'global': {
    //             const [, unit, sensor] = topic.match(/global\/(\w+)\/(\w+)/) || []
    //             if (store.global[unit][sensor] !== JSON.parse(value)) {
    //                 changed = 'other'
    //             }
    //             store.global[unit][sensor] = JSON.parse(value)
    //         }
    //         break;
    //     case 'garden':
    //         break;
    //     case 'garage':
    //         break;
    //     default: {
            
    //         if (!store.rooms[room]) {
    //             store.rooms[room] = {
    //                 light: {},
    //                 sensors: {},
    //                 avctrl: {
    //                     scene: ''
    //                 },
    //                 media: {
    //                     app: '',
    //                     capabilities: {
    //                         app: '',
    //                         app_icon: '',
    //                         muted: false,
    //                         state: '',
    //                         volume: 0,
    //                         supported_features: {
    //                             mute: false,
    //                             pause: false,
    //                             skip_bck: false,
    //                             skip_fwd: false,
    //                             volume: false,
    //                         }
    //                     },
    //                     device: '',
    //                     media: {
    //                         album: '',
    //                         album_art: '',
    //                         artist: '',
    //                         content_id: '',
    //                         current_time: 0,
    //                         duration: 0,
    //                         metadata_type: 0,
    //                         start_time: 0,
    //                         title: '',
    //                         type: 0,
    //                     },
    //                     state: '',
    //                 }
                
    //             }
    //         }
    //         let v = value;
    //         try  {
    //             v = JSON.parse(value)
    //         } catch {}
    //         store.rooms[room][type][sensor] = v
    //         changed = 'room'
    //     }
    // }
    console.log(store)
    return changed
}

export function getStore(): Home {
    return store
}
