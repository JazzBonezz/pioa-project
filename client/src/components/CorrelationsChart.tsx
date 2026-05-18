import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'
import type { CorrelationPoint } from '../api/types'
import { factorLabelRu, yAxisWidthForLabels } from '../config/factorLabels'
import { TOP_FACTOR_KEYS } from '../config/topFactors'
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery'

const TOP_SET = new Set<string>(TOP_FACTOR_KEYS)

function barColor(factor: string) {
    return TOP_SET.has(factor) ? 'var(--accent)' : '#a78bfa'
}

export function CorrelationsChart({ data }: { data: CorrelationPoint[] }) {
    const isMobile = useMediaQuery(MOBILE_QUERY)
    const chartData = [...data]
        .filter((d) => d.r > 0)
        .sort((a, b) => b.r - a.r)
        .map((d) => ({
            ...d,
            label: factorLabelRu(d.factor),
            isTop: TOP_SET.has(d.factor),
        }))

    const axisWidth = yAxisWidthForLabels(
        chartData.map((d) => d.label),
        isMobile,
    )
    const maxR = chartData.length ? Math.max(...chartData.map((d) => d.r)) : 1
    const rowHeight = isMobile ? 28 : 32
    const chartHeight = Math.max(
        isMobile ? 280 : 320,
        chartData.length * rowHeight,
    )

    return (
        <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={
                    isMobile
                        ? { top: 6, right: 10, left: 2, bottom: 6 }
                        : { top: 8, right: 24, left: 12, bottom: 8 }
                }
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    horizontal={false}
                />
                <XAxis
                    type="number"
                    domain={[0, Math.ceil(maxR * 10) / 10]}
                    tick={{ fill: 'var(--text)', fontSize: isMobile ? 10 : 12 }}
                    stroke="var(--border)"
                    tickCount={isMobile ? 4 : 5}
                />
                <YAxis
                    type="category"
                    dataKey="label"
                    width={axisWidth}
                    interval={0}
                    tick={({ x, y, payload }) => {
                        const row = chartData.find(
                            (d) => d.label === payload.value,
                        )
                        return (
                            <text
                                x={x}
                                y={y}
                                dy={4}
                                textAnchor="end"
                                fill={
                                    row?.isTop ? 'var(--text-h)' : 'var(--text)'
                                }
                                fontSize={isMobile ? 10 : row?.isTop ? 12 : 11}
                                fontWeight={row?.isTop ? 600 : 400}
                            >
                                {payload.value}
                            </text>
                        )
                    }}
                    stroke="var(--border)"
                />
                <Tooltip
                    formatter={(value) => [
                        typeof value === 'number' ? value.toFixed(3) : '—',
                        'Корреляция',
                    ]}
                    labelFormatter={(_, payload) => {
                        const item = payload?.[0]?.payload as
                            | { label?: string }
                            | undefined
                        return item?.label ?? ''
                    }}
                    contentStyle={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                    }}
                    labelStyle={{
                        color: 'var(--accent)',
                        fontWeight: 600,
                        marginBottom: 4,
                    }}
                    itemStyle={{
                        color: 'var(--text-h)',
                    }}
                />
                <Bar
                    dataKey="r"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={isMobile ? 16 : 20}
                >
                    {chartData.map((entry) => (
                        <Cell
                            key={entry.factor}
                            fill={barColor(entry.factor)}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
