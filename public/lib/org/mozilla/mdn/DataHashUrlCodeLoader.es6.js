// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

foam.CLASS({
  package: 'org.mozilla.mdn',
  name: 'DataHashUrlCodeLoader',
  extends: 'org.mozilla.mdn.CodeLoader',
  implements: ['org.mozilla.mdn.DataHashUrlComponent'],

  requires: ['foam.net.HTTPRequest'],
  imports: ['creationContext'],

  properties: [
    {
      name: 'classUrl',
      expression: function(gcloudProjectId, classId) {
        return `https://storage.googleapis.com/${gcloudProjectId}.appspot.com/class:${classId}.txt`;
      },
    },
    {
      name: 'hashUrl',
      expression: function(gcloudProjectId, classId) {
        return `https://storage.googleapis.com/${gcloudProjectId}.appspot.com/class:${classId}.txt.md5sum`;
      },
    },
  ],

  methods: [
    {
      name: 'maybeLoad',
      code: (async function() {
        this.validate();
        const needsUpdate = await this.needsUpdate();
        if (!needsUpdate) return this.creationContext;
        return this.classFactory();
      }),
    },
    {
      name: 'needsUpdate',
      code: (async function() {
        const newHash = await this.fetchFromUrl(this.hashUrl);
        return this.hash_ !== newHash;
      }),
    },
    {
      name: 'classFactory',
      code: (async function maybeLoad() {
        const specStr = await this.fetchFromUrl(this.classUrl);
        const model = foam.json.parseString(specStr);
        model.validate();
        const cls = model.buildClass();
        cls.validate();

        const ctx = this.creationContext.createSubContext({});
        console.log('Register', cls.id, 'in', ctx.$UID);
        ctx.register(cls);
        foam.package.registerClass(cls);
        this.hash_ = this.hashProvider.getHash(specStr);

        this.creationContext = ctx;

        console.log('Provide', cls.id, 'in', ctx.$UID);
        return ctx;
      }),
    },
  ],
});