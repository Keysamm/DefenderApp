import {Circle, Group} from '@shopify/react-native-skia';
import React from 'react';
import {IDefenderPlayerProps} from '../types/propsTypes';
import {constants} from '../common/constants';
import {colors} from '../common/colors';

const {DEFENDER_STROKE_WIDTH} = constants;

export const DefenderPlayerInitial = ({
  cxDefensive,
  cyDefensive,
  scaleDefensive,
}: IDefenderPlayerProps) => {
  return (
    <Group>
      <Circle
        cx={cxDefensive.value}
        cy={cyDefensive.value}
        r={scaleDefensive}
        color={colors.initialPosition}
        style={'stroke'}
        strokeWidth={DEFENDER_STROKE_WIDTH}
      />
    </Group>
  );
};
