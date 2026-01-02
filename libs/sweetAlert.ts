import Swal from 'sweetalert2';
import 'animate.css';
import { Messages } from './config';

const primaryAccent = '#6d28d9';
const softGlow = '#22d3ee';
const dangerAccent = '#ef4444';
const baseBackdrop = 'rgba(15, 23, 42, 0.45)';
const baseBackground =
	'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(241,245,255,0.94))';
const baseShowClass = { popup: 'animate__animated animate__fadeInUp animate__faster' };
const baseHideClass = { popup: 'animate__animated animate__fadeOutDown animate__faster' };

const applyVividStyles = (
	popup: HTMLElement | null,
	accent: string = primaryAccent,
	glow: string = softGlow,
	shadow: string = 'rgba(109, 40, 217, 0.28)',
) => {
	if (!popup) return;

	popup.style.background = baseBackground;
	popup.style.borderRadius = '18px';
	popup.style.border = '1px solid rgba(255,255,255,0.55)';
	popup.style.backdropFilter = 'blur(14px)';
	popup.style.boxShadow = '0 22px 60px rgba(15, 23, 42, 0.25)';
	popup.style.padding = '28px 24px';
	popup.style.transformOrigin = 'center';
	popup.style.transition = 'transform 180ms ease, box-shadow 180ms ease';

	const icon = popup.querySelector('.swal2-icon') as HTMLElement | null;
	if (icon) {
		icon.style.borderColor = accent;
		icon.style.color = accent;
		icon.style.boxShadow = `0 12px 30px ${shadow}`;
	}

	const title = popup.querySelector('#swal2-title') as HTMLElement | null;
	if (title) {
		title.style.fontWeight = '800';
		title.style.letterSpacing = '0.2px';
		title.style.color = '#0f172a';
	}

	const text = popup.querySelector('.swal2-html-container') as HTMLElement | null;
	if (text) {
		text.style.color = '#111827';
		text.style.fontSize = '15px';
		text.style.lineHeight = '1.5';
	}

	const confirmButton = popup.querySelector('.swal2-confirm') as HTMLButtonElement | null;
	if (confirmButton) {
		confirmButton.style.background = `linear-gradient(135deg, ${accent}, ${glow})`;
		confirmButton.style.border = 'none';
		confirmButton.style.padding = '12px 20px';
		confirmButton.style.borderRadius = '12px';
		confirmButton.style.fontWeight = '700';
		confirmButton.style.boxShadow = `0 14px 32px ${shadow}`;
	}

	const cancelButton = popup.querySelector('.swal2-cancel') as HTMLButtonElement | null;
	if (cancelButton) {
		cancelButton.style.background = 'rgba(15, 23, 42, 0.06)';
		cancelButton.style.border = '1px solid rgba(15, 23, 42, 0.12)';
		cancelButton.style.padding = '12px 18px';
		cancelButton.style.borderRadius = '12px';
		cancelButton.style.fontWeight = '700';
		cancelButton.style.color = '#0f172a';
	}

	const timerBar = popup.querySelector('.swal2-timer-progress-bar') as HTMLElement | null;
	if (timerBar) {
		timerBar.style.background = glow;
	}
};

export const sweetErrorHandling = async (err: any) => {
	const message = err?.message ?? Messages.error1;
	await Swal.fire({
		allowOutsideClick: true,
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: baseShowClass,
		hideClass: baseHideClass,
		icon: 'error',
		iconColor: dangerAccent,
		title: 'Oops, something went wrong',
		text: message,
		showConfirmButton: false,
		didOpen: (popup) => applyVividStyles(popup, dangerAccent, '#fb7185', 'rgba(244,63,94,0.3)'),
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: baseShowClass,
		hideClass: baseHideClass,
		position: 'center',
		icon: 'success',
		iconColor: softGlow,
		title: msg.replace('Definer: ', ''),
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		didOpen: (popup) => applyVividStyles(popup),
	});
};

export const sweetContactAlert = async (msg: string, duration: number = 10000) => {
	await Swal.fire({
		title: msg,
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: {
			popup: 'animate__animated animate__fadeInDown animate__faster',
		},
		hideClass: baseHideClass,
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		didOpen: (popup) => applyVividStyles(popup),
	}).then();
};

export const sweetConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await Swal.fire({
			background: baseBackground,
			backdrop: baseBackdrop,
			showClass: baseShowClass,
			hideClass: baseHideClass,
			icon: 'question',
			text: msg,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonColor: primaryAccent,
			cancelButtonColor: '#bdbdbd',
			didOpen: (popup) => applyVividStyles(popup),
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetLoginConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await Swal.fire({
			background: baseBackground,
			backdrop: baseBackdrop,
			showClass: baseShowClass,
			hideClass: baseHideClass,
			text: msg,
			showCancelButton: true,
			showConfirmButton: true,
			color: '#212121',
			iconColor: primaryAccent,
			confirmButtonColor: primaryAccent,
			cancelButtonColor: '#bdbdbd',
			confirmButtonText: 'Login',
			didOpen: (popup) => applyVividStyles(popup),
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	await Swal.fire({
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: baseShowClass,
		hideClass: baseHideClass,
		icon: 'error',
		iconColor: dangerAccent,
		title: msg,
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		didOpen: (popup) => applyVividStyles(popup, dangerAccent, '#fb7185', 'rgba(244,63,94,0.3)'),
	});
};

export const sweetMixinErrorAlert = async (msg: string, duration: number = 3000) => {
	await Swal.fire({
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: baseShowClass,
		hideClass: baseHideClass,
		icon: 'error',
		iconColor: dangerAccent,
		title: msg,
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		didOpen: (popup) => applyVividStyles(popup, dangerAccent, '#fb7185', 'rgba(244,63,94,0.3)'),
	});
};

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: baseShowClass,
		hideClass: baseHideClass,
		icon: 'success',
		iconColor: softGlow,
		title: msg,
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		didOpen: (popup) => applyVividStyles(popup),
	});
};

export const sweetBasicAlert = async (text: string) => {
	await Swal.fire({
		text,
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: baseShowClass,
		hideClass: baseHideClass,
		didOpen: (popup) => applyVividStyles(popup),
	});
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
	const errorMessage = err.message ?? Messages.error1;
	await Swal.fire({
		background: baseBackground,
		backdrop: baseBackdrop,
		showClass: baseShowClass,
		hideClass: baseHideClass,
		icon: 'error',
		iconColor: dangerAccent,
		text: errorMessage,
		showConfirmButton: false,
		didOpen: (popup) => applyVividStyles(popup, dangerAccent, '#fb7185', 'rgba(244,63,94,0.3)'),
	});
};

export const sweetTopSmallSuccessAlert = async (
	msg: string,
	duration: number = 2000,
	enable_forward: boolean = false,
) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		background: baseBackground,
		color: '#0f172a',
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		showClass: { popup: 'animate__animated animate__fadeInDown animate__faster' },
		hideClass: { popup: 'animate__animated animate__fadeOutUp animate__faster' },
		didOpen: (popup) => applyVividStyles(popup),
	});

	Toast.fire({
		icon: 'success',
		iconColor: softGlow,
		title: msg,
	}).then((data) => {
		if (enable_forward) {
			window.location.reload();
		}
	});
};
