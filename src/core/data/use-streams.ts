import { StreamDto } from './streams/stream-type'
import {
    useSelector,
    useDispatch,
} from 'react-redux'
import { combinedState } from './store'
import { useEffect } from 'react'
import { fetchStreamSuccess } from './streams/actions'

export function useStreams(type: 'radio' | 'tv'): StreamDto[] | undefined {
    const streamState = useSelector((state: combinedState) => state.streams)
    const dispatch = useDispatch()
    useEffect(() => {
        const url = process.env.REACT_APP_BACKEND + `/${type}/list`
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => dispatch(fetchStreamSuccess(type, data)))
    }, [dispatch, type])
    return streamState.streams[type]
}
