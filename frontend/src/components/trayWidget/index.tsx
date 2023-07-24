import { FC, PropsWithChildren } from 'react';

export const TrayWidget: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div
            style={{
                minWidth: '200px',
                background: '#141414',
                flexGrow: 0,
                flexShrink: 0,
            }}
        >
            {children}
        </div>
    );
};
