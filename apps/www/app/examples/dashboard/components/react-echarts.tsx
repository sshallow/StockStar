// React-ECharts.tsx
"use client";

import ReactECharts from "echarts-for-react";
import { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";



import { TooltipCard } from "./tooltip";


// Props 接口定义
interface ChartProps {
  data?: number[][] // 假设数据是一个二维数组，例如 [[x1, y1], [x2, y2], ...]
  schemaData?: Schema[]
  searchValue?: string
  searchData?: number[][]
  xAxis?: string
  yAxis?: string
  symbol?: string
  logAxis?: boolean
  hl_up_data?: number[][]
  hl_low_data?: number[][]
  hl_zero_data?: number[][]
  hl_newHigh_data?: number[][]
  hl_newLow_data?: number[][]
  hl_newStock_data?: number[][]
}

export interface Schema {
  text: string
  name: string
  unit: string
  x: number
  y: number
  index: number
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
  hl_up_data,
  hl_low_data,
  hl_zero_data,
  hl_newHigh_data,
  hl_newLow_data,
  hl_newStock_data
}: ChartProps): JSX.Element {
  // 创建一个 ref 来引用 ECharts 实例
  const chartRef = useRef<ReactECharts>(null)

  // option
  const tooltipOption = {
    trigger: "item",
    formatter: function (params: { data: number[] }) {
      if (schemaData && schemaData.length > 0) {
        var html = []
        const tooltipCard = (
          <TooltipCard
            name={params.data[3].toString()}
            code={params.data[2].toString()}
            increase={params.data[4].toString()}
            firstName={schemaData[0].text}
            firstValue={params.data[0].toString()}
            firstUnit={schemaData[0].unit}
            secondName={schemaData[1].text}
            secondValue={params.data[1].toString()}
            secondUnit={schemaData[1].unit}
          />
        )
        const tooltipHtml = ReactDOMServer.renderToString(tooltipCard)
        html.push(tooltipHtml)
        return html.join("<br>")
      }
    },
    textStyle: {
      color: "#4b5563", // 设置文本颜色，例如 Tailwind 的 text-gray-600
    },
    padding: 0,
    margin: 0,
    borderWidth: 0, // 提示框浮层的边框宽。
    backgroundColor: "transparent", // 透明背景
    axisPointer: {
      show: true,
      type: 'cross',
      lineStyle: {
        type: 'dashed',
        width: 1
      }
    }
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
    right: "2.5%", // 图表右边距
    top: "2.5%", // 图表顶部边距，留出标题空间
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
      name:
        schemaData && schemaData.length > 0
          ? schemaData[0].text + "(" + schemaData[0].unit + ")"
          : "",

      nameTextStyle: {
        color: "#A1A1AA",
        fontSize: 14,
        verticalAlign: "bottom",
        padding: [0, 0, 20, -100], //name文字位置 对应 上右下左
      },
    },
    yAxis: {
      ...axisOption,
      name:
        schemaData && schemaData.length > 0
          ? schemaData[1].text + "(" + schemaData[1].unit + ")"
          : "",
      nameTextStyle: {
        color: "#A1A1AA",
        fontSize: 14,
        verticalAlign: "top",
        padding: [10, -100, 0, 50], //name文字位置 对应 上右下左
      },
    },
    grid: gridOption,
  }

  // 使用 useEffect 监听变化, 依赖项数组包含 data, searchValue, symbol, hl_sets
  useEffect(() => {
    if (schemaData && schemaData.length < 1) {
      // 如果 schemaData 不包含元素，不执行任何操作
      return
    }
    const chart = chartRef.current?.getEchartsInstance()
    if (!chart) {
      console.warn("ECharts 实例不存在")
      return
    }
    // 构建新的系列配置
    const newSeries = [
      {
        data: data,
        type: "scatter",
        symbol: symbol,
        symbolSize: function (value: number[]) {
          return Math.sqrt(Math.abs(value[4])) * 2 + 1
        },
        emphasis: {
          itemStyle: {
            color: "#fff",
            shadowColor: "#fff",
          },
        },
        itemStyle: {
          color: function (params: { data: number[] }) {
            return params.data[4] > 0 ? "#ef4444" : "#22c55e"
          },
        },
        // 选中状态
        // select: {
        //   itemStyle: {
        //     color: "#0082f9",
        //     borderColor: "#ffffff",
        //     borderWidth: 1,
        //   }
        // },
        // selectedMode: "single",
        progressive: 5500, //设置渲染每一帧的图形数量，如果数据量巨大，这个值可以小一点，否则会卡顿
      },
      ...(hl_up_data && hl_up_data.length > 0
        ? [
          {
            data: hl_up_data,
            type: "effectScatter",
            // symbolSize: 8,
            symbolSize: function (value: number[]) {
              return Math.sqrt(Math.abs(value[4])) * 2 + 1
            },
            itemStyle: {
              color: "#dc2626",
            },
            rippleEffect: {
              brushType: "fill",
              color: "#fca5a5",
              scale: 4,
              number: 2,
            },
          },
        ]
        : []),
      ...(hl_low_data && hl_low_data.length > 0
        ? [
          {
            data: hl_low_data,
            type: "effectScatter",
            // symbolSize: 8,
            itemStyle: {
              color: "#16a34a",
            },
            rippleEffect: {
              brushType: "fill",
              color: "#86efac",
              scale: 4,
              number: 2,
            },
          },
        ]
        : []),
      ...(hl_zero_data && hl_zero_data.length > 0
        ? [
          {
            data: hl_zero_data,
            type: "effectScatter",
            // symbolSize: 8,
            itemStyle: {
              color: "#6b7280",
            },
            rippleEffect: {
              brushType: "fill",
              color: "#d1d5db",
              scale: 4,
              number: 2,
            },
          },
        ]
        : []),
      ...(hl_newHigh_data && hl_newHigh_data.length > 0
        ? [
          {
            data: hl_newHigh_data,
            type: "effectScatter",
            // symbolSize: 8,
            itemStyle: {
              color: "#2563eb",
            },
            rippleEffect: {
              brushType: "fill",
              color: "#93c5fd",
              scale: 4,
              number: 2,
            },
          },
        ]
        : []),
      ...(hl_newLow_data && hl_newLow_data.length > 0
        ? [
          {
            data: hl_newLow_data,
            type: "effectScatter",
            // symbolSize: 8,
            itemStyle: {
              color: "#ca8a04",
            },
            rippleEffect: {
              brushType: "fill",
              color: "#fde047",
              scale: 4,
              number: 2,
            },
          },
        ]
        : []),
      ...(hl_newStock_data && hl_newStock_data.length > 0
        ? [
          {
            data: hl_newStock_data,
            type: "effectScatter",
            // symbolSize: 8,
            itemStyle: {
              color: "#7c3aed",
            },
            rippleEffect: {
              brushType: "fill",
              color: "#c4b5fd",
              scale: 4,
              number: 2,
            },
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
    chart?.setOption(
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
  }, [
    data,
    searchValue,
    symbol,
    hl_up_data,
    hl_low_data,
    hl_zero_data,
    hl_newHigh_data,
    hl_newLow_data,
  ])

  return (
    <>
      <div className=" flex h-full flex-col items-center justify-between space-y-2">
        <div className="w-full flex-1">
          {/* <div
            className={clsx("grid h-full items-stretch gap-6", {
              "md:grid-cols-[1fr_200px]": hl_up_data?.length > 0,
            })}
          > */}

          <ReactECharts
            option={optionData}
            style={{ height: "100%", width: "100%" }}
            ref={chartRef} // 将 ref 传递给 ReactECharts 组件
          />

          {/* 有hl_up_data?.length > 0才显示 */}

          {/* </div> */}
        </div>
      </div>
    </>
  )
}