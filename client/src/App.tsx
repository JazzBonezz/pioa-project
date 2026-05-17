import { api } from './api/client'
import { ChartCard } from './components/ChartCard/ChartCard.tsx'
import { CorrelationsChart } from './components/CorrelationsChart'
import { NegativeCorrelationsNote } from './components/NegativeCorrelationsNote/NegativeCorrelationsNote.tsx'
import { FactorChartsPanel } from './components/FactorChartsPanel/FactorChartsPanel.tsx'
import { ConclusionsBlock } from './components/ConclusionsBlock/ConclusionsBlock.tsx'
import { TopFactorsSummary } from './components/TopFactorsSummary/TopFactorsSummary.tsx'
import { useApiData } from './hooks/useApiData'
import styles from './App.module.css'

function App() {
    const correlations = useApiData('correlations', api.correlations)
    const attendance = useApiData('attendance', api.topByAttendance)
    const hoursStudied = useApiData('hours', api.topByHoursStudied)
    const accessToResources = useApiData('access', api.topByAccessToResources)
    const parentalInvolvement = useApiData(
        'parental',
        api.topByParentalInvolvement,
    )
    const tutoringSessions = useApiData('tutoring', api.topByTutoringSessions)

    return (
        <div className={styles.dashboard}>
            <header className={styles.hero}>
                <h1>Факторы успеваемости студентов</h1>
            </header>

            <section className={styles.section}>
                <ChartCard
                    featured
                    title="Корреляция с баллом экзамена"
                    subtitle="Яркие столбцы — топ‑5 для выбранных для графиков ниже"
                    state={correlations}
                    footer={(data) => (
                        <NegativeCorrelationsNote
                            items={data.filter((d) => d.r < 0)}
                        />
                    )}
                >
                    {(data) => <CorrelationsChart data={data} />}
                </ChartCard>

                {correlations.status === 'ready' && (
                    <TopFactorsSummary correlations={correlations.data} />
                )}
            </section>

            <section className={styles.section}>
                <FactorChartsPanel
                    attendance={attendance}
                    hoursStudied={hoursStudied}
                    accessToResources={accessToResources}
                    parentalInvolvement={parentalInvolvement}
                    tutoringSessions={tutoringSessions}
                />
            </section>

            <ConclusionsBlock
                correlations={correlations}
                attendance={attendance}
                hoursStudied={hoursStudied}
                accessToResources={accessToResources}
                parentalInvolvement={parentalInvolvement}
                tutoringSessions={tutoringSessions}
            />
        </div>
    )
}

export default App
