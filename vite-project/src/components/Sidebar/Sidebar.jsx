import { useState } from "react"
import { useNavigate } from "react-router-dom" // Add this line
import { Drawer, List, ListItem, ListItemButton, ListItemText, Collapse, Box, Backdrop } from "@mui/material"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import styles from "./Sidebar.module.css"

const Sidebar = ({ open, onClose }) => {
  const [reportsExpanded, setReportsExpanded] = useState(false)
  const navigate = useNavigate() // Add this line

  const handleReportsToggle = () => {
    setReportsExpanded(!reportsExpanded)
  }

  const menuItems = ["Dashboard", "Manage Resumes", "Manage Jobs", "Add operator", "Manage Company"]
  const submenuItems = ["Dashboard", "Branch Statistics", "Company History", "Industry Analysis"]
  const otherMenuItems = ["Student search", "Chatroom", "Review & FeedBack", "Manage Prepare", "Photo Gallery"]

  return (
    <>
      <Backdrop open={open} onClick={onClose} className={styles.backdrop} />
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        className={styles.drawer}
        PaperProps={{
          className: styles.drawerPaper,
        }}
      >
        <Box className={styles.menuContainer}>
          <List className={styles.menuList}>
            {menuItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton className={styles.menuItem}>
                  <ListItemText primary={item} className={styles.menuText} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Reports and Analytics with submenu */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleReportsToggle} className={`${styles.menuItem} ${styles.hasSubmenu}`}>
                <ListItemText primary="Reports and Analytics" className={styles.menuText} />
                {reportsExpanded ? (
                  <ExpandLess className={styles.expandIcon} />
                ) : (
                  <ExpandMore className={styles.expandIcon} />
                )}
              </ListItemButton>
            </ListItem>

            <Collapse in={reportsExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className={styles.submenuContainer}>
                {submenuItems.map((item) => (
                  <ListItem key={item} disablePadding>
                    <ListItemButton
                      className={styles.submenuItem}
                      onClick={() => {
                        if (item === "Dashboard") {
                          window.open("/reports-dashboard", "_blank") // Open in new tab
                          onClose()
                        }
                      }}
                    >
                      <ListItemText primary={item} className={styles.submenuText} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            {otherMenuItems.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton className={styles.menuItem}>
                  <ListItemText primary={item} className={styles.menuText} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default Sidebar