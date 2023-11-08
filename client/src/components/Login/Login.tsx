import React, { useState } from 'react';
import { Input, Button, Dialog, Card, CardBody, Typography, Alert } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userEmail } from '../../store/RecoilState';
import api from '../../api';

function Login() {
	const navigate = useNavigate();

	// 로그인
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [loginFailed, setLoginFailed] = useState(false);

	const setUserMail = useSetRecoilState(userEmail);

	const isEmailValid = (inputEmail: string) => {
		const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		return regex.test(inputEmail);
	};

	const isPasswordValid = (inputPassword: string) => {
		return inputPassword.length >= 8;
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target; // Object destructuring
		setEmail(value);
		if (!isEmailValid(value)) {
			setEmailError('이메일 형식으로 입력해주세요');
		} else {
			setEmailError('');
		}
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target; // Object destructuring
		setPassword(value);
		if (!isPasswordValid(value)) {
			setPasswordError('비밀번호는 8자 이상');
		} else {
			setPasswordError('');
		}
	};

	const isFormValid = () => {
		return isEmailValid(email) && isPasswordValid(password) && !emailError && !passwordError;
	};

	const handleLogin = async () => {
		try {
			const loginResponse = await api.post('/member/login', {
				memberEmail: email,
				memberPassword: password,
			});
			await api.post('member/command', {
				memberEmail: email,
				memberCommand: 'ready',
			});
			console.log(loginResponse);
			setLoginFailed(false);
			console.log(email);
			setUserMail(email);
			navigate('/main');
		} catch (error) {
			console.log('api 요청 실패', error);
			setLoginFailed(true);
		}
	};

	// 비밀번호 재설정
	const [open, setOpen] = useState(false);
	const [emailResetPW, setEmailResetPW] = useState('');
	const [authCode, setAuthCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	// 모달 열고 닫기
	const handleOpen = () => setOpen((cur) => !cur);

	// 이메일 입력 후 인증번호 입력 칸
	const [codeOpen, setCodeOpen] = useState(false);
	const handleEmailResetPWChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target; // Object destructuring
		setEmailResetPW(value);
	};
	const [notFound, setNotFound] = useState(false);
	const handleCodeOpen = async () => {
		try {
			await api.post('/member/authCode', { emailAddress: emailResetPW, status: 2 });
			setAuthCode('');
			setCodeOpen(true);
			setNotFound(false);
		} catch (e) {
			setNotFound(true);
		}
	};

	// 인증번호 입력 후 비밀번호 입력 칸
	const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setAuthCode(value);
	};
	const [pwOpen, setPWOpen] = useState(false);
	const [notVerified, setNotVerified] = useState(false);
	const handlePWOpen = async () => {
		try {
			await api.post('/member/verify', { emailAddress: emailResetPW, authCode });
			setNotVerified(false);
			setPWOpen(true);
			setCodeOpen(false);
		} catch (e) {
			setNotVerified(true);
		}
	};

	// 새로운 비밀번호 입력
	const [isEqual, setIsEqual] = useState(true);
	const [isValid, setIsValid] = useState(true);
	const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setNewPassword(value);
	};
	const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setPasswordConfirm(value);
	};
	const changePassword = async () => {
		setIsEqual(true);
		setIsValid(true);
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
		if (newPassword === passwordConfirm && newPassword.match(passwordRegex)) {
			try {
				await api.post('/member/changePassword', {
					emailAddress: emailResetPW,
					memberPassword: newPassword,
				});
				setEmailResetPW('');
				setAuthCode('');
				setNewPassword('');
				setPasswordConfirm('');
				setPWOpen(false);
				setOpen(false);
			} catch (e) {
				console.log(e);
			}
		} else if (newPassword !== passwordConfirm) {
			setIsEqual(false);
		} else {
			setIsValid(false);
		}
	};

	return (
		<div className="w-10/12">
			<Input
				type="email"
				label="이메일"
				value={email}
				onChange={handleEmailChange}
				containerProps={{
					className: 'm-2',
				}}
				crossOrigin=""
			/>
			{emailError && <p className="text-red-500 text-xs ml-2 mb-3">{emailError}</p>}
			<Input
				type="password"
				label="비밀번호"
				value={password}
				onChange={handlePasswordChange}
				containerProps={{
					className: 'm-2',
				}}
				crossOrigin=""
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						handleLogin();
					}
				}}
			/>
			{passwordError && <p className="text-red-500 text-xs ml-2">{passwordError}</p>}
			<Alert className="p-2 m-3" open={loginFailed} variant="outlined" color="red">
				로그인 실패
			</Alert>
			<Button className="p-3 m-3" disabled={!isFormValid()} onClick={handleLogin}>
				로그인
			</Button>
			<Button className="p-3 m-3" onClick={handleOpen}>
				비밀번호 찾기
			</Button>
			<Dialog size="xs" open={open} handler={handleOpen} className="bg-transparent shadow-none">
				<Card className="mx-auto w-full max-w-[24rem]">
					<CardBody className="flex flex-col gap-4">
						<Typography variant="h4" color="blue-gray">
							비밀번호 재설정
						</Typography>
						<Typography className="mb-3 font-normal" variant="paragraph" color="gray">
							메일 인증 완료 후, 비밀번호를 재설정하세요.
						</Typography>

						<div className="flex flex-row">
							<Input
								type="text"
								size="lg"
								label="이메일"
								crossOrigin=""
								value={emailResetPW}
								onChange={handleEmailResetPWChange}
							/>
							<Button className="w-3/12 ml-2" onClick={handleCodeOpen}>
								발송
							</Button>
						</div>

						<Alert variant="outlined" color="red" open={notFound} onClose={() => setNotFound(false)}>
							가입된 메일이 아닙니다.
						</Alert>
						{codeOpen && (
							<div className="flex flex-row">
								<Input
									type="text"
									size="lg"
									label="인증번호"
									value={authCode}
									onChange={handleAuthCodeChange}
									crossOrigin=""
								/>
								<Button className="w-3/12 ml-2" onClick={handlePWOpen}>
									인증
								</Button>
							</div>
						)}
						<Alert variant="outlined" color="red" open={notVerified} onClose={() => setNotVerified(false)}>
							인증번호를 다시 입력해주세요.
						</Alert>
						{pwOpen && (
							<>
								<Input
									type="password"
									size="lg"
									label="비밀번호"
									value={newPassword}
									onChange={handleNewPasswordChange}
									crossOrigin=""
								/>
								<Input
									type="password"
									size="lg"
									label="비밀번호 확인"
									value={passwordConfirm}
									onChange={handlePasswordConfirmChange}
									crossOrigin=""
								/>
								<Button onClick={changePassword}>비밀번호 수정</Button>
							</>
						)}
						<Alert variant="outlined" color="red" open={!isEqual} onClose={() => setIsEqual(true)}>
							비밀번호가 일치하지 않습니다.
						</Alert>
						<Alert variant="outlined" color="red" open={!isValid} onClose={() => setIsValid(true)}>
							비밀번호는 8자 이상이면서 숫자와 영어와 특수문자를 모두 포함해야 합니다
						</Alert>
					</CardBody>
				</Card>
			</Dialog>
		</div>
	);
}

export default Login;
