import {SkPath} from '@shopify/react-native-skia';
import {SharedValue} from 'react-native-reanimated';

export interface IForwardPlayerProps {
  cxOffensive: SharedValue<number>;
  cyOffensive: SharedValue<number>;
  scale: SharedValue<number>;
}

export interface IDefenderPlayerProps {
  cxDefensive: SharedValue<number>;
  cyDefensive: SharedValue<number>;
  scaleDefensive: SharedValue<number>;
}

export interface IPitchProps {
  topInset: number;
  bottomInset: number;
  width: number;
  height: number;
  clearHeight: number;
}

export interface IPlayersPathsProps {
  defensivePath: SkPath;
  offensivePath: SkPath;
}

export interface IForwardToGoalLineProps {
  forwardToGoalLine: SkPath;
}
