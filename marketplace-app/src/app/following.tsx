// Shelby is one store, so there are no shops to follow; old links land on Home.
import { Redirect } from 'expo-router';
import React from 'react';

export default function Following() {
  return <Redirect href="/" />;
}
