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
    <Box sx={{ height: "calc(100% - 44px)" }}>
      {nodeList.length > 0 ?
        <Virtuoso
          data={nodeList}
          totalCount={nodeList.length}
          itemContent={(index, node) => <Box sx={{ padding: "7px 10px" }}><ProxyItem current={current} node={node} /></Box>}
        />
        :
        <BaseEmpty />}
    </Box>
  )
}

export default ProxyList;