// Shelby is one store: old shop links (and /s/<id> share links) land on the store's Home.
import { Redirect } from 'expo-router';
import React from 'react';

export default function Shop() {
  return <Redirect href="/" />;
}
