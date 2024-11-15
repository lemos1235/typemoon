import { Box } from "@mui/material"
import ProxyList from "./proxy-list";
import { Plus } from 'lucide-react'

//本地节点
export const LocalProxies = () => {
  const currentProxyId = "2";
  const proxyList: IMoonProxy[] = [
    { uid: "1", name: "39", scheme: "socks", host: "192.168.0.39", port: 1080, username: "", password: "", remark: "" },
    { uid: "2", name: "38", scheme: "socks", host: "192.168.0.38", port: 1080, username: "", password: "", remark: "" },
  ];
 
  return (
    <Box>
      <Box sx={{
        marginBottom: "-10px", marginRight: "15px",
        textAlign: "right", color: "var(--text-primary)", fontSize: "20px",
        cursor: "pointer"
      }}>
        <Plus />
      </Box>
      <ProxyList current={currentProxyId} nodeList={proxyList} />
    </Box>
  )
}

//订阅节点
export const SubscriptionProxies = () => {
  const groups: IMoonProxyGroup[] = [];
  return (
    <Box>
      订阅节点
    </Box>
  )
}
