import {Group, Path} from '@shopify/react-native-skia';
import React from 'react';
import {IForwardToGoalLineProps} from '../types/propsTypes';
import {colors} from '../common/colors';
import {constants} from '../common/constants';

const {FORWARD_TO_GOAL_LINE_STROKE_WIDTH} = constants;

export const ForwardToGoalLine = ({
  forwardToGoalLine,
}: IForwardToGoalLineProps) => {
  return (
    <Group>
      <Path
        path={forwardToGoalLine}
        color={colors.forwardToGoal}
        strokeWidth={FORWARD_TO_GOAL_LINE_STROKE_WIDTH}
        style={'stroke'}
      />
    </Group>
  );
};
