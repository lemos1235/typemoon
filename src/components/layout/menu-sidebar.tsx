import {
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface Props {
  menus: MenuSidebarItem[];
  current: string;
  onSelected: (index: string) => void;
}

interface MenuSidebarItem {
  label: string;
  index: string;
}

export default function MenuSidebar(props: Props) {
  const { menus, current, onSelected } = props;
  return (
    <List
      sx={({ palette: { mode } }) => ({
        background: mode === "dark" ? "#1B1B1B" : "#fafafa",
      })}
      className="menubar"
    >
      {menus.map((item, index) => (
        <ListItem
          key={index}
          sx={{ py: 0.5, maxWidth: 250, mx: "auto", padding: "4px 0px" }}
        >
          <ListItemButton
            sx={[
              {
                borderRadius: 2,
                marginLeft: 1.25,
                paddingLeft: 1,
                paddingRight: 1,
                marginRight: 1.25,
              },
              ({ palette: { mode, primary, text } }) => {
                const selectedBgcolor =
                  mode === "dark"
                    ? alpha(primary.main, 0.35)
                    : alpha(primary.main, 0.15);
                const selectedColor = text.primary;
                const color =
                  mode === "dark" ? alpha(text.primary, 0.7) : text.primary;

                return {
                  "&.Mui-selected": { bgcolor: selectedBgcolor },
                  "&.Mui-selected:hover": { bgcolor: selectedBgcolor },
                  "&.Mui-selected .MuiListItemText-primary": {
                    color: selectedColor,
                  },
                  "& .MuiListItemText-primary": {
                    color: color,
                    fontWeight: "500",
                  },
                };
              },
            ]}
            selected={item.index == current}
            onClick={() => onSelected(item.index)}
          >
            <ListItemText
              sx={{
                textAlign: "center",
              }}
              primary={item.label}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
