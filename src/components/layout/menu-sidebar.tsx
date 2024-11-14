import { alpha, List, ListItem, ListItemButton, ListItemText } from '@mui/material'

interface Props {
  menus: MenuSidebarItem[],
  current: string,
  onSelected: (index: string) => void
}

interface MenuSidebarItem {
  label: string
  index: string
}

export default function MenuSidebar(props: Props) {
  const { menus, current, onSelected } = props
  return (
    <List className="menubar">
      {menus.map((item, index) => (
        <ListItem key={index} sx={{ py: 0.5, maxWidth: 250, mx: "auto", padding: "4px 0px" }}>
          <ListItemButton
              sx={[
                {
                  borderRadius: 2,
                  marginLeft: 1.25,
                  paddingLeft: 1,
                  paddingRight: 1,
                  marginRight: 1.25,
                  "& .MuiListItemText-primary": {
                    color: "text.primary",
                    fontWeight: "500",
                  },
                },
                ({ palette: { mode, primary } }) => {
                  const bgcolor =
                    mode === "light"
                      ? alpha(primary.main, 0.15)
                      : alpha(primary.main, 0.35);
                  const color = mode === "light" ? "#1f1f1f" : "#ffffff";
      
                  return {
                    "&.Mui-selected": { bgcolor },
                    "&.Mui-selected:hover": { bgcolor },
                    "&.Mui-selected .MuiListItemText-primary": { color },
                  };
                },
              ]}
            selected={item.index == current}
            onClick={() => onSelected(item.index)}>
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
  )
}