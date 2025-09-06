import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from "@mui/material"
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import styles from "./Header.module.css"

const Header = ({ onMenuClick }) => {
  return (
    <AppBar position="static" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.leftSection}>
          <Avatar src="logo.png" alt="DAVV Logo" className={styles.logoImg} />
          <Box className={styles.titleSection}>
            <Typography variant="h6" className={styles.title}>
              Institute Of Engineering and Technology
            </Typography>
          </Box>
        </Box>

        <Box className={styles.rightSection}>
          <IconButton className={styles.iconButton} title="Search">
            <SearchIcon className={styles.icon} />
          </IconButton>

          <IconButton className={styles.iconButton} title="Notifications">
            <NotificationsIcon className={styles.icon} />
          </IconButton>

          <IconButton className={styles.iconButton} title="Profile">
            <PersonIcon className={styles.icon} />
          </IconButton>

          <IconButton onClick={onMenuClick} className={styles.menuButton} title="Menu">
            <MenuIcon className={styles.icon} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
