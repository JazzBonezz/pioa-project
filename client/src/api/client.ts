import type {
    AttendancePoint,
    CorrelationPoint,
    HoursStudiedPoint,
    AccessToResourcesPoint,
    ParentalInvolvementPoint,
    TutoringSessionsPoint,
} from './types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

async function getJson<T>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) {
        throw new Error(`API ${path}: ${res.status} ${res.statusText}`)
    }
    return res.json() as Promise<T>
}

export const api = {
    correlations: () => getJson<CorrelationPoint[]>('/correlations'),
    topByAttendance: () => getJson<AttendancePoint[]>('/top5/attendance'),
    topByHoursStudied: () =>
        getJson<HoursStudiedPoint[]>('/top5/hours_studied'),
    topByAccessToResources: () =>
        getJson<AccessToResourcesPoint[]>('/top5/access_to_resources'),
    topByParentalInvolvement: () =>
        getJson<ParentalInvolvementPoint[]>('/top5/parental_involvement'),
    topByTutoringSessions: () =>
        getJson<TutoringSessionsPoint[]>('/top5/tutoring_sessions'),
}
