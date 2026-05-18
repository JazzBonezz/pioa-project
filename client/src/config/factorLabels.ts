export const FACTOR_LABELS_RU: Record<string, string> = {
    hours_studied: 'Часы учёбы',
    attendance: 'Посещаемость',
    parental_involvement: 'Участие родителей',
    access_to_resources: 'Доступ к ресурсам',
    extracurricular_activities: 'Внеклассные занятия',
    sleep_hours: 'Часы сна',
    previous_scores: 'Прошлые оценки',
    motivation_level: 'Мотивация',
    internet_access: 'Доступ в интернет',
    tutoring_sessions: 'Репетиторство',
    family_income: 'Доход семьи',
    teacher_quality: 'Качество учителя',
    school_type: 'Тип школы',
    peer_influence: 'Влияние сверстников',
    physical_activity: 'Физическая активность',
    learning_disabilities: 'Трудности в обучении',
    parental_education_level: 'Образование родителей',
    distance_from_home: 'Расстояние до школы',
    gender: 'Пол',
}

export function factorLabelRu(factorKey: string): string {
    return FACTOR_LABELS_RU[factorKey] ?? factorKey.replace(/_/g, ' ')
}

export function yAxisWidthForLabels(
    labels: string[],
    compact = false,
): number {
    const maxLen = Math.max(...labels.map((l) => l.length), 10)
    if (compact) {
        return Math.min(132, Math.max(76, Math.ceil(maxLen * 5.2)))
    }
    return Math.min(280, Math.max(200, Math.ceil(maxLen * 7.8)))
}
