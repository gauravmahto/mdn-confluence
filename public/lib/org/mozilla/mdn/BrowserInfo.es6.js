// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

foam.CLASS({
  package: 'org.mozilla.mdn',
  name: 'BrowserInfo',

  properties: [
    {
      class: 'Int',
      name: 'versionAdded',
      value: Infinity,
    },
    {
      class: 'Int',
      name: 'versionRemoved',
      value: Infinity,
    },
  ],
});
