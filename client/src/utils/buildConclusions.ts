import type {
    AccessToResourcesPoint,
    AttendancePoint,
    CorrelationPoint,
    HoursStudiedPoint,
    ParentalInvolvementPoint,
    TutoringSessionsPoint,
} from '../api/types'
import { factorLabelRu } from '../config/factorLabels'
import { TOP_FACTOR_KEYS } from '../config/topFactors'

function numericRange(points: { key: number; score: number }[]) {
    if (points.length === 0) return null
    const sorted = [...points].sort((a, b) => a.key - b.key)
    const low = sorted[0]
    const high = sorted[sorted.length - 1]
    return {
        low,
        high,
        delta: Math.round((high.score - low.score) * 10) / 10,
    }
}

function levelRange(
    points: { key: number; score: number }[],
    labels: string[],
) {
    const range = numericRange(points)
    if (!range) return null
    return {
        ...range,
        lowLabel: labels[range.low.key] ?? String(range.low.key),
        highLabel: labels[range.high.key] ?? String(range.high.key),
    }
}

export type ConclusionSection = {
    title: string
    items: string[]
}

export function buildConclusions(
    correlations: CorrelationPoint[],
    attendance: AttendancePoint[],
    hoursStudied: HoursStudiedPoint[],
    accessToResources: AccessToResourcesPoint[],
    parentalInvolvement: ParentalInvolvementPoint[],
    tutoringSessions: TutoringSessionsPoint[],
): ConclusionSection[] {
    const positive = correlations
        .filter((c) => c.r > 0)
        .sort((a, b) => b.r - a.r)
    const negative = correlations.filter((c) => c.r < 0)

    const strongest = positive[0]
    const topFive = TOP_FACTOR_KEYS.map((key) =>
        correlations.find((c) => c.factor === key),
    ).filter((c): c is CorrelationPoint => c != null)

    const attRange = numericRange(
        attendance.map((p) => ({ key: p.attendance, score: p.avg_score })),
    )
    const hoursRange = numericRange(
        hoursStudied.map((p) => ({ key: p.hours_studied, score: p.avg_score })),
    )
    const accessRange = levelRange(
        accessToResources.map((p) => ({
            key: p.access_to_resources,
            score: p.avg_score,
        })),
        ['низким', 'средним', 'высоким'],
    )
    const parentalRange = levelRange(
        parentalInvolvement.map((p) => ({
            key: p.parental_involvement,
            score: p.avg_score,
        })),
        ['низким', 'средним', 'высоким'],
    )
    const tutoringRange = numericRange(
        tutoringSessions.map((p) => ({
            key: p.tutoring_sessions,
            score: p.avg_score,
        })),
    )

    const main: string[] = []

    if (strongest) {
        main.push(
            `Сильнее всего с баллом экзамена связана **${factorLabelRu(strongest.factor).toLowerCase()}** (r = ${strongest.r.toFixed(3)}).`,
        )
    }

    if (topFive.length === 5) {
        main.push(
            `Пять ключевых факторов для детального разбора: ${topFive
                .map(
                    (c) =>
                        `${factorLabelRu(c.factor).toLowerCase()} (r = ${c.r.toFixed(3)})`,
                )
                .join(', ')}.`,
        )
    }

    if (attRange) {
        main.push(
            `При посещаемости ${attRange.low.key}% средний балл ~${attRange.low.score}, при ${attRange.high.key}% — ~${attRange.high.score} (+${attRange.delta} балла).`,
        )
    }

    if (hoursRange) {
        main.push(
            `По часам учёбы: от ~${hoursRange.low.score} балла (${hoursRange.low.key} ч/нед) до ~${hoursRange.high.score} (${hoursRange.high.key} ч/нед), прирост +${hoursRange.delta} балла.`,
        )
    }

    if (accessRange) {
        main.push(
            `Доступ к ресурсам: при ${accessRange.lowLabel} уровне ~${accessRange.low.score} балла, при ${accessRange.highLabel} — ~${accessRange.high.score} (+${accessRange.delta}).`,
        )
    }

    if (parentalRange) {
        main.push(
            `Участие родителей: при ${parentalRange.lowLabel} уровне ~${parentalRange.low.score} балла, при ${parentalRange.highLabel} — ~${parentalRange.high.score} (+${parentalRange.delta}).`,
        )
    }

    if (tutoringRange) {
        main.push(
            `Репетиторство: без занятий ~${tutoringRange.low.score} балла, при ${tutoringRange.high.key} занятиях/нед — ~${tutoringRange.high.score} (+${tutoringRange.delta}).`,
        )
    }

    const caveats: string[] = []

    caveats.push(
        '**Прошлые оценки** на детальных графиках не показаны: высокая корреляция с текущим баллом ожидаема и мало добавляет к выводам.',
    )

    if (negative.length > 0) {
        const names = negative
            .map((c) => factorLabelRu(c.factor).toLowerCase())
            .join(', ')
        caveats.push(
            `Признаки с отрицательной корреляцией (${names}) не связаны с высокими результатами на экзамене.`,
        )
    }

    caveats.push(
        'Пол и тип школы на график корреляций не включены: для категориальных 0/1 коэффициент Пирсона не даёт осмысленной интерпретации.',
    )

    return [
        { title: 'Главные выводы', items: main },
        { title: 'На что обратить внимание', items: caveats },
    ]
}
