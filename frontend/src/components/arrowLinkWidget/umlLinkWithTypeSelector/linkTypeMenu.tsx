import { Menu, MenuItem } from '@mui/material';
import {
    ARROW_LINK_TYPES,
    ArrowLinkModel,
} from '../../../utils/arrowLink/arrowLinkModel';
import React, { FC } from 'react';
import { PointModel } from '@projectstorm/react-diagrams';

type Props = {
    link: ArrowLinkModel;
    point: PointModel;
    menuOpen: boolean;
    setMenuOpen: (menuOpen: boolean) => void;
};

export const LinkTypeMenu: FC<Props> = ({
    link,
    point,
    menuOpen,
    setMenuOpen,
}) => {
    return (
        <Menu
            open={menuOpen}
            anchorReference='anchorPosition'
            anchorPosition={{
                left: point.getPosition().x,
                top: point.getPosition().y,
            }}
        >
            {ARROW_LINK_TYPES.map((linkType) => (
                <MenuItem
                    key={linkType}
                    onClick={() => {
                        link.changeConnectionType(linkType);
                        setMenuOpen(false);
                    }}
                >
                    {linkType}
                </MenuItem>
            ))}
        </Menu>
    );
};
