import { alpha, PaperProps, Theme } from '@mui/material';

const getPaperStyling = (theme: Theme) => ({
    borderRadius: '8px',
    boxShadow: `4px 4px 8px ${alpha(theme.palette.primary.light, 0.5)}`,
    border: `1px solid ${theme.palette.grey[50]}`,
});

const paperProps: Partial<PaperProps> = {
    sx: (theme) => getPaperStyling(theme),
};

export const components: Theme['components'] = {
    MuiPaper: {
        defaultProps: {
            elevation: 0,
        },
    },
    MuiPopover: {
        defaultProps: {
            PaperProps: paperProps,
        },
        styleOverrides: {
            paper: ({ theme }) => getPaperStyling(theme as Theme),
        },
    },
    MuiMenu: {
        defaultProps: {
            PaperProps: paperProps,
        },
    },
    MuiSkeleton: {
        defaultProps: {
            sx: (theme) => ({
                background: theme.palette.grey['50'],
            }),
        },
    },
    MuiIconButton: {
        defaultProps: {
            disableRipple: true,
        },
        styleOverrides: {
            root: ({ theme }) => ({
                color: theme.palette.primary.main,
                '&:hover': {
                    background: 'none',
                    '& > svg': {
                        color: theme.palette.grey[900],
                    },
                },
            }),
        },
    },
    MuiBackdrop: {
        defaultProps: {
            sx: (theme) => ({
                background: alpha(theme.palette.grey[900], 0.45),
                backdropFilter: 'blur(1px)',
            }),
        },
    },
};
