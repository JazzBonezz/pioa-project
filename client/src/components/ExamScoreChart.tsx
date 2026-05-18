import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery'

type Point = Record<string, string | number>

type ExamScoreChartProps = {
    data: Point[]
    categoryKey: string
    categoryLabel?: string
    variant: 'line' | 'bar'
}

const tooltipStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    color: 'var(--text-h)',
}

const axisTick = { fill: 'var(--text)', fontSize: 12 }
const axisStroke = 'var(--border)'

function sortPoints(data: Point[], categoryKey: string) {
    return [...data].sort((a, b) => {
        const av = a[categoryKey]
        const bv = b[categoryKey]
        const an = Number(av)
        const bn = Number(bv)
        if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn
        return String(av).localeCompare(String(bv))
    })
}

export function ExamScoreChart({
    data,
    categoryKey,
    categoryLabel = 'Категория',
    variant,
}: ExamScoreChartProps) {
    const isMobile = useMediaQuery(MOBILE_QUERY)
    const chartData = sortPoints(data, categoryKey)
    const chartHeight = isMobile ? 280 : 340
    const margin = isMobile
        ? { top: 8, right: 8, left: 0, bottom: 32 }
        : { top: 12, right: 24, left: 8, bottom: 8 }
    const xTick = {
        fill: 'var(--text-h)',
        fontSize: isMobile ? 10 : 12,
    }
    const xAxisProps = isMobile
        ? {
              angle: -42,
              textAnchor: 'end' as const,
              height: 56,
              interval: 0,
          }
        : { height: 30, interval: 'preserveStartEnd' as const }

    if (variant === 'line') {
        return (
            <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={chartData} margin={margin}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey={categoryKey}
                        tick={xTick}
                        stroke={axisStroke}
                        allowDecimals={false}
                        {...xAxisProps}
                    />
                    <YAxis
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tick={axisTick}
                        stroke={axisStroke}
                        width={isMobile ? 28 : 36}
                        tickCount={isMobile ? 5 : undefined}
                    />
                    <Tooltip
                        formatter={(value) => [value ?? '—', 'Средний балл']}
                        labelFormatter={(label) => `${categoryLabel}: ${label}`}
                        contentStyle={tooltipStyle}
                        labelStyle={{ color: 'var(--accent)', fontWeight: 600 }}
                        itemStyle={{ color: 'var(--text-h)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="avg_score"
                        stroke="var(--accent)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={chartData} margin={margin}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                />
                <XAxis
                    dataKey={categoryKey}
                    tick={xTick}
                    stroke={axisStroke}
                    {...xAxisProps}
                />
                <YAxis
                    domain={[0, 100]}
                    tick={axisTick}
                    stroke={axisStroke}
                    width={isMobile ? 28 : 36}
                />
                <Tooltip
                    formatter={(value) => [value ?? '—', 'Средний балл']}
                    labelFormatter={(label) => `${categoryLabel}: ${label}`}
                    contentStyle={tooltipStyle}
                />
                <Bar
                    dataKey="avg_score"
                    fill="var(--accent)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={56}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
