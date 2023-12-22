"use client"

import requestClient from "@/request/request"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import { CheckView } from "@/app/examples/dashboard/components/check-view"
import { Search } from "@/app/examples/dashboard/components/search"
import {
  SearchListTable,
  Stock,
} from "@/app/examples/dashboard/components/search-list-table"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/registry/new-york/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"

import { useTheme } from "next-themes"
import { PresetSelector } from "../playground/components/preset-selector"
import { Factor } from "../playground/data/factors"
import { presets } from "../playground/data/presets"
import { Chart, Schema } from "./components/react-echarts"

// 用作默认值的 Factor 对象
const defaultX: Factor = {
  factorId: 50001002,
  factorName: "A股流通市值",
  parentId: 50001,
  parentName: "估值指标",
  factorSymbol: "CMV",
  children: [],
}

const defaultY: Factor = {
  factorId: 60001009,
  factorName: "本征换手率",
  parentId: 60001,
  parentName: "量价指标",
  factorSymbol: "real_turnover_rate",
  children: [],
}

const defaultParam: string[] = [
  "f1",
  "TBL",
  "PBR60",
  "et2",
]

export default function DashboardPage() {
  const { setTheme } = useTheme()
  setTheme("dark")

  const [searchValue, setSearchValue] = useState("")

  // 数据, 单位
  const [data, setData] = useState<number[][]>([])
  const [schemaData, setSchemaData] = useState<Schema[]>([])
  //  上涨家数, 下跌家数, 平盘家数
  const [upCount, setUpCount] = useState(0)
  const [lowCount, setLowCount] = useState(0)
  const [zeroCount, setZeroCount] = useState(0)
  // 涨停家数, 跌停家数, 新高家数, 新低家数, 新股家数
  const [hl_up_count, setHl_up_count] = useState(0)
  const [hl_low_count, setHl_low_count] = useState(0)
  const [hl_zero_count, setHl_zero_count] = useState(0)
  const [hl_newHigh_count, setHl_newHigh_count] = useState(0)
  const [hl_newLow_count, setHl_newLow_count] = useState(0)
  const [hl_newStock_count, setHl_newStock_count] = useState(0)


  // 选中的横轴,纵轴
  const [xAxisSelected, setXAxisSelected] = useState<Factor>(defaultX)
  const [yAxisSelected, setYAxisSelected] = useState<Factor>(defaultY)
  // 形状
  const [symbol, setSymbol] = useState("circle") // 默认为圆点
  // 对数
  const [logAxis, setLogAxis] = useState(false)
  // 高亮显示
  const [selectedChecks, setSelectedChecks] = useState(new Set<string>())
  const [hl_up_data, setHl_up_data] = useState<number[][]>([])
  const [hl_low_data, setHl_low_data] = useState<number[][]>([])
  const [hl_zero_data, setHl_zero_data] = useState<number[][]>([])
  const [hl_newHigh_data, setHl_newHigh_data] = useState<number[][]>([])
  const [hl_newLow_data, setHl_newLow_data] = useState<number[][]>([])
  const [hl_newStock_data, setHl_newStock_data] = useState<number[][]>([])

  // 搜索结果 searchListData (Stock)
  const [searchListData, setSearchListData] = useState<Stock[]>([])

  // url 拼接 defaultParam
  const paramStr = defaultParam.join(',')
  const url = `http://smartpayt.com/prod-api/factor/paper/sky?x=${xAxisSelected.factorSymbol}&y=${yAxisSelected.factorSymbol}&param=${paramStr}`

  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await requestClient({ url, method: "GET" })
        setData(responseData.data.data)
        setSchemaData(responseData.data.schema)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [xAxisSelected, yAxisSelected]) // 依赖于 X 轴和 Y 轴的选中状态

  if (!data) {
    return <div>Loading...</div>
  }

  const handleXAxisSelect = (preset: Factor) => {
    console.log("选中的X坐标轴:")
    console.log(preset)
    setXAxisSelected(preset) // 更新 X 轴选中值

    // 这里你可以处理选中的预设
  }
  const handleYAxisSelect = (preset: Factor) => {
    console.log("选中的Y坐标轴:")
    console.log(preset)
    setYAxisSelected(preset) // 更新 Y 轴选中值
  }

  const handleTabChange = (value: string) => {
    setLogAxis(value === "log")
  }

  const handleSymbolChange = (value: string) => {
    setSymbol(value)
  }


  const handleCheckChange = (newSelectedChecks: Set<string>) => {
    setSelectedChecks(newSelectedChecks)
    // 高亮状态的数据 item[5]涨停标记  item[6]n日状态
    //  2：一字涨停；1：普通涨停；
    const filter_Hl_Up_Data = newSelectedChecks.has("hl_up")
      ? data.filter((item) => item[5] === 2 || item[5] === 1)
      : []
    setHl_up_data(filter_Hl_Up_Data)
    // -2一字跌停； -1：普通跌停；
    const filter_Hl_Low_Data = newSelectedChecks.has("hl_low")
      ? data.filter((item) => item[5] === -1 || item[5] === -2)
      : []
    setHl_low_data(filter_Hl_Low_Data)
    // 0：无涨跌停；
    // const filter_Hl_Zero_Data = newSelectedChecks.has("hl_zero")
    //   ? data.filter((item) => item[5] === 0)
    //   : []
    // setHl_zero_data(filter_Hl_Zero_Data)
    // 2：新高；
    const filter_Hl_NewHigh_Data = newSelectedChecks.has("hl_newHigh")
      ? data.filter((item) => item[6] === 2)
      : []
    setHl_newHigh_data(filter_Hl_NewHigh_Data)
    // 2：新高；
    const filter_Hl_NewLow_Data = newSelectedChecks.has("hl_newLow")
      ? data.filter((item) => item[6] === -2)
      : []
    setHl_newLow_data(filter_Hl_NewLow_Data)
    // ET2 为 null 或者 0：新股；
    const filter_Hl_NewStock_Data = newSelectedChecks.has("hl_newStock")
      ? data.filter((item) => item[7] === null || item[7] === 0)
      : []
    setHl_newStock_data(filter_Hl_NewStock_Data)


    // 为每个数组添加 type 字段
    const mapDataWithType = (data: number[][], type: string) => {
      return data.map((item, index) => ({
        id: index.toString(),
        type: type, // 设置数据来源类型
        sec_cd: item[2].toString(),
        sec_nm: item[3].toString(),
        x: item[0].toString(),
        y: item[1].toString(),
        open: "",
        close: "",
        high: "",
        low: "",
        first: item[4].toString(),
        second: item[5].toString(),
        third: "",
      }));
    };

    // 合并数组，同时添加 type 字段来区分不同的数据来源
    const combinedData: Stock[] = [
      ...mapDataWithType(filter_Hl_Up_Data || [], 'hl_up'),
      ...mapDataWithType(filter_Hl_Low_Data || [], 'hl_low'),
      ...mapDataWithType(filter_Hl_NewHigh_Data || [], 'hl_newHigh'),
      ...mapDataWithType(filter_Hl_NewLow_Data || [], 'hl_newLow'),
      ...mapDataWithType(filter_Hl_NewStock_Data || [], 'hl_newStock'),
    ];

    // 现在 combinedData 是包含 type 字段的完整数据集
    console.log(combinedData);
    setSearchListData(combinedData)
  }

  // 输入框
  const handleSearchChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value)
    },
    300
  )

  // 搜索
  const handleSearch = () => { }
  return (
    <>
      <div className="flex flex-col ">
        <div className="flex-1 space-y-4 p-8 pt-12">
          <div className="flex items-center justify-between space-y-2 ">
            <h2 className="text-3xl font-bold tracking-tight md:text-3xl">
              ✨市场星图
            </h2>
            <div className="flex items-center space-x-2">
              <Search onChange={handleSearchChange} />
              <Button onClick={handleSearch}>搜索</Button>
            </div>
          </div>
          {/* <TooltipCard
            name="贵州茅台"
            code="600519"
            increase="0.24%"
            marketValue="2000"
            turnoverRate="00+"
          /> */}
          <div className="space-y-4 ">
            <div className="grid gap-4  md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    涨跌分布
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-0.5 text-2xl font-bold ">
                    <div className=" text-red-500">
                      1573
                      {/* <ArrowTopRightIcon className="h-4 w-4 text-secondary-foreground" /> */}
                    </div>
                    <div>:</div>
                    <div className=" text-gray-500">
                      34
                      {/* <ArrowBottomRightIcon className="h-4 w-4 text-secondary-foreground" /> */}
                    </div>
                    <div>:</div>
                    <div className=" text-green-500">
                      3490
                      {/* <ArrowBottomRightIcon className="h-4 w-4 text-secondary-foreground" /> */}
                    </div>
                  </div>
                  <p className="pt-0.5 text-xs text-muted-foreground">沪深京 {data?.length} 只股票</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    沪深 300
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent className="">
                  <div className="text-2xl font-bold">3020</div>
                  <p className="text-xs text-muted-foreground">+20 +0.24%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">成交额</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8350亿</div>
                  <p className="text-xs text-muted-foreground">+18.1% 比昨日</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    市场体积
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+1,234亿</div>
                  <p className="text-xs text-muted-foreground">+19% 比昨日</p>
                </CardContent>
              </Card>

            </div>

            <div className="py-4 ">
              <div className="flex flex-wrap items-center gap-4">
                {/* <TeamSwitcher /> */}
                {/* <div> */}
                <PresetSelector
                  title="横轴"
                  presets={presets}
                  onPresetSelect={handleXAxisSelect}
                  defaultFactor={defaultX}
                />
                <PresetSelector
                  title="纵轴"
                  presets={presets}
                  onPresetSelect={handleYAxisSelect}
                  defaultFactor={defaultY}
                />
                <Select
                  defaultValue="circle"
                  onValueChange={handleSymbolChange}
                >
                  <SelectTrigger className=" w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {/*<DropdownMenuLabel>点形状</DropdownMenuLabel>*/}
                    {/*<DropdownMenuSeparator />*/}
                    <SelectItem value="rect">星星</SelectItem>
                    <SelectItem value="circle">圆点</SelectItem>
                  </SelectContent>
                </Select>
                <Tabs
                  defaultValue="normal"
                  className="space-y-4"
                  onValueChange={handleTabChange}
                >
                  <TabsList>
                    <TabsTrigger value="normal">普通坐标</TabsTrigger>
                    <TabsTrigger value="log">对数坐标</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="ml-auto">
                  <CheckView
                    title="高亮显示"
                    onSelectedChange={handleCheckChange}
                  />
                </div>
              </div>
            </div>
            {/* <div className="relative max-w-2xl pb-[50%]"> */}
            <div className="relative  w-full pb-[50%]">
              <Card className="absolute inset-0 overflow-visible">
                <Chart
                  data={data}
                  schemaData={schemaData}
                  searchValue={searchValue}
                  symbol={symbol}
                  logAxis={logAxis}
                  hl_up_data={hl_up_data}
                  hl_low_data={hl_low_data}
                  hl_zero_data={hl_zero_data}
                  hl_newHigh_data={hl_newHigh_data}
                  hl_newLow_data={hl_newLow_data}
                  hl_newStock_data={hl_newStock_data}
                />
              </Card>
            </div>
            <div className="">
              <div className="text-sm">
                <div className="flex w-full flex-col items-center justify-between space-y-2">
                  <div className="flex w-full items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-red-500"></div>
                      <div>上涨</div>

                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                      <div>下跌</div>

                      <div className="h-4.5 w-4.5 rounded-full bg-red-300 p-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                      </div>
                      <div>涨停</div>

                      <div className="h-4.5 w-4.5 rounded-full bg-green-300 p-1">
                        <div className="h-2.5 w-2.5 rounded-full  bg-green-500"></div>
                      </div>
                      <div>跌停</div>

                      <div className="h-4.5 w-4.5 rounded-full bg-blue-300 p-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                      </div>
                      <div>新高</div>

                      <div className="h-4.5 w-4.5 rounded-full bg-yellow-300 p-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                      </div>
                      <div>新低</div>

                      <div className="h-4.5 w-4.5 rounded-full bg-purple-300 p-1">
                        <div className="h-2.5 w-2.5 rounded-full bg-purple-500"></div>
                      </div>
                      <div>新股</div>
                    </div>
                  </div>
                </div>
              </div>
              <CardHeader className="p-0  py-6 flex">
                <CardTitle>搜索结果</CardTitle>
                <div>搜索以及高亮结果</div>
              </CardHeader>
              <CardContent className="p-0">
                <SearchListTable data={searchListData} />
              </CardContent>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
