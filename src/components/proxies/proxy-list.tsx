import { BaseEmpty } from "@/components/base";
import { Box, List, ListItem } from "@mui/material";
import ProxyItem from "./proxy-item";

interface Props {
  nodeList: IMoonProxy[];
}

const ProxyList = (props: Props) => {
  const { nodeList } = props;
  return (
    <Box sx={{ overflowY: "auto" }}>
      {nodeList.length > 0 ? (
        <List disablePadding>
          {nodeList.map((node, index) => (
            <ListItem key={index} sx={{ padding: "7px 10px" }}>
              <ProxyItem node={node} />
            </ListItem>
          ))}
        </List>
      ) : (
        <List disablePadding>
          <ListItem>
            <BaseEmpty />
          </ListItem>
        </List>
      )}
    </Box>
  );
};

export default ProxyList;
