import { Input } from "@/registry/new-york/ui/input"

// 定义 Search 组件的 props 类型
interface SearchProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void // 定义 onChange 的类型
}

export function Search({ onChange }: SearchProps) {
  return (
    <div>
      <Input
        type="search"
        placeholder="股票代码..."
        className="md:w-[100px] lg:w-[250px]"
        onChange={onChange}
      />
    </div>
  )
}
