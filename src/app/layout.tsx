// src/app/layout.tsx
'use client'

import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, Box, IconButton, Typography, Drawer, Menu, MenuItem, Button } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import theme from '@/theme/theme'
import DrawerContent from '@/components/DrawerContent'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const drawerWidth = 240

function ProfileMenu() {
  const { isAuthenticated, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const router = useRouter()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    router.push('/')
  }

  if (isAuthenticated) {
    return (
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          <AccountCircleIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose} component={Link} href="/profile">Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    )
  } else {
    return (
      <div>
        <Button color="inherit" component={Link} href="/login">Login</Button>
        <Button color="inherit" component={Link} href="/register">Register</Button>
      </div>
    )
  }
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Custom Header */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          noWrap
          component="div"
          sx={{
            fontFamily: "'Tulpen One', sans-serif",
            color: 'white',
          }}
        >
          Antiquitas Interactive
        </Typography>

        {/* Profile Menu */}
        <ProfileMenu />
      </Box>

      {/* Burger button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          zIndex: (theme) => theme.zIndex.drawer + 2,
          top: '16px',
          left: '16px',
          display: { sm: 'none' },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <DrawerContent handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <DrawerContent handleDrawerToggle={handleDrawerToggle} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, marginTop: '64px' }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Tulpen+One&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LayoutContent>{children}</LayoutContent>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}