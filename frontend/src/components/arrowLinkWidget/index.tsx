import {
    DefaultLinkWidget,
    LinkWidget,
    PointModel,
} from '@projectstorm/react-diagrams';
import React from 'react';
import { DefaultLinkProps } from '@projectstorm/react-diagrams-defaults/dist/@types/link/DefaultLinkWidget';
import { ArrowLinkModel } from '../../utils/arrowLink/arrowLinkModel';
import { UmlLinkWithTypeSelector } from './umlLinkWithTypeSelector';

export class ArrowLinkWidget extends DefaultLinkWidget {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    props: DefaultLinkProps & { link: ArrowLinkModel };

    generateArrow(point: PointModel, previousPoint: PointModel): JSX.Element {
        return (
            <UmlLinkWithTypeSelector
                key={point.getID()}
                point={point}
                previousPoint={previousPoint}
                link={this.props.link}
            />
        );
    }

    generatePoint(point: PointModel): JSX.Element {
        return super.generatePoint(point);
    }

    render() {
        //ensure id is present for all points on the path
        const points = this.props.link.getPoints();
        const paths = [];
        this.refPaths = [];

        //draw the multiple anchors and complex line instead
        for (let j = 0; j < points.length - 1; j++) {
            paths.push(
                this.generateLink(
                    LinkWidget.generateLinePath(points[j], points[j + 1]),
                    {
                        'data-linkid': this.props.link.getID(),
                        'data-point': j,
                        onMouseDown: (event: MouseEvent) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            this.addPointToLink(event, j + 1);
                        },
                    },
                    j
                )
            );
        }

        //render the circles
        for (let i = 1; i < points.length - 1; i++) {
            paths.push(this.generatePoint(points[i]));
        }

        if (this.props.link.getTargetPort() !== null) {
            paths.push(
                this.generateArrow(
                    points[points.length - 1],
                    points[points.length - 2]
                )
            );
        } else {
            paths.push(this.generatePoint(points[points.length - 1]));
        }

        return <g>{paths}</g>;
    }
}
