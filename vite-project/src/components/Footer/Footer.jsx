import { Box, Typography, IconButton } from "@mui/material"
import { Instagram, Twitter, LinkedIn, YouTube, Facebook } from "@mui/icons-material"
import styles from "./Footer.module.css"

const Footer = () => {
  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.footerContent}>
        <Typography className={styles.copyright}>All rights reserved©</Typography>
        <Typography className={styles.email}>supportmail@ietdavv.edu.in</Typography>
        <Typography className={styles.managed}>Managed by Placement CELL IET</Typography>
        <Box className={styles.socialIcons}>
          <IconButton className={styles.socialIcon} title="Instagram" href="#">
            <Instagram className={styles.socialIconSvg} />
          </IconButton>
          <IconButton className={styles.socialIcon} title="Twitter" href="#">
            <Twitter className={styles.socialIconSvg} />
          </IconButton>
          <IconButton className={styles.socialIcon} title="LinkedIn" href="#">
            <LinkedIn className={styles.socialIconSvg} />
          </IconButton>
          <IconButton className={styles.socialIcon} title="YouTube" href="#">
            <YouTube className={styles.socialIconSvg} />
          </IconButton>
          <IconButton className={styles.socialIcon} title="Facebook" href="#">
            <Facebook className={styles.socialIconSvg} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer
