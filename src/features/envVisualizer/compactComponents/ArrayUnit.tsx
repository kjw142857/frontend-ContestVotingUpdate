import { KonvaEventObject } from 'konva/lib/Node';
import React, { RefObject } from 'react';

import EnvVisualizer from '../EnvVisualizer';
import { CompactConfig } from '../EnvVisualizerCompactConfig';
import { Layout } from '../EnvVisualizerLayout';
import { Data, Visible } from '../EnvVisualizerTypes';
import { setHoveredStyle, setUnhoveredStyle } from '../EnvVisualizerUtils';
import { Arrow } from './arrows/Arrow';
import { RoundedRect } from './shapes/RoundedRect';
import { ArrayValue } from './values/ArrayValue';
import { PrimitiveValue } from './values/PrimitiveValue';
import { Value } from './values/Value';

/** this class encapsulates a single unit (box) of array to be rendered.
 *  this unit is part of an ArrayValue */
export class ArrayUnit implements Visible {
  private _x: number;
  private _y: number;
  private _height: number;
  private _width: number;
  readonly value: Value;

  /** check if this is the first unit in the array */
  readonly isFirstUnit: boolean;
  /** check if this is the last unit in the array */
  readonly isLastUnit: boolean;
  /** check if this unit is the main reference of the value */
  readonly isMainReference: boolean;
  /** check if the value is already drawn */
  private isDrawn: boolean = false;
  ref: RefObject<any> = React.createRef();

  parent: ArrayValue;
  arrow: Arrow | undefined = undefined;

  constructor(
    /** index of this unit in its parent */
    readonly idx: number,
    /** the value this unit contains*/
    readonly data: Data,
    /** parent of this unit */
    parent: ArrayValue
  ) {
    this.parent = parent;
    this._x = this.parent.x() + this.idx * CompactConfig.DataUnitWidth;
    this._y = this.parent.y();
    this._height = CompactConfig.DataUnitHeight;
    this._width = CompactConfig.DataUnitWidth;
    this.isFirstUnit = this.idx === 0;
    this.isLastUnit = this.idx === this.parent.data.length - 1;
    this.value = Layout.createCompactValue(this.data, this);
    this.isMainReference = this.value.referencedBy.length > 1;
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

  updatePosition = () => {};

  onMouseEnter = ({ currentTarget }: KonvaEventObject<MouseEvent>) => {
    setHoveredStyle(currentTarget);
  };

  onMouseLeave = ({ currentTarget }: KonvaEventObject<MouseEvent>) => {
    setUnhoveredStyle(currentTarget);
  };

  reset = () => {
    this.isDrawn = false;
  };

  draw(): React.ReactNode {
    if (this.isDrawn) return null;
    this.isDrawn = true;

    const cornerRadius = {
      upperLeft: 0,
      lowerLeft: 0,
      upperRight: 0,
      lowerRight: 0
    };

    if (this.isFirstUnit)
      cornerRadius.upperLeft = cornerRadius.lowerLeft = Number(CompactConfig.DataCornerRadius);
    if (this.isLastUnit)
      cornerRadius.upperRight = cornerRadius.lowerRight = Number(CompactConfig.DataCornerRadius);

    return (
      <React.Fragment key={Layout.key++}>
        <RoundedRect
          key={Layout.key++}
          x={this.x()}
          y={this.y()}
          width={this.width()}
          height={this.height()}
          stroke={
            EnvVisualizer.getPrintableMode()
              ? CompactConfig.SA_BLUE.toString()
              : CompactConfig.SA_WHITE.toString()
          }
          hitStrokeWidth={Number(CompactConfig.DataHitStrokeWidth)}
          fillEnabled={false}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          cornerRadius={cornerRadius}
        />
        {this.value.draw()}
        {this.value instanceof PrimitiveValue || Arrow.from(this).to(this.value).draw()}
      </React.Fragment>
    );
  }
}
