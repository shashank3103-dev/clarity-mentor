import React from 'react';
import Svg, {Path} from 'react-native-svg';

export default function ChatIcon({size = 22, color = '#000'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
      <Path d="M8.5 11h7M8.5 14.5h4.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}
