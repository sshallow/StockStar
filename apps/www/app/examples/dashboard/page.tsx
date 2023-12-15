"use client"

import { useEffect, useState } from "react"
import requestClient from "@/request/request"
import { ArrowBottomRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons"
import { useDebouncedCallback } from "use-debounce"

import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"
import { CheckView } from "@/app/examples/dashboard/components/check-view"
import { Search } from "@/app/examples/dashboard/components/search"

import { PresetSelector } from "../playground/components/preset-selector"
import { Factor } from "../playground/data/factors"
import { presets } from "../playground/data/presets"
import { Chart } from "./components/react-echarts"

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Example dashboard app built using the components.",
// }

export default function DashboardPage() {
  const [data, setData] = useState<number[][]>([])
  // const schema [
  //     {
  //         "unit": "亿",
  //         "name": "CMV",
  //         "x": 1,
  //         "index": 0,
  //         "y": 0,
  //         "text": "A股流通市值"
  //     },
  //     {
  //         "unit": "%",
  //         "name": "real_turnover_rate",
  //         "x": 0,
  //         "index": 0,
  //         "y": 1,
  //         "text": "本征换手率"
  //     }
  // ]
  const [schemaData, setSchemaData] = useState([])
  //
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await requestClient({
          // url: "http://smartpayt.com/prod-api/factor/paper/sky?x=CMV&y=trans_qt&param=f1,f3,f30", // 用您的 API 端点替换
          url: "http://smartpayt.com/prod-api/factor/paper/sky?x=CMV&y=real_turnover_rate&param=f1,TBL", // 用您的 API 端点替换
          method: "GET",
        })
        setData(responseData.data.data)
        setSchemaData(responseData.data.schema)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  const handleXAxisSelect = (preset: Factor) => {
    console.log("选中的X坐标轴:")
    console.log(preset)
    // 这里你可以处理选中的预设
  }
  const handleYAxisSelect = (preset: Factor) => {
    console.log("选中的Y坐标轴:")
    console.log(preset)
    // 这里你可以处理选中的预设
  }
  // 对数
  const [logAxis, setLogAxis] = useState(false)
  const handleTabChange = (value: string) => {
    setLogAxis(value === "log")
  }
  // 形状
  const [symbol, setSymbol] = useState("circle") // 默认为圆点
  const handleSymbolChange = (value: string) => {
    setSymbol(value)
  }
  // 高亮显示
  const [selectedChecks, setSelectedChecks] = useState(new Set<string>())
  const handleCheckChange = (newSelectedChecks: Set<string>) => {
    setSelectedChecks(newSelectedChecks)
  }

  const [searchValue, setSearchValue] = useState("")
  const [searchData, setSearchData] = useState([])
  // 输入框
  const handleSearchChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value)
      // 搜索逻辑：检查 x 或 y 值是否包含搜索词
      // const search = data.filter(
      //   ([x, y]) =>
      //     x.toString().includes(searchValue) || y.toString().includes(searchValue)
      // )
      // console.log(search)
      // setSearchData(search)
      // setSearchValue()
    },
    300
  )

  // 搜索
  const handleSearch = () => {}
  return (
    <>
      <div className="flex flex-col ">
        <div className="flex-1 p-8 pt-12 space-y-4">
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
            <div className="hidden grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
                    className="w-4 h-4 text-muted-foreground"
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
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">成交额</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-muted-foreground"
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
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
                    className="w-4 h-4 text-muted-foreground"
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
                    className="w-4 h-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6 text-2xl font-bold ">
                    <div className="flex items-center ">
                      1573
                      <ArrowTopRightIcon className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="flex items-center ">
                      3490
                      <ArrowBottomRightIcon className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">5340 只股票</p>
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
                />
                <PresetSelector
                  title="纵轴"
                  presets={presets}
                  onPresetSelect={handleYAxisSelect}
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
            <div className="relative w-full pb-[60%]">
              <Card className="absolute inset-0 overflow-visible">
                <Chart
                  data={data}
                  schemaData={schemaData}
                  searchValue={searchValue}
                  symbol={symbol}
                  logAxis={logAxis}
                  hl_sets={selectedChecks}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
