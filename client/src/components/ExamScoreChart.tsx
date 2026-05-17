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
    const chartData = sortPoints(data, categoryKey)

    if (variant === 'line') {
        return (
            <ResponsiveContainer width="100%" height={340}>
                <LineChart
                    data={chartData}
                    margin={{ top: 12, right: 24, left: 8, bottom: 8 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--border)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey={categoryKey}
                        tick={{ fill: 'var(--text-h)', fontSize: 12 }}
                        stroke={axisStroke}
                        allowDecimals={false}
                    />
                    <YAxis
                        domain={['dataMin - 2', 'dataMax + 2']}
                        tick={axisTick}
                        stroke={axisStroke}
                        width={36}
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
        <ResponsiveContainer width="100%" height={340}>
            <BarChart
                data={chartData}
                margin={{ top: 12, right: 24, left: 8, bottom: 8 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    vertical={false}
                />
                <XAxis
                    dataKey={categoryKey}
                    tick={{ fill: 'var(--text-h)', fontSize: 12 }}
                    stroke={axisStroke}
                />
                <YAxis
                    domain={[0, 100]}
                    tick={axisTick}
                    stroke={axisStroke}
                    width={36}
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
