"use client"

import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"
import {SunIcon} from "@radix-ui/react-icons"

import {Button} from "@/registry/new-york/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/registry/new-york/ui/dropdown-menu"

import {Checkbox} from "@/registry/new-york/ui/checkbox"


export function Option() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-9 items-center lg:flex"
        >
          <SunIcon className="mr-2 h-4 w-4"/>
          高亮显示
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>在图中高亮显示</DropdownMenuLabel>
        <DropdownMenuSeparator/>

        <div className="flex flex-col gap-1">
          <div className="relative flex w-full cursor-default select-none items-center space-x-2 rounded-sm py-1 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <Checkbox id="terms"/>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              涨停
            </label>
          </div>
          <div className="relative flex w-full cursor-default select-none items-center space-x-2 rounded-sm py-1 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <Checkbox id="terms"/>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              跌停
            </label>
          </div>
          <div className="relative flex w-full cursor-default select-none items-center space-x-2 rounded-sm py-1 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <Checkbox id="terms"/>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              平盘
            </label>
          </div>
          <div className="relative flex w-full cursor-default select-none items-center space-x-2 rounded-sm py-1 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <Checkbox id="terms"/>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              0%
            </label>
          </div>

        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
