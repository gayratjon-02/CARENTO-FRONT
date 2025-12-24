import React, { useCallback, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
	Avatar,
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

	const ink = '#0b1f3b';
	const subtle = '#5a6175';
	const primary = '#2f46f2';
	const accent = '#1fd39d';

	const inputStyle = {
		'& .MuiOutlinedInput-root': {
			background: '#fff',
			borderRadius: 12,
			borderColor: 'rgba(27,31,59,0.14)',
			boxShadow: '0 10px 28px rgba(9, 18, 43, 0.06)',
		},
	};

	const heroImage = '/img/cars/hero-car.jpg';
	const heroAvatars = ['/img/profile/agent.png', '/img/profile/girl.svg', '/img/profile/defaultUser.svg'];

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: 'radial-gradient(circle at 20% 20%, rgba(79,70,229,0.06), transparent 28%), #eef2f7',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				px: { xs: 1.5, sm: 3 },
				py: { xs: 1.5, md: 2.5 },
				mt: { xs: 0, md: -10 },
				position: 'relative',
				zIndex: 2,
			}}
		>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				sx={{
					width: '100%',
					maxWidth: 1180,
					bgcolor: '#fff',
					borderRadius: 24,
					overflow: 'hidden',
					boxShadow: '0 22px 60px rgba(7, 19, 44, 0.12)',
					border: '1px solid rgba(10,25,51,0.06)',
				}}
			>
				<Box
					sx={{
						position: 'relative',
						flex: 1,
						minHeight: 420,
						bgcolor: '#3346e6',
						color: '#fff',
						p: { xs: 3, md: 4 },
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderTopLeftRadius: { xs: 18, md: 24 },
						borderBottomLeftRadius: { xs: 0, md: 24 },
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							backgroundImage:
								'radial-gradient(circle at 12% 22%, rgba(255,255,255,0.08) 0 22%, transparent 26%), radial-gradient(circle at 88% 82%, rgba(255,255,255,0.08) 0 22%, transparent 26%)',
						}}
					/>
					<Stack
						spacing={2}
						alignItems="flex-start"
						sx={{ position: 'relative', zIndex: 1, maxWidth: 420, width: '100%', textAlign: 'left' }}
					>
						<Box
							component="img"
							src={heroImage}
							alt="Car illustration"
							sx={{
								width: '100%',
								maxWidth: 360,
								objectFit: 'cover',
								borderRadius: 12,
								filter: 'drop-shadow(0 18px 50px rgba(0,0,0,0.25))',
							}}
						/>
						<Typography sx={{ fontWeight: 800, fontSize: 22 }}>
							Smooth sign-up, premium drives.
						</Typography>
						<Typography sx={{ opacity: 0.92, maxWidth: 420 }}>
							Join Carento to unlock premium rides, verified hosts, and concierge support — all from a single account.
						</Typography>
						<Stack direction="row" spacing={1} alignItems="center">
							{heroAvatars.map((src, idx) => (
								<Avatar
									// eslint-disable-next-line react/no-array-index-key
									key={idx}
									src={src}
									sx={{
										width: 36,
										height: 36,
										border: '2px solid rgba(255,255,255,0.8)',
										boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
										ml: idx === 0 ? 0 : -1,
									}}
								/>
							))}
							<Box sx={{ ml: 1 }}>
								<Typography sx={{ fontWeight: 700 }}>Trusted hosts</Typography>
								<Typography sx={{ fontSize: 13, opacity: 0.85 }}>4.8/5 average rating</Typography>
							</Box>
						</Stack>
					</Stack>
					<Box
						sx={{
							position: 'absolute',
							top: 16,
							right: 16,
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 10px)',
							gap: '8px',
							opacity: 0.35,
						}}
					>
						{Array.from({ length: 21 }).map((_, idx) => (
							<Box
								// eslint-disable-next-line react/no-array-index-key
								key={idx}
								sx={{
									width: 10,
									height: 10,
									borderRadius: '50%',
									border: '1.4px solid rgba(255,255,255,0.7)',
								}}
							/>
						))}
					</Box>
				</Box>

				<Box
					sx={{
						flex: 1,
						p: { xs: 3, md: 4 },
						bgcolor: '#fff',
						borderTopRightRadius: { xs: 18, md: 24 },
						borderBottomRightRadius: { xs: 18, md: 24 },
					}}
				>
					<Stack spacing={2.4} sx={{ maxWidth: 460, mx: 'auto' }}>
						<Stack direction="row" alignItems="center" justifyContent="space-between">
							<Box>
								<Typography sx={{ fontWeight: 900, fontSize: 26, color: ink }}>
									{loginView ? 'Welcome back' : 'Create your account'}
								</Typography>
								<Typography sx={{ color: subtle, mt: 0.6 }}>
									{loginView ? 'Sign in to keep your trips in sync.' : 'Let’s get started with a quick setup.'}
								</Typography>
							</Box>
							<ToggleButtonGroup
								value={loginView ? 'signin' : 'signup'}
								exclusive
								onChange={(_, val) => val && setLoginView(val === 'signin')}
								size="small"
								sx={{
									'& .MuiToggleButton-root': {
										borderRadius: 999,
										textTransform: 'none',
										px: 1.8,
										py: 0.6,
										border: 'none',
									},
									'& .Mui-selected': {
										backgroundColor: 'rgba(31,211,157,0.18) !important',
										color: '#0b422b',
									},
								}}
							>
								<ToggleButton value="signin">Sign in</ToggleButton>
								<ToggleButton value="signup">Sign up</ToggleButton>
							</ToggleButtonGroup>
						</Stack>

						<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
							<Button
								fullWidth
								variant="outlined"
								startIcon={<GoogleIcon />}
								sx={{
									borderRadius: 12,
									textTransform: 'none',
									fontWeight: 700,
									borderColor: 'rgba(0,0,0,0.12)',
									color: '#0f172a',
								}}
							>
								Continue with Google
							</Button>
							<Button
								fullWidth
								variant="outlined"
								startIcon={<AppleIcon />}
								sx={{
									borderRadius: 12,
									textTransform: 'none',
									fontWeight: 700,
									borderColor: 'rgba(0,0,0,0.12)',
									color: '#0f172a',
								}}
							>
								Continue with Apple
							</Button>
						</Stack>

						<Divider>or</Divider>

						<Stack spacing={1.6}>
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
								placeholder="min 8 chars"
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
							{isSignup && (
								<Box
									sx={{
										background: 'linear-gradient(180deg, #fbfcff, #f7f9fc)',
										borderRadius: 40,
										p: { xs: 1.6, md: 1.8 },
										border: '1px solid rgba(15,23,42,0.08)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: 2,
									}}
								>
									<Typography sx={{ fontWeight: 900, color: ink }}>Register as</Typography>
									<ToggleButtonGroup
										value={input.type}
										exclusive
										onChange={(e, val) => val && handleInput('type', val)}
										size="small"
										sx={{
											bgcolor: '#fff',
											borderRadius: 999,
											border: '1px solid rgba(15,23,42,0.12)',
											'& .MuiToggleButton-root': {
												border: 'none',
												textTransform: 'none',
												fontWeight: 700,
												px: 2.8,
												py: 0.6,
												borderRadius: 999,
												color: '#0f172a',
											},
											'& .Mui-selected': {
												backgroundColor: '#d6f4e9 !important',
												color: '#0b422b',
											},
										}}
									>
										<ToggleButton value="USER">User</ToggleButton>
										<ToggleButton value="AGENT">Dealer</ToggleButton>
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
						</Stack>

						<Button
							variant="contained"
							fullWidth
							size="large"
							sx={{
								borderRadius: 12,
								py: 1.1,
								fontWeight: 800,
								letterSpacing: 0.2,
								background: `linear-gradient(120deg, ${accent}, ${primary})`,
								color: '#fff',
								boxShadow: '0 12px 32px rgba(47,70,242,0.35)',
								textTransform: 'none',
							}}
							endIcon={<ArrowForwardIcon />}
							onClick={loginView ? doLogin : doSignUp}
							disabled={
								input.nick === '' || input.password === '' || (isSignup && (input.phone === '' || input.type === ''))
							}
						>
							{loginView ? 'Sign in' : 'Sign up'}
						</Button>

						<Stack direction="row" spacing={1} justifyContent="center" sx={{ color: subtle }}>
							<Typography>{loginView ? "Don't have an account?" : 'Already have an account?'}</Typography>
							<Button
								size="small"
								variant="text"
								sx={{ color: ink, textTransform: 'none', fontWeight: 800 }}
								onClick={() => setLoginView(!loginView)}
							>
								{loginView ? 'Register' : 'Login'}
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Box>
	);
};

export default withLayoutBasic(Join);
