import {
  Circle,
  DiffRect,
  Fill,
  Group,
  Line,
  RoundedRect,
  rect,
  rrect,
  vec,
} from '@shopify/react-native-skia';
import React from 'react';
import {IPitchProps} from '../types/propsTypes';
import {colors} from '../common/colors';
import {constants} from '../common/constants';

const {
  GOAL_WIDTH,
  GOAL_HEIGHT,
  FIELD_LINES_THICKNESS,
  PITCH_ROUNDED_RECT_RAD,
  CENTER_CIRCLE_RAD,
} = constants;

export const Pitch = ({
  topInset,
  bottomInset,
  width,
  height,
  clearHeight,
}: IPitchProps) => {
  const outer = rrect(rect(0, topInset, width, clearHeight), 2, 2);
  const inner = rrect(
    rect(
      FIELD_LINES_THICKNESS,
      topInset + FIELD_LINES_THICKNESS,
      width - FIELD_LINES_THICKNESS * 2,
      clearHeight - FIELD_LINES_THICKNESS * 2,
    ),
    2,
    2,
  );

  return (
    <Group>
      <Fill color={colors.fieldGreen} />
      <Group color={colors.goal}>
        <RoundedRect
          x={width / 2 - GOAL_WIDTH / 2}
          y={topInset + FIELD_LINES_THICKNESS}
          width={GOAL_WIDTH}
          height={GOAL_HEIGHT}
          r={PITCH_ROUNDED_RECT_RAD}
        />
        <RoundedRect
          x={width / 2 - GOAL_WIDTH / 2}
          y={height - bottomInset - GOAL_HEIGHT - FIELD_LINES_THICKNESS}
          width={GOAL_WIDTH}
          height={GOAL_HEIGHT}
          r={PITCH_ROUNDED_RECT_RAD}
        />
        <Circle
          r={CENTER_CIRCLE_RAD}
          cx={width / 2}
          cy={height / 2}
          style={'stroke'}
          strokeWidth={FIELD_LINES_THICKNESS}
          color={colors.white}
        />
      </Group>
      <Line
        p1={vec(0, height / 2 + FIELD_LINES_THICKNESS / 2)}
        p2={vec(width, height / 2 + FIELD_LINES_THICKNESS / 2)}
        color={colors.white}
        style="stroke"
        strokeWidth={FIELD_LINES_THICKNESS}
      />
      <DiffRect inner={inner} outer={outer} color={colors.white} />
    </Group>
  );
};
