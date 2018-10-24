import React from 'react';
import Button from '@boa/components/Button';

export default function Buttons() {
  return (
    <div>
      <Button label='click' />
      <Button type='flat' label='click' />
      <Button type='icon' dynamicIcon='Home' label='click' />
    </div>
  );
}
