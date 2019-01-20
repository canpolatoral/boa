import React from 'react';
import { DocCode as BDocCode } from '@boa/components/DocCode';

export default function DocCode() {
  return <BDocCode content="console.log('Hello world!');" lang="js" />;
}
