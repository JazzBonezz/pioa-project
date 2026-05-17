import styles from './FactorLevelsChart.module.css'

export type LevelDef = {
    key: number | string
    label: string
    hint: string
    step?: string
}

type FactorLevelsChartProps = {
    data: Record<string, string | number>[]
    levels: LevelDef[]
    dataKey: string
    footnote: string
}

type LevelRow = LevelDef & { score: number }

export function FactorLevelsChart({
    data,
    levels,
    dataKey,
    footnote,
}: FactorLevelsChartProps) {
    const byKey = new Map(data.map((d) => [d[dataKey], d.avg_score as number]))

    const rows: LevelRow[] = [...levels]
        .map((level) => ({
            ...level,
            score: byKey.get(level.key) ?? 0,
        }))
        .reverse()

    const min = rows[rows.length - 1]?.score ?? 0
    const max = rows[0]?.score ?? 100
    const spread = max - min || 1

    return (
        <div className={styles.root}>
            <ol className={styles.list}>
                {rows.map((level, index) => {
                    const below =
                        index < rows.length - 1 ? rows[index + 1].score : null
                    const deltaPct =
                        below != null && below > 0 && level.score > below
                            ? ((level.score - below) / below) * 100
                            : null
                    const barWidth = 55 + ((level.score - min) / spread) * 45
                    const stepText = level.step ?? String(level.key)

                    return (
                        <li key={String(level.key)} className={styles.item}>
                            <div className={styles.meta}>
                                <span className={styles.step}>{stepText}</span>
                                <strong className={styles.label}>
                                    {level.label}
                                </strong>
                                <span className={styles.hint}>
                                    {level.hint}
                                </span>
                            </div>
                            <div className={styles.viz}>
                                <div className={styles.barWrap}>
                                    <div
                                        className={styles.bar}
                                        style={{ width: `${barWidth}%` }}
                                    >
                                        <span className={styles.score}>
                                            {level.score}
                                        </span>
                                    </div>
                                </div>
                                {deltaPct != null && (
                                    <span className={styles.delta}>
                                        +{deltaPct.toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
            <p className={styles.footnote}>{footnote}</p>
        </div>
    )
}
