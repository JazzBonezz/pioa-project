import type { CorrelationPoint } from '../../api/types.ts'
import { TOP_FACTORS } from '../../config/topFactors.ts'
import styles from './TopFactorsSummary.module.css'

type TopFactorsSummaryProps = {
    correlations: CorrelationPoint[]
}

export function TopFactorsSummary({ correlations }: TopFactorsSummaryProps) {
    const byFactor = new Map(correlations.map((c) => [c.factor, c.r]))

    return (
        <div className={styles.root}>
            {TOP_FACTORS.map((factor, index) => {
                const r = byFactor.get(factor.factorKey)
                return (
                    <div key={factor.id} className={styles.card}>
                        <span className={styles.rank}>#{index + 1}</span>
                        <div className={styles.body}>
                            <strong>{factor.title}</strong>
                            <span className={styles.r}>
                                {r != null
                                    ? `r = ${r > 0 ? '+' : ''}${r.toFixed(3)}`
                                    : '—'}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
