// src/app/(auth)/register/page.tsx
'use client'

import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register as registerApi } from '@/lib/api';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerApi(username, email, password);
      setMessage(data.message);
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h3" sx={{ color: 'primary.main' }}>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: 'primary.main', color: 'background.paper' }}
          >
            Register
          </Button>
          {message && <Alert severity={message.includes('success') ? 'success' : 'error'}>{message}</Alert>}
          <Box sx={{ mt: 2 }}>
            <Link href="/login" style={{ color: 'primary.main' }}>
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}