import * as echarts from "echarts";
import { useEffect, useRef } from "react";

export interface EChartsLineSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface EChartsPieSeries {
  name: string;
  radius: `${number}%`;
  data: { name: string; value: number; color?: string }[];
}

export const pieChartOptions = ({
  title,
  series,
  legendPosition = "left",
  orientation = "horizontal",
}: {
  title: string;
  series: EChartsPieSeries[];
  legendPosition?: "left" | "right" | "bottom" | "top" | "center";
  orientation?: "vertical" | "horizontal";
}) => ({
  title: {
    text: title,
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: orientation,
    left: legendPosition,
  },
  series: series.map((s) => ({
    name: s.name,
    type: "pie",
    radius: s.radius,
    data: s.data.map((d) => ({ name: d.name, value: d.value, color: d.color })),
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  })),
});

export const areaChartOptions = ({
  title,
  xAxisLabels,
  series,
}: {
  title: string;
  xAxisLabels: string[];
  series: EChartsLineSeries[];
}) => ({
  title: {
    text: title,
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: xAxisLabels,
  },
  yAxis: {
    type: "value",
  },
  series: series.map((s) => ({
    name: s.name,
    color: s.color,
    type: "line",
    areaStyle: {},
    smooth: true,
    data: s.data,
  })),
});

export function ApacheEChart({
  className,
  options,
}: {
  className?: string;
  options: any;
}) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    chartInstance.setOption(options);

    return () => {
      chartInstance.dispose();
    };
  }, [chartRef.current?.getBoundingClientRect()]);

  return <div ref={chartRef} className={className} />;
}
