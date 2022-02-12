import { KonvaEventObject } from 'konva/lib/Node';
import React from 'react';
import { Line as KonvaLine } from 'react-konva';
import { setHoveredStyle, setUnhoveredStyle } from 'src/features/envVisualizer/EnvVisualizerUtils';

import { Config, ShapeDefaultProps } from '../EnvVisualizerConfig';
import { Layout } from '../EnvVisualizerLayout';
import { Hoverable, ReferenceType, Visible } from '../EnvVisualizerTypes';

/** this classes encapsulates a null value in Source pairs or arrays */
export class ArrayNullUnit implements Visible, Hoverable {
  private _x: number;
  private _y: number;
  private _height: number;
  private _width: number;
  arrayUnit: ReferenceType;
  referencedBy: ReferenceType[];

  constructor(referencedBy: ReferenceType[]) {
    this.referencedBy = referencedBy;
    this.arrayUnit = referencedBy[0];
    this._x = this.arrayUnit.x();
    this._y = this.arrayUnit.y();
    this._height = this.arrayUnit.height();
    this._width = this.arrayUnit.width();
  }

  x(): number {
    return this._x;
  }
  y(): number {
    return this._y;
  }
  height(): number {
    return this._height;
  }
  width(): number {
    return this._width;
  }

  updatePosition = () => {
    this._x = this.arrayUnit.x();
    this._y = this.arrayUnit.y();
  };

  onMouseEnter = ({ currentTarget }: KonvaEventObject<MouseEvent>) => {
    setHoveredStyle(currentTarget);
  };

  onMouseLeave = ({ currentTarget }: KonvaEventObject<MouseEvent>) => {
    setUnhoveredStyle(currentTarget);
  };

  draw(): React.ReactNode {
    return (
      <KonvaLine
        {...ShapeDefaultProps}
        key={Layout.key++}
        points={[this.x(), this.y() + this.height(), this.x() + this.width(), this.y()]}
        stroke={Config.SA_WHITE.toString()}
        hitStrokeWidth={Number(Config.DataHitStrokeWidth)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    );
  }
}
