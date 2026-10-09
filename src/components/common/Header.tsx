import React from 'react';
import CustomHeader, {CustomHeaderProps} from './CustomHeader';

export default function Header(props: any) {
  return (
    <CustomHeader
      title={props.title}
      subtitle={props.subtitle}
      onBack={props.navigation?.goBack || props.onBack}
      showBack={props.back !== false}
      right={props.right}
    />
  );
}
export {CustomHeader};
