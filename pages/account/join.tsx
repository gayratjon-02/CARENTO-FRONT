
import React, { useCallback, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const Join: NextPage = () => {
  const router = useRouter();
  const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
  const [loginView, setLoginView] = useState<boolean>(true);
  const isSignup = useMemo(() => !loginView, [loginView]);

  const handleInput = useCallback((name: any, value: any) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        loginView ? doLogin() : doSignUp();
      }
    },
    [loginView],
  );

  const doLogin = useCallback(async () => {
    try {
      await logIn(input.nick, input.password);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input, router]);

  const doSignUp = useCallback(async () => {
    try {
      await signUp(input.nick, input.password, input.phone, input.type);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input, router]);

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.9)',
      borderRadius: 12,
      borderColor: 'rgba(27,31,59,0.08)',
    },
  };

  const primary = '#39e57a';
  const accent = '#7dd3fc';
  const ink = '#0b1f3b';
  const subtle = '#5a6175';

  const formCard = (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.9))',
        border: '1px solid rgba(27,31,59,0.08)',
        borderRadius: 24,
        p: { xs: 3.5, md: 4.5 },
        boxShadow: '0 36px 90px rgba(7, 12, 24, 0.16)',
        backdropFilter: 'blur(8px)',
        minHeight: { xs: 560, md: 640 },
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1.2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center" sx={{
            borderRadius: 999,
            px: 1.6,
            py: 0.4,
            background: 'rgba(57,229,122,0.12)',
            border: '1px solid rgba(57,229,122,0.35)',
          }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: primary, boxShadow: '0 0 0 6px rgba(57,229,122,0.18)' }} />
            <Typography sx={{ fontWeight: 800, fontSize: 12, color: ink, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {loginView ? 'Sign in' : 'Register'}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.4, color: ink }}>
            {loginView ? 'Welcome back' : 'Create an Account'}
          </Typography>
          <Typography sx={{ color: subtle, textAlign: 'center' }}>
            {loginView
              ? 'Access your garage, favorites, and community in one place.'
              : 'Join to list, follow, and connect across the Carento community.'}
          </Typography>
        </Stack>

        <Stack spacing={2.2}>
          <TextField
            label="Email / Username"
            placeholder="Enter email or username"
            fullWidth
            value={input.nick}
            onChange={(e) => handleInput('nick', e.target.value)}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={inputStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: '#9aa1b5' }} />
                </InputAdornment>
              ),
            }}
          />

          {isSignup && (
            <TextField
              label="Phone"
              placeholder="Enter phone"
              fullWidth
              value={input.phone}
              onChange={(e) => handleInput('phone', e.target.value)}
              onKeyDown={handleKeyDown}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon sx={{ color: '#9aa1b5' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            label="Password"
            placeholder="Enter password"
            fullWidth
            type="password"
            value={input.password}
            onChange={(e) => handleInput('password', e.target.value)}
            onKeyDown={handleKeyDown}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            sx={inputStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#9aa1b5' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {isSignup && (
          <Box
            sx={{
              background: '#f7f9fd',
              borderRadius: 12,
              p: 1.6,
              border: '1px solid rgba(27,31,59,0.06)',
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 1, color: ink }}>Register as</Typography>
            <ToggleButtonGroup
              value={input.type}
              exclusive
              onChange={(e, val) => val && handleInput('type', val)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 10,
                  px: 2.4,
                  textTransform: 'none',
                  borderColor: 'rgba(27,31,59,0.1)',
                  color: ink,
                },
                '& .Mui-selected': {
                  backgroundColor: 'rgba(57,229,122,0.14) !important',
                  borderColor: 'rgba(57,229,122,0.5) !important',
                  color: '#0d3015',
                },
              }}
            >
              <ToggleButton value="USER">User</ToggleButton>
              <ToggleButton value="AGENT">Agent</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked size="small" />}
              label={<Typography sx={{ color: subtle, fontSize: 13 }}>Remember me</Typography>}
            />
          </FormGroup>
          <Button variant="text" sx={{ color: subtle, textTransform: 'none', fontSize: 13 }}>
            Forgot password?
          </Button>
        </Stack>

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            mt: 0.5,
            borderRadius: 14,
            py: 1.2,
            fontWeight: 800,
            letterSpacing: 0.2,
            background: `linear-gradient(120deg, ${primary}, ${accent})`,
            color: '#052312',
            boxShadow: '0 16px 44px rgba(57,229,122,0.35)',
            textTransform: 'none',
          }}
          endIcon={<ArrowForwardIcon />}
          onClick={loginView ? doLogin : doSignUp}
          disabled={
            input.nick === '' ||
            input.password === '' ||
            (isSignup && (input.phone === '' || input.type === ''))
          }
        >
          {loginView ? 'Sign in' : 'Sign up'}
        </Button>

        <Divider textAlign="center" sx={{ color: subtle }}>
          Or connect with your social account
        </Divider>

        <Stack direction="row" spacing={1.4} justifyContent="center" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              borderRadius: 12,
              textTransform: 'none',
              borderColor: 'rgba(27,31,59,0.12)',
              color: ink,
              px: 2.4,
              minWidth: 180,
              background: '#fff',
            }}
          >
            Sign in with Google
          </Button>
          <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            sx={{
              borderRadius: 12,
              textTransform: 'none',
              borderColor: 'rgba(27,31,59,0.12)',
              color: ink,
              px: 2.4,
              minWidth: 64,
              background: '#fff',
            }}
          />
          <Button
            variant="outlined"
            startIcon={<AppleIcon />}
            sx={{
              borderRadius: 12,
              textTransform: 'none',
              borderColor: 'rgba(27,31,59,0.12)',
              color: ink,
              px: 2.4,
              minWidth: 64,
              background: '#fff',
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="center" sx={{ color: subtle }}>
          <Typography>{loginView ? "Don't have an account?" : 'Already have an account?'}</Typography>
          <Button
            size="small"
            variant="text"
            sx={{ color: ink, textTransform: 'none', fontWeight: 800 }}
            onClick={() => setLoginView(!loginView)}
          >
            {loginView ? 'Register Here !' : 'Login Here !'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 18% 18%, rgba(57,229,122,0.08), transparent 28%), radial-gradient(circle at 82% 8%, rgba(125,211,252,0.08), transparent 24%), #ffffff',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        px: 2,
        pt: { xs: 4, md: 5 },
        pb: { xs: 6, md: 8 },
      }}
    >
      {formCard}
    </Box>
  );
};

export default withLayoutBasic(Join);
