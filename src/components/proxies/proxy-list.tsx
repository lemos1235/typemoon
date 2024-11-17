import { List, ListItem } from "@mui/material";
import ProxyItem from "./proxy-item";

interface Props {
  current?: string,
  nodeList: IMoonProxy[],
}

const ProxyList = (props: Props) => {
  const { current, nodeList } = props;
  return (
    <List>
      {nodeList.map((node) => (
        <ListItem key={node.uid} sx={{ padding: "7px 2px" }}>
          <ProxyItem current={current} node={node} />
        </ListItem>
      ))}
    </List>
  )
}

export default ProxyList;