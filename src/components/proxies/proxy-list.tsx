import { Box, List, ListItem } from "@mui/material";
import { Virtuoso } from "react-virtuoso";
import { BaseEmpty } from "@/components/base";
import ProxyItem from "./proxy-item";

interface Props {
  current?: string,
  nodeList: IMoonProxy[],
}

const ProxyList = (props: Props) => {
  const { current, nodeList } = props;
  return (
    <Box sx={{ overflowY: "auto" }}>
      {
        nodeList.length > 0 ?
          <List>
            {nodeList.map((node, index) => <ListItem key={index} sx={{ padding: "7px 10px", }}><ProxyItem current={current} node={node} /></ListItem>)}
          </List>
          :
          <List>
            <ListItem sx={{ padding: "7px 10px", }}>
              <BaseEmpty />
            </ListItem>
          </List>
      }
    </Box>
  )
}

export default ProxyList;