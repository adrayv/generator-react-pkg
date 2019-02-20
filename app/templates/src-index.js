import React from 'react';
import styled from 'styled-components'

const Block = styled.div`
	background: red;
`

const MyComponent = () => (
	<Block>
    	<p>Hello {'<%= packageName %>'}!</p>
	</Block>
);

export default MyComponent;