import {Canvas, Skia} from '@shopify/react-native-skia';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS, useSharedValue, withTiming} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {constants} from '../common/constants';
import {DefenderPlayer} from '../components/DefenderPlayer';
import {DefenderPlayerInitial} from '../components/DefenderPlayerInitial';
import {ForwardPlayer} from '../components/ForwardPlayer';
import {ForwardPlayerInitial} from '../components/ForwardPlayerInitial';
import {Pitch} from '../components/Pitch';
import {PlayersPaths} from '../components/PlayersPaths';
import {styles} from './styles';
import {ForwardToGoalLine} from '../components/ForwardToGoalLine';

const {
  DEFENDER_CIRCLE_RAD,
  FIELD_LINES_THICKNESS,
  GOAL_HEIGHT,
  DEFENSIVE_PLAYER_TARGET_POINT,
} = constants;

export const CanvasScreen = () => {
  const [defensive, setDefensive] = useState(false);
  const [offensive, setOffensive] = useState(false);

  const {top, bottom} = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();
  const CLEAR_HEIGHT = height - (top + bottom);

  // coordinates of defender
  const scaleDefensive = useSharedValue(0);
  const cxDefensive = useSharedValue(0);
  const cyDefensive = useSharedValue(0);

  // coordinates of offensive player
  const scaleOffensive = useSharedValue(0);
  const cxOffensive = useSharedValue(0);
  const cyOffensive = useSharedValue(0);

  // The path of movement of the attacking player
  const offensivePath = Skia.Path.Make();
  // initial point of path line
  offensivePath.moveTo(cxOffensive.value, cyOffensive.value);

  // The path of movement of the defensive player
  const defensivePath = Skia.Path.Make();
  // initial point of path line
  defensivePath.moveTo(cxDefensive.value, cyDefensive.value);

  // The line between the attacker and the goal(dashed)
  const forwardToGoalLine = Skia.Path.Make();
  forwardToGoalLine.moveTo(
    width / 2,
    height - bottom - FIELD_LINES_THICKNESS - GOAL_HEIGHT,
  );

  // The coordinates that the defender aiming
  let defensiveXDerived = 0;
  let defensiveYDerived = 0;

  // tap handling
  const gesture = Gesture.Tap().onBegin(e => {
    //Allow positioning only when the tap occurs within the football field
    if (e.absoluteY <= height - bottom) {
      if (!defensive) {
        //set the defensive player
        cxDefensive.value = e.absoluteX;
        cyDefensive.value = e.absoluteY;
        runOnJS(setDefensive)(true);

        // updating defensive player path
        defensivePath.moveTo(cxDefensive.value, cyDefensive.value);

        // scaling defensive player
        scaleDefensive.value = withTiming(DEFENDER_CIRCLE_RAD);
      } else if (defensive && !offensive) {
        //set the offensive player
        cxOffensive.value = e.absoluteX;
        cyOffensive.value = e.absoluteY;
        runOnJS(setOffensive)(true);

        // updating defensive player path
        offensivePath.moveTo(cxOffensive.value, cyOffensive.value);

        // scaling offensive player
        scaleOffensive.value = withTiming(1);
      } else if (defensive && offensive) {
        // updating position of offensive player and its path
        cxOffensive.value = withTiming(e.absoluteX);
        cyOffensive.value = withTiming(e.absoluteY, {}, () => {
          offensivePath.lineTo(e.absoluteX, e.absoluteY);
        });

        // useful constants
        const centerOfTheFieldX = width / 2;
        const centerOfTheFieldY = height / 2;
        const isForwardOnRightSide = e.absoluteX > centerOfTheFieldX;
        const isForwardOnLeftSide = e.absoluteX < centerOfTheFieldX;

        const isForwardMovingOnXAxis = e.absoluteX < cxOffensive.value;
        const isForwardMovingOnYAxis = e.absoluteY < cyOffensive.value;

        // Calculation of the distance traveled by the offensive
        // player along the X axis
        const distanceXOfMovementOfForward = isForwardMovingOnXAxis
          ? cxOffensive.value - e.absoluteX
          : e.absoluteX - cxOffensive.value;

        // Calculation of the distance traveled by the offensive
        // player along the Y axis
        const distanceYOfMovementOfForward = isForwardMovingOnYAxis
          ? cyOffensive.value - e.absoluteY
          : e.absoluteY - cyOffensive.value;

        // The point where the defender will move
        // (between the offensive player and the goal)
        let xCoord = (e.absoluteX - centerOfTheFieldX) / 2 + centerOfTheFieldX;
        let yCoord =
          (height - e.absoluteY) / 2 +
          e.absoluteY -
          DEFENDER_CIRCLE_RAD -
          FIELD_LINES_THICKNESS;

        if (isForwardOnLeftSide || isForwardOnRightSide) {
          // When the attacker enters the half of the defender's field,
          // we change the target point of the defender

          if (e.absoluteY > centerOfTheFieldY) {
            xCoord =
              (e.absoluteX - centerOfTheFieldX) / 2 +
              centerOfTheFieldX +
              (e.absoluteX - centerOfTheFieldX) / 4;
            yCoord =
              (height - e.absoluteY) / 2 +
              e.absoluteY -
              FIELD_LINES_THICKNESS -
              (height - e.absoluteY) / 4;
          }

          // The greater of the distances traveled by the attacker along
          // the x and y axes
          const maxDistance = Math.max(
            distanceXOfMovementOfForward,
            distanceYOfMovementOfForward,
          );

          // The coordinate difference between the defender's target point
          //  and the defender's current position
          const differenceX = xCoord - cxDefensive.value;
          const differenceY = yCoord - cyDefensive.value;

          // set defendersX position
          defensiveXDerived =
            differenceX > 0
              ? Math.min(xCoord, cxDefensive.value + maxDistance)
              : differenceX < 0
              ? Math.max(xCoord, cxDefensive.value - maxDistance)
              : cxDefensive.value;

          // set defendersY position
          defensiveYDerived =
            differenceY > 0
              ? Math.min(yCoord, cyDefensive.value + maxDistance)
              : differenceY < 0
              ? Math.max(yCoord, cyDefensive.value - maxDistance)
              : cyDefensive.value;
        } else {
          // Handle case when offensive player on the middle of the field

          xCoord = centerOfTheFieldX;
          yCoord = (height - e.absoluteY) / 2;
          defensiveXDerived = xCoord;
          defensiveYDerived = yCoord;
        }

        // Move defender to calculated position, draw path line,
        // draw offensive player shorter distance to goal (dashed)

        cxDefensive.value = withTiming(defensiveXDerived);
        cyDefensive.value = withTiming(defensiveYDerived, {}, () => {
          defensivePath.lineTo(defensiveXDerived, defensiveYDerived);
          forwardToGoalLine.reset();
          forwardToGoalLine.moveTo(
            width / 2,
            height - bottom - FIELD_LINES_THICKNESS - GOAL_HEIGHT,
          );
          forwardToGoalLine.lineTo(e.absoluteX, e.absoluteY);
          forwardToGoalLine.dash(5, 20, 10);
          forwardToGoalLine.addCircle(
            xCoord,
            yCoord,
            DEFENSIVE_PLAYER_TARGET_POINT,
          );
        });
      }
    }
  });
  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={[styles.flex, {paddingTop: top, paddingBottom: bottom}]}>
        <Pitch
          topInset={top}
          bottomInset={bottom}
          width={width}
          height={height}
          clearHeight={CLEAR_HEIGHT}
        />
        <ForwardToGoalLine forwardToGoalLine={forwardToGoalLine} />
        <ForwardPlayerInitial
          cxOffensive={cxOffensive}
          cyOffensive={cyOffensive}
          scale={scaleOffensive}
        />
        <ForwardPlayer
          cxOffensive={cxOffensive}
          cyOffensive={cyOffensive}
          scale={scaleOffensive}
        />
        <DefenderPlayerInitial
          cxDefensive={cxDefensive}
          cyDefensive={cyDefensive}
          scaleDefensive={scaleDefensive}
        />
        <DefenderPlayer
          cxDefensive={cxDefensive}
          cyDefensive={cyDefensive}
          scaleDefensive={scaleDefensive}
        />
        <PlayersPaths
          defensivePath={defensivePath}
          offensivePath={offensivePath}
        />
      </Canvas>
    </GestureDetector>
  );
};
