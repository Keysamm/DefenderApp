import {Circle, Group} from '@shopify/react-native-skia';
import React from 'react';
import {IDefenderPlayerProps} from '../types/propsTypes';
import {colors} from '../common/colors';
import {constants} from '../common/constants';

const {DEFENDER_STROKE_WIDTH} = constants;

export const DefenderPlayer = ({
  cxDefensive,
  cyDefensive,
  scaleDefensive,
}: IDefenderPlayerProps) => {
  return (
    <Group>
      <Circle
        cx={cxDefensive}
        cy={cyDefensive}
        r={scaleDefensive}
        color={colors.defender}
        style={'stroke'}
        strokeWidth={DEFENDER_STROKE_WIDTH}
      />
    </Group>
  );
};
