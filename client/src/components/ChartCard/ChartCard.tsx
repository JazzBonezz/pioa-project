import type { ReactNode } from 'react'
import type { AsyncState } from '../chartState.ts'
import styles from './ChartCard.module.css'

type ChartCardProps<T> = {
    title: string
    subtitle?: string
    featured?: boolean
    state: AsyncState<T>
    children: (data: T) => ReactNode
    footer?: (data: T) => ReactNode
}

export function ChartCard<T>({
    title,
    subtitle,
    featured,
    state,
    children,
    footer,
}: ChartCardProps<T>) {
    return (
        <article
            className={`${styles.card}${featured ? ` ${styles.featured}` : ''}`}
        >
            <header className={styles.header}>
                <h2>{title}</h2>
                {subtitle && <p>{subtitle}</p>}
            </header>
            <div className={styles.body}>
                {state.status === 'loading' && (
                    <p className={styles.status}>Загрузка…</p>
                )}
                {state.status === 'error' && (
                    <p className={styles.statusError}>{state.message}</p>
                )}
                {state.status === 'ready' && children(state.data)}
            </div>
            {state.status === 'ready' && footer?.(state.data)}
        </article>
    )
}
