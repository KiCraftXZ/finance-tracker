"use client"

import { ResponsiveContainer, ResponsiveContainerProps } from "recharts"

export const ResponsiveChartContainer = ({
    className,
    ...props
}: ResponsiveContainerProps & { className?: string }) => {
    return (
        <div className={className} style={{ width: '100%', height: '100%', minHeight: 300 }}>
            <ResponsiveContainer {...props} />
        </div>
    )
}
