import type { LevelDef } from '../components/FactorLevelsChart/FactorLevelsChart.tsx'

export const TOP_FACTOR_KEYS = [
    'attendance',
    'hours_studied',
    'access_to_resources',
    'parental_involvement',
    'tutoring_sessions',
] as const

export type TopFactorKey = (typeof TOP_FACTOR_KEYS)[number]

const ACCESS_LEVELS: LevelDef[] = [
    {
        key: 0,
        step: 'Уровень 0',
        label: 'Низкий',
        hint: 'минимальный доступ к материалам',
    },
    {
        key: 1,
        step: 'Уровень 1',
        label: 'Средний',
        hint: 'базовый набор ресурсов',
    },
    {
        key: 2,
        step: 'Уровень 2',
        label: 'Высокий',
        hint: 'широкий доступ к ресурсам',
    },
]

const PARENTAL_LEVELS: LevelDef[] = [
    {
        key: 0,
        step: 'Уровень 0',
        label: 'Низкое',
        hint: 'родители редко вовлечены в учёбу',
    },
    {
        key: 1,
        step: 'Уровень 1',
        label: 'Среднее',
        hint: 'умеренное участие в процессе',
    },
    {
        key: 2,
        step: 'Уровень 2',
        label: 'Высокое',
        hint: 'активная поддержка со стороны семьи',
    },
]

export type TopFactorConfig = {
    id: string
    factorKey: TopFactorKey
    title: string
    description: string
    categoryKey: string
    categoryLabel: string
    chartType: 'line' | 'bar' | 'levels'
    levels?: LevelDef[]
    levelsFootnote?: string
}

export const TOP_FACTORS: TopFactorConfig[] = [
    {
        id: 'attendance',
        factorKey: 'attendance',
        title: 'Посещаемость',
        description: 'Средний балл экзамена при разной посещаемости (%)',
        categoryKey: 'attendance',
        categoryLabel: 'Посещаемость, %',
        chartType: 'line',
    },
    {
        id: 'hours',
        factorKey: 'hours_studied',
        title: 'Часы учёбы',
        description:
            'Как меняется балл в зависимости от часов подготовки в неделю',
        categoryKey: 'hours_studied',
        categoryLabel: 'Часов в неделю',
        chartType: 'line',
    },
    {
        id: 'access',
        factorKey: 'access_to_resources',
        title: 'Доступ к ресурсам',
        description:
            'Средний балл при трёх уровнях доступа к учебным материалам',
        categoryKey: 'access_to_resources',
        categoryLabel: 'Уровень доступа',
        chartType: 'levels',
        levels: ACCESS_LEVELS,
        levelsFootnote:
            'Чем выше доступ к ресурсам, тем выше средний балл на экзамене.',
    },
    {
        id: 'parental',
        factorKey: 'parental_involvement',
        title: 'Участие родителей',
        description: 'Средний балл при разном уровне вовлечённости родителей',
        categoryKey: 'parental_involvement',
        categoryLabel: 'Уровень участия',
        chartType: 'levels',
        levels: PARENTAL_LEVELS,
        levelsFootnote:
            'Более активное участие родителей связано с более высоким баллом на экзамене.',
    },
    {
        id: 'tutoring',
        factorKey: 'tutoring_sessions',
        title: 'Репетиторство',
        description:
            'Средний балл в зависимости от числа занятий с репетитором в неделю (0–8)',
        categoryKey: 'tutoring_sessions',
        categoryLabel: 'Занятий в неделю',
        chartType: 'line',
    },
]
