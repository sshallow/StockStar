import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"

// 定义 props 的类型
interface TooltipCardProps {
  name: string
  code: string
  increase: string
  firstName: string
  firstValue: string
  firstUnit: string
  secondName: string
  secondValue: string
  secondUnit: string
  thirdName?: string
  thirdValue?: string
  thirdUnit?: string
}
export function TooltipCard({
  name,
  code,
  increase,
  firstName,
  firstValue,
  firstUnit,
  secondName,
  secondValue,
  secondUnit,
  thirdName,
  thirdValue,
  thirdUnit,
}: TooltipCardProps) {
  return (
    <Card className="pb-3">
      <CardHeader className="flex flex-col  space-y-0 p-3">
        <CardTitle className="flex flex-row items-end justify-between gap-4 text-base font-black ">
          {name}
          {/* <span className="ml-2 text-base text-muted-foreground">{code}</span> */}
          <div
            className={`flex items-center gap-1 ${
              increase.toString().startsWith("-")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <span className="text-base font-black">
              {increase.toString().startsWith("-") ? "" : "+"}
            </span>
            <span className="text-base font-black">{increase}%</span>
          </div>
        </CardTitle>

        <span className="text-xs text-muted-foreground">{code}</span>
      </CardHeader>
      <CardContent className="flex justify-between px-3 pb-1 text-sm ">
        <div className="">{firstName}</div>
        <span className="ml-2 text-muted-foreground">
          {firstValue}
          {firstUnit}
        </span>
      </CardContent>
      <CardContent className="flex justify-between px-3 pb-1 text-sm">
        <div className="">{secondName}</div>
        <span className="ml-2 text-muted-foreground">
          {secondValue}
          {secondUnit}
        </span>
      </CardContent>
      {thirdName && thirdValue && (
        <CardContent className="flex justify-between px-3 pb-1 text-sm">
          <div className="">{thirdName}</div>
          <span className="ml-2 text-muted-foreground">
            {thirdValue}
            {thirdUnit}
          </span>
        </CardContent>
      )}
    </Card>
  )
}
