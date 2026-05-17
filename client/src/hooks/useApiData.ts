import { useEffect, useState } from 'react'
import type { AsyncState } from '../components/chartState'

export function useApiData<T>(key: string, loader: () => Promise<T>) {
    const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })

    const [prevKey, setPrevKey] = useState(key)

    if (prevKey !== key) {
        setPrevKey(key)
        setState({ status: 'loading' })
    }

    useEffect(() => {
        let cancelled = false

        loader()
            .then((data) => {
                if (!cancelled) setState({ status: 'ready', data })
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : 'Неизвестная ошибка'
                    setState({ status: 'error', message })
                }
            })

        return () => {
            cancelled = true
        }
    }, [key, loader])

    return state
}
