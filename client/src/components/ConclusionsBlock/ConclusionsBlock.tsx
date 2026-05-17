import type {
    AccessToResourcesPoint,
    AttendancePoint,
    CorrelationPoint,
    HoursStudiedPoint,
    ParentalInvolvementPoint,
    TutoringSessionsPoint,
} from '../../api/types.ts'
import { buildConclusions } from '../../utils/buildConclusions.ts'
import type { AsyncState } from '../chartState.ts'
import styles from './ConclusionsBlock.module.css'

type ConclusionsBlockProps = {
    correlations: AsyncState<CorrelationPoint[]>
    attendance: AsyncState<AttendancePoint[]>
    hoursStudied: AsyncState<HoursStudiedPoint[]>
    accessToResources: AsyncState<AccessToResourcesPoint[]>
    parentalInvolvement: AsyncState<ParentalInvolvementPoint[]>
    tutoringSessions: AsyncState<TutoringSessionsPoint[]>
}

function isReady<T>(s: AsyncState<T>): s is { status: 'ready'; data: T } {
    return s.status === 'ready'
}

function renderText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return part
    })
}

export function ConclusionsBlock({
    correlations,
    attendance,
    hoursStudied,
    accessToResources,
    parentalInvolvement,
    tutoringSessions,
}: ConclusionsBlockProps) {
    const states = [
        correlations,
        attendance,
        hoursStudied,
        accessToResources,
        parentalInvolvement,
        tutoringSessions,
    ]
    const loading = states.some((s) => s.status === 'loading')
    const error = states.find((s) => s.status === 'error')

    if (loading) {
        return (
            <section className={styles.root}>
                <h2 className={styles.title}>Выводы</h2>
                <p className={styles.status}>Формируем выводы по данным…</p>
            </section>
        )
    }

    if (error && error.status === 'error') {
        return (
            <section className={styles.root}>
                <h2 className={styles.title}>Выводы</h2>
                <p className={styles.statusError}>{error.message}</p>
            </section>
        )
    }

    if (
        !isReady(correlations) ||
        !isReady(attendance) ||
        !isReady(hoursStudied) ||
        !isReady(accessToResources) ||
        !isReady(parentalInvolvement) ||
        !isReady(tutoringSessions)
    ) {
        return null
    }

    const sections = buildConclusions(
        correlations.data,
        attendance.data,
        hoursStudied.data,
        accessToResources.data,
        parentalInvolvement.data,
        tutoringSessions.data,
    )

    return (
        <section className={styles.root} aria-labelledby="conclusions-heading">
            <h2 id="conclusions-heading" className={styles.title}>
                Выводы
            </h2>
            <div className={styles.grid}>
                {sections.map((section) => (
                    <article key={section.title} className={styles.card}>
                        <h3>{section.title}</h3>
                        <ul>
                            {section.items.map((item) => (
                                <li key={item}>{renderText(item)}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    )
}
