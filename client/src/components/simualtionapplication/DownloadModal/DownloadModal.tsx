import React from 'react';
import useOpenModal from 'hooks/useModalOpen';
import Button from 'components/common/Button';
import WindModal from 'components/common/Modal/WindModal';
import tempQR from 'assets/images/temp_qr.png';
import { DownloadModalWrapper } from './style';

const modalContent = (
	<div className="flex flex-column-reverse flex-wrap items-center">
		<p>QR코드를 스캔하여 어플을 다운받아보세요!</p>
		<img src={tempQR} alt="큐알이에요" style={{ width: '70%', marginBottom: '20px' }} />
	</div>
);
function OpenModal() {
	const { isOpenModal, clickModal, closeModal } = useOpenModal();

	return (
		<>
			<DownloadModalWrapper>
				<Button text="앱 다운로드" handleClick={() => clickModal()} />
			</DownloadModalWrapper>
			<WindModal open={isOpenModal} handleClose={closeModal} title="소행성 어플" content={modalContent} />
		</>
	);
}

export default OpenModal;