import { useState } from 'react'
import type {
    AccessToResourcesPoint,
    AttendancePoint,
    HoursStudiedPoint,
    ParentalInvolvementPoint,
    TutoringSessionsPoint,
} from '../../api/types.ts'
import { TOP_FACTORS, type TopFactorConfig } from '../../config/topFactors.ts'
import type { AsyncState } from '../chartState.ts'
import cardStyles from '../ChartCard/ChartCard.module.css'
import styles from './FactorChartsPanel.module.css'
import { ExamScoreChart } from '../ExamScoreChart.tsx'
import { FactorLevelsChart } from '../FactorLevelsChart/FactorLevelsChart.tsx'

type FactorDataMap = {
    attendance: AttendancePoint[]
    hours: HoursStudiedPoint[]
    access: AccessToResourcesPoint[]
    parental: ParentalInvolvementPoint[]
    tutoring: TutoringSessionsPoint[]
}

export type FactorChartsPanelProps = {
    attendance: AsyncState<AttendancePoint[]>
    hoursStudied: AsyncState<HoursStudiedPoint[]>
    accessToResources: AsyncState<AccessToResourcesPoint[]>
    parentalInvolvement: AsyncState<ParentalInvolvementPoint[]>
    tutoringSessions: AsyncState<TutoringSessionsPoint[]>
}

function panelStatus(
    ...states: AsyncState<unknown>[]
): AsyncState<FactorDataMap> {
    const loading = states.find((s) => s.status === 'loading')
    if (loading) return { status: 'loading' }

    const error = states.find((s) => s.status === 'error')
    if (error && error.status === 'error') return error

    const [a, h, acc, par, tut] = states as [
        AsyncState<AttendancePoint[]>,
        AsyncState<HoursStudiedPoint[]>,
        AsyncState<AccessToResourcesPoint[]>,
        AsyncState<ParentalInvolvementPoint[]>,
        AsyncState<TutoringSessionsPoint[]>,
    ]

    if (
        a.status !== 'ready' ||
        h.status !== 'ready' ||
        acc.status !== 'ready' ||
        par.status !== 'ready' ||
        tut.status !== 'ready'
    ) {
        return { status: 'loading' }
    }

    return {
        status: 'ready',
        data: {
            attendance: a.data,
            hours: h.data,
            access: acc.data,
            parental: par.data,
            tutoring: tut.data,
        },
    }
}

function dataForFactor(
    factor: TopFactorConfig,
    all: FactorDataMap,
): Record<string, string | number>[] {
    switch (factor.id) {
        case 'attendance':
            return all.attendance
        case 'hours':
            return all.hours
        case 'access':
            return all.access
        case 'parental':
            return all.parental
        case 'tutoring':
            return all.tutoring
        default:
            return []
    }
}

export function FactorChartsPanel({
    attendance,
    hoursStudied,
    accessToResources,
    parentalInvolvement,
    tutoringSessions,
}: FactorChartsPanelProps) {
    const [activeId, setActiveId] = useState(TOP_FACTORS[0].id)
    const state = panelStatus(
        attendance,
        hoursStudied,
        accessToResources,
        parentalInvolvement,
        tutoringSessions,
    )
    const active = TOP_FACTORS.find((f) => f.id === activeId) ?? TOP_FACTORS[0]

    return (
        <article className={`${cardStyles.card} ${cardStyles.panel}`}>
            <header className={cardStyles.header}>
                <h2>5 основных факторов, влияющих на успеваемость</h2>
            </header>

            <div className={styles.tabs} role="tablist" aria-label="Факторы">
                {TOP_FACTORS.map((factor) => (
                    <button
                        key={factor.id}
                        type="button"
                        role="tab"
                        aria-selected={activeId === factor.id}
                        className={
                            activeId === factor.id
                                ? styles.tabActive
                                : styles.tab
                        }
                        onClick={() => setActiveId(factor.id)}
                    >
                        <span className={styles.tabLabel}>{factor.title}</span>
                        <span className={styles.tabHint}>
                            {factor.chartType === 'line' ? 'тренд' : 'уровни'}
                        </span>
                    </button>
                ))}
            </div>

            <div className={cardStyles.bodyTall}>
                {state.status === 'loading' && (
                    <p className={cardStyles.status}>Загрузка…</p>
                )}
                {state.status === 'error' && (
                    <p className={cardStyles.statusError}>{state.message}</p>
                )}
                {state.status === 'ready' && (
                    <>
                        <p className={styles.description}>
                            {active.description}
                        </p>
                        {active.chartType === 'levels' && active.levels ? (
                            <FactorLevelsChart
                                data={dataForFactor(active, state.data)}
                                levels={active.levels}
                                dataKey={active.categoryKey}
                                footnote={active.levelsFootnote ?? ''}
                            />
                        ) : (
                            <ExamScoreChart
                                data={dataForFactor(active, state.data)}
                                categoryKey={active.categoryKey}
                                categoryLabel={active.categoryLabel}
                                variant="line"
                            />
                        )}
                    </>
                )}
            </div>
        </article>
    )
}
