import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface EyeOffIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const EyeOffIcon: React.FC<EyeOffIconProps> = ({
  width = 24,
  height = 24,
  color = '#666',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 7.5C14.76 7.5 17 9.74 17 12.5C17 13.28 16.82 14.02 16.5 14.67L19.56 17.73C21.07 16.5 22.27 14.86 23 12.5C21.27 8.11 17 5 12 5C10.73 5 9.51 5.2 8.36 5.57L10.53 7.74C11.18 7.42 11.92 7.5 12 7.5ZM2 4.77L4.28 7.05C2.61 8.3 1.27 10.03 1 12.5C2.73 16.89 7 20 12 20C13.55 20 15.03 19.7 16.38 19.18L19.73 22.53L21.27 21L3.5 3.23L2 4.77ZM7.53 10.3L9.08 11.85C9.03 12.06 9 12.28 9 12.5C9 14.16 10.34 15.5 12 15.5C12.22 15.5 12.44 15.47 12.65 15.42L14.2 16.97C13.53 17.3 12.79 17.5 12 17.5C9.24 17.5 7 15.26 7 12.5C7 11.71 7.2 10.97 7.53 10.3ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z"
        fill={color}
      />
    </Svg>
  );
};
