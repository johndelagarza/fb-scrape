import React from 'react';
import styled from 'styled-components';
import { colors } from './global';

const semantic = require('semantic-ui-react');

const StyledHeader = styled(semantic.Header)`
    margin-top: ${({margin}) => margin || '15px'} !important;
    color: ${colors.jet} !important;
`;

export const Header = ({margin, children}) => {
    return <StyledHeader margin={margin}>{children}</StyledHeader>;
};

