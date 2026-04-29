import {DatabaseIcon} from '@sanity/icons'
import {definePlugin} from 'sanity'

import {SDKTool} from './tool/SDKTool'

export const sdkPlugin = definePlugin({
  name: 'sdk-demo',
  tools: [
    {
      name: 'sdk-demo',
      title: 'SDK Demo',
      icon: DatabaseIcon,
      component: SDKTool,
    },
  ],
})
