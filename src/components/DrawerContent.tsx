// src/components/DrawerContent.tsx
'use client'

import { useState, useEffect } from 'react';
import { Box, IconButton, List, ListItemButton, ListItemText, Typography, Collapse } from "@mui/material";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import GithubIcon from '@mui/icons-material/GitHub';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { getAllPersonas } from '@/lib/api';

const menuItems = [
  { number: '01', text: 'home', path: '/', isNew: false },
  { number: '02', text: 'personas', path: '/dashboard', isNew: false },
  { number: '03', text: 'about', path: '/about', isNew: false },
  { number: '04', text: 'contact', path: '/contact', isNew: false },
  { number: '05', text: 'topics', path: '/topics', isNew: false },
];

interface Persona {
  _id: string;
  name: string;
}

function DrawerContent({ handleDrawerToggle }: { handleDrawerToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPersonasExpanded, setIsPersonasExpanded] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const fetchedPersonas = await getAllPersonas();
        const sortedPersonas = fetchedPersonas.sort((a: Persona, b: Persona) => a.name.localeCompare(b.name));
        setPersonas(sortedPersonas);
      } catch (error) {
        console.error('Error fetching personas:', error);
      }
    };

    fetchPersonas();
  }, []);

  useEffect(() => {
    if (pathname === '/dashboard' || pathname.startsWith('/chat/')) {
      setIsPersonasExpanded(true);
    } else {
      setIsPersonasExpanded(false);
    }
  }, [pathname]);

  const handlePersonasClick = () => {
    if (pathname === '/dashboard') {
      setIsPersonasExpanded(!isPersonasExpanded);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
    }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
        </IconButton>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;

          if (item.text === 'personas') {
            return (
              <Box key={index}>
                <ListItemButton
                  onClick={handlePersonasClick}
                  sx={{
                    py: 2,
                    position: 'relative',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '50%',
                      backgroundColor: 'primary.main',
                    } : {},
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="h3" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: isActive ? 'primary.main' : 'inherit',
                      }}>
                        <span style={{ fontSize: '1.75rem', marginRight: '1rem', color: '#bf9f45' }}>{item.number}</span>
                        {item.text}
                      </Typography>
                    }
                  />
                  {isPersonasExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={isPersonasExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {personas.map((persona) => {
                      const isPersonaActive = pathname === `/chat/${persona._id}`;
                      return (
                        <ListItemButton
                          key={persona._id}
                          component={Link}
                          href={`/chat/${persona._id}`}
                          sx={{
                            pl: 4,
                            py: 1,
                            '&::before': isPersonaActive ? {
                              content: '""',
                              position: 'absolute',
                              left: 0,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '4px',
                              height: '50%',
                              backgroundColor: 'primary.main',
                            } : {},
                            color: isPersonaActive ? 'primary.main' : 'inherit',
                          }}
                        >
                          <ListItemText primary={persona.name} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItemButton
              key={index}
              component={Link}
              href={item.path}
              sx={{
                py: 2,
                position: 'relative',
                '&::before': isActive ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '50%',
                  backgroundColor: 'primary.main',
                } : {},
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h3" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: isActive ? 'primary.main' : 'inherit',
                  }}>
                    <span style={{ fontSize: '1.75rem', marginRight: '1rem', color: '#bf9f45' }}>{item.number}</span>
                    {item.text}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>FOLLOW HISTORY</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <a href="https://github.com/eldehan/antiquitas/tree/main" target="_blank" rel="noopener noreferrer">
            <GithubIcon />
          </a>
        </Box>
      </Box>
    </Box>
  );
}

export default DrawerContent;