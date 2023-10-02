import React from 'react';
import {Group, Path} from '@shopify/react-native-skia';
import {IPlayersPathsProps} from '../types/propsTypes';
import {colors} from '../common/colors';
import {constants} from '../common/constants';

const {PLAYER_PATH_STROKE_WIDTH} = constants;

export const PlayersPaths = ({
  defensivePath,
  offensivePath,
}: IPlayersPathsProps) => {
  return (
    <Group>
      <Path
        path={offensivePath}
        style={'stroke'}
        color={colors.forward}
        strokeWidth={PLAYER_PATH_STROKE_WIDTH}
      />
      <Path
        path={defensivePath}
        style={'stroke'}
        color={colors.defender}
        strokeWidth={PLAYER_PATH_STROKE_WIDTH}
      />
    </Group>
  );
};
