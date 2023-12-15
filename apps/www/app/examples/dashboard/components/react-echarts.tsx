// React-ECharts.tsx
"use client"

import ReactECharts from "echarts-for-react"
import { useEffect, useRef } from "react"
import ReactDOMServer from "react-dom/server"

import { TooltipCard } from "./tooltip"

// Props 接口定义
interface ChartProps {
  data?: number[][] // 假设数据是一个二维数组，例如 [[x1, y1], [x2, y2], ...]
  schemaData?: any[]
  searchValue?: string
  searchData?: number[][]
  xAxis?: string
  yAxis?: string
  symbol?: string
  logAxis?: boolean
  hl_sets?: Set<string>
}

export function Chart({
  data,
  schemaData,
  searchValue,
  searchData,
  xAxis,
  yAxis,
  symbol,
  logAxis,
  hl_sets,
}: ChartProps): JSX.Element {
  // 直接根据 hl_sets 设置每个高亮状态
  const hl_up = hl_sets?.has("hl_up") || false
  const hl_low = hl_sets?.has("hl_low") || false
  const hl_zero = hl_sets?.has("hl_zero") || false
  const hl_newHigh = hl_sets?.has("hl_newHigh") || false
  const hl_newLow = hl_sets?.has("hl_newLow") || false

  // 创建一个 ref 来引用 ECharts 实例
  const chartRef = useRef<ReactECharts>(null)

  // option

  const tooltipOption = {
    trigger: "item",
    formatter: function (params: any[]) {
      var html = []
      const tooltipCard = (
        <TooltipCard
          name={params.data[3]}
          code={params.data[2]}
          increase={params.data[4]}
          firstName={schemaData[0].text}
          firstValue={params.data[0]}
          firstUnit={schemaData[0].unit}
          secondName={schemaData[1].text}
          secondValue={params.data[1]}
          secondUnit={schemaData[1].unit}
        />
      )
      const tooltipHtml = ReactDOMServer.renderToString(tooltipCard)
      html.push(tooltipHtml)
      return html.join("<br>")
    },
    textStyle: {
      color: "#4b5563", // 设置文本颜色，例如 Tailwind 的 text-gray-600
    },
    padding: 0,
    margin: 0,
    borderWidth: 0, // 提示框浮层的边框宽。
    backgroundColor: "transparent", // 透明背景
  }

  // 轴的公共配置
  const axisOption = {
    scale: true,
    type: logAxis ? "log" : "value", // 根据 logAxis 决定轴类型
    axisLine: {
      show: false,
      lineStyle: {
        color: "#27272A",
      },
    },
    axisLabel: {
      color: "#888888",
      margin: -10,
    },
    axisTick: { show: false },
    splitLine: { show: false },
  }

  // 网格的公共配置
  const gridOption = {
    left: "1%", // 图表左边距
    right: "2%", // 图表右边距
    top: "2%", // 图表顶部边距，留出标题空间
    bottom: "2%", // 图表底部边距
    containLabel: true, // 确保标签完全显示
  }

  // 缩放控件
  const toolboxOption = {
    top: "1%",
    right: "1%",
    feature: {
      show: true,
      dataZoom: {
        title: {
          zoom: "缩放",
          back: "还原",
        },
        // icon: {
        //   zoom: '',
        //   back: '',
        // },
        // iconStyle: {}, //设置图标样式
        xAxisIndex: 0, //指定哪些X轴可以被控制
        yAxisIndex: 0, //指定哪些Y轴可以被控制（设置为 false，则不控制任何y轴）
      },
    },
  }

  // dataZoom
  const dataZoomOption = [
    // 内置型数据区域缩放组件
    {
      type: "inside",
      xAxisIndex: [0],
    },
    {
      type: "inside",
      yAxisIndex: [0],
    },
    // 滑动条型数据区域缩放组件
    {
      type: "slider",
      xAxisIndex: [0],
    },
    {
      type: "slider",
      yAxisIndex: [0],
    },
  ]

  // 散点图的option配置
  const optionData = {
    // 缩放控件
    toolbox: toolboxOption,
    xAxis: {
      ...axisOption,
      name: "市值(亿)",
      nameTextStyle: {
        color: "#A1A1AA",
        fontSize: 14,
        verticalAlign: "bottom",
        padding: [0, 0, 20, -50], //name文字位置 对应 上右下左
      },
    },
    yAxis: {
      ...axisOption,
      name: "成交量(万股)",
      nameTextStyle: {
        color: "#A1A1AA",
        fontSize: 14,
        verticalAlign: "top",
        padding: [10, -100, 0, 0], //name文字位置 对应 上右下左
      },
    },
    grid: gridOption,
  }

  // 使用 useEffect 监听变化, 依赖项数组包含 data, searchValue, symbol, hl_sets
  useEffect(() => {
    if (chartRef.current && chartRef.current.getEchartsInstance()) {
      const chart = chartRef.current.getEchartsInstance()
      // 构建新的系列配置
      const newSeries = [
        {
          data: data,
          type: "scatter",
          symbol: symbol,
          symbolSize: function (value: number[]) {
            // 使用绝对值
            return Math.sqrt(Math.abs(value[4])) * 2
          },
          itemStyle: {
            color: function (params: { data: number[] }) {
              return params.data[4] > 0 ? "red" : "green"
            },
          },
          emphasis: {
            itemStyle: {
              color: "white", // 改变颜色
            },
            symbolSize: 30,
          },
          progressive: 5500, //设置渲染每一帧的图形数量，如果数据量巨大，这个值可以小一点，否则会卡顿
        },
        ...(hl_up
          ? [
              {
                type: "effectScatter",
                symbolSize: 20,
                data: [
                  [10.0, 8.04],
                  [8.0, 6.95],
                ],
              },
            ]
          : []),
      ]
      // 在应用新的配置之前，先清除所有可能的高亮状态
      chart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      })
      // 使用新的系列配置更新图表
      chart.setOption(
        {
          tooltip: tooltipOption,
          toolbox: toolboxOption,
          // dataZoom: dataZoomOption,
          xAxis: axisOption,
          yAxis: axisOption,
          grid: gridOption,
          series: newSeries,
        },
        true
      )
      // 遍历数据，找到与搜索关键词匹配的数据点
      if (searchValue && searchValue.length > 0) {
        data?.forEach((item, index) => {
          if (
            item[0].toString() === searchValue ||
            item[1].toString() === searchValue ||
            item[2].toString() === searchValue ||
            item[3].toString() === searchValue
          ) {
            console.log("searchValue:" + searchValue)
            console.log("匹配", index)
            // 高亮显示匹配的数据点
            chart.dispatchAction({
              type: "highlight",
              seriesIndex: 0,
              dataIndex: index,
            })
            // 显示 tooltip
            chart.dispatchAction({
              type: "showTip",
              seriesIndex: 0,
              dataIndex: index,
            })
          }
        })
      }
    }
  }, [data, searchValue, symbol, hl_sets]) // 依赖项数组包含 hl_sets

  return (
    <>
      <div className=" flex flex-col items-center justify-between h-full space-y-2">
        <div className="flex-1 w-full">
          <ReactECharts
            option={optionData}
            style={{ height: "100%", width: "100%" }}
            ref={chartRef} // 将 ref 传递给 ReactECharts 组件
          />
        </div>
      </div>
    </>
  )
}
