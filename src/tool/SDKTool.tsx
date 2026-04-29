import {type SanityConfig} from '@sanity/sdk'
import {SanityApp} from '@sanity/sdk-react'
import {type JSX, Suspense, useMemo} from 'react'
import {useWorkspace} from 'sanity'

import {SDKToolContent} from './SDKToolContent'

/**
 * Studio tool wrapper. Reads projectId/dataset from the active workspace and
 * bootstraps a SanityApp in studio mode so all SDK hooks work without
 * requiring a separate login flow.
 */
export function SDKTool(): JSX.Element {
  const workspace = useWorkspace()

  const config = useMemo<SanityConfig>(
    () => ({
      projectId: workspace.projectId,
      dataset: workspace.dataset,
      // studio.authenticated tells the SDK the user is already logged in via
      // the Studio session — no redirect to the login page will happen.
      studio: {authenticated: true},
    }),
    [workspace.projectId, workspace.dataset],
  )

  return (
    <SanityApp config={config} fallback={<div style={{padding: '2rem'}}>Loading SDK…</div>}>
      <Suspense fallback={<div style={{padding: '2rem'}}>Loading…</div>}>
        <SDKToolContent />
      </Suspense>
    </SanityApp>
  )
}
