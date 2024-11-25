import { Box, List, ListItem } from "@mui/material";
import { BaseEmpty } from "../base";
import RuleItem from "./rule-item";

interface Props {
  ruleList: IMoonRule[];
}

const RuleList = (props: Props) => {
  const { ruleList } = props;
  return (
    <Box sx={{ overflowY: "auto" }}>
      {ruleList.length > 0 ? (
        <List disablePadding>
          {ruleList.map((rule, index) => (
            <ListItem key={index} sx={{ padding: "7px 10px" }}>
              <RuleItem rule={rule} />
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

export default RuleList;
