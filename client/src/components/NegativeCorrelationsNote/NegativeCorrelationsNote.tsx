import type { CorrelationPoint } from '../../api/types.ts'
import { factorLabelRu } from '../../config/factorLabels.ts'
import styles from './NegativeCorrelationsNote.module.css'

type NegativeCorrelationsNoteProps = {
    items: CorrelationPoint[]
}

export function NegativeCorrelationsNote({
    items,
}: NegativeCorrelationsNoteProps) {
    if (items.length === 0) return null

    const sorted = [...items].sort((a, b) => a.r - b.r)

    return (
        <aside
            className={styles.root}
            aria-label="Признаки без положительной корреляции"
        >
            <p className={styles.title}>
                С баллом экзамена <strong>не коррелируют</strong> (отрицательная
                связь):
            </p>
            <ul className={styles.list}>
                {sorted.map((item) => (
                    <li key={item.factor}>
                        <span>{factorLabelRu(item.factor)}</span>
                        <span className={styles.r}>
                            r = {item.r.toFixed(3)}
                        </span>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
