import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        background: ${({ theme }) => theme.colors.body};
        color: ${({ theme }) => theme.colors.text};
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
        transition: all 0.50s linear;
    }

    .ui.menu .item {
        color: ${({ theme }) => theme.colors.text};
    }
    
    .ui.secondary.menu .item:hover {
        color: ${({ theme }) => theme.colors.toggleBorder} !important;
        background: none !important;
        font-weight: bold !important;
    }

    .ui.menu .item.active {
        color: ${({ theme }) => theme.colors.background};
        background: none !important;
    }
    
    .ui.secondary.menu .active.item {
        background: none !important;
        color: ${({ theme }) => theme.colors.background};
        font-weight: bold;
    } 

    .titlebar {
        background-color: ${({ theme }) => theme.colors.body} !important;
    }

    h2.page-header {
        color: ${({ theme }) => theme.colors.text};
    }

    .secondary-header {
        color: ${({ theme }) => theme.colors.background};
    }

    .ui.segment {
        color: ${({ theme }) => theme.colors.background};
    }
`;

export default GlobalStyle;