import styled from 'styled-components';
import background from 'assets/images/background.png';

export const Scene2Wrapper = styled.div`
	.background-image {
		background-image: url(${background});
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		width: 100%;
		height: 100vh;
	}
`;