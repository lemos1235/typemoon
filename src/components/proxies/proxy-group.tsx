import { Box } from "@mui/material"
import ProxyList from "./proxy-list";

//本地节点
export const LocalProxies = () => {
  const nodes: IProxyItem[] = [];
  return (
    <Box>
      <ProxyList nodes={nodes} />
    </Box>
  )
}

//订阅节点
export const SubscriptionProxies = () => {
  return (
    <Box>
      订阅节点
    </Box>
  )
}
