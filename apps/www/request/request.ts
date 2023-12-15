// api.js 或 api.ts

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // 限制为常见的 HTTP 方法
  headers?: { [key: string]: string }; // 字典类型，键和值都是字符串
  body?: any; // body 可以是任何类型，取决于您的需要
}
async function requestClient(requestConfig: RequestConfig) {
  const { url, method = "GET", headers = {}, body = null } = requestConfig;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 根据需要处理和返回响应，例如 JSON 或其他格式
    return await response.json()
  } catch (error) {
    console.error("Error making a request:", error)
    throw error
  }
}

export default requestClient
