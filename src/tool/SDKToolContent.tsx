import {type DocumentHandle} from '@sanity/sdk'
import {
  useCurrentUser,
  useDocumentProjection,
  useDocuments,
  usePresence,
  useQuery,
} from '@sanity/sdk-react'
import {Box, Card, Flex, Label, Stack, Text} from '@sanity/ui'
import {type JSX, Suspense} from 'react'

export function SDKToolContent(): JSX.Element {
  return (
    <Box padding={4}>
      <Stack space={4}>
        <Suspense fallback={<Text>Loading user…</Text>}>
          <CurrentUserSection />
        </Suspense>
        <PresenceSection />
        <Suspense fallback={<Text>Loading documents…</Text>}>
          <DocumentsSection />
        </Suspense>
        <Suspense fallback={<Text>Running query…</Text>}>
          <QuerySection />
        </Suspense>
      </Stack>
    </Box>
  )
}

function CurrentUserSection(): JSX.Element {
  const user = useCurrentUser()
  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={2}>
        <Label size={1}>Current User (via SDK in studioMode)</Label>
        {user ? (
          <Flex gap={2} align="center">
            {user.profileImage && (
              <img
                src={user.profileImage}
                alt={user.name}
                style={{borderRadius: '50%', height: 32, width: 32}}
              />
            )}
            <Stack space={1}>
              <Text size={2} weight="semibold">
                {user.name}
              </Text>
              <Text muted size={1}>
                {user.email}
              </Text>
            </Stack>
          </Flex>
        ) : (
          <Text muted>Not logged in</Text>
        )}
      </Stack>
    </Card>
  )
}

function PresenceSection(): JSX.Element {
  const {locations} = usePresence()
  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={2}>
        <Label size={1}>Active Presence ({locations.length})</Label>
        {locations.length === 0 ? (
          <Text muted>No active sessions</Text>
        ) : (
          <Stack space={1}>
            {locations.map((presence) => {
              return (
                <Text key={presence.sessionId} size={1}>
                  {presence.user.displayName}
                  {presence.locations[0]
                    ? ` — ${presence.locations[0].documentId} @ ${presence.locations[0].path.join('.')}`
                    : ''}
                </Text>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

function DocumentsSection(): JSX.Element {
  const {data, count, hasMore, loadMore, isPending} = useDocuments({
    documentType: 'author',
    batchSize: 5,
    orderings: [{field: '_createdAt', direction: 'desc'}],
  })

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={3}>
        <Label size={1}>Authors ({count} total)</Label>
        <Stack space={2}>
          {data.map((handle) => (
            <Suspense key={handle.documentId} fallback={<Text size={1}>Loading…</Text>}>
              <AuthorRow handle={handle} />
            </Suspense>
          ))}
        </Stack>
        {hasMore && (
          <button onClick={loadMore} disabled={isPending} type="button">
            {isPending ? 'Loading…' : 'Load more'}
          </button>
        )}
      </Stack>
    </Card>
  )
}

function AuthorRow({handle}: {handle: DocumentHandle<'author'>}): JSX.Element {
  const {data} = useDocumentProjection<{name?: string; role?: string}>({
    ...handle,
    projection: '{name, role}',
  })
  return (
    <Flex align="center" gap={2}>
      <Text size={2}>{data?.name ?? 'Untitled'}</Text>
      {data?.role && (
        <Text muted size={1}>
          ({data.role})
        </Text>
      )}
    </Flex>
  )
}

function QuerySection(): JSX.Element {
  const {data, isPending} = useQuery<Array<{_id: string; name: string; role?: string}>>({
    query: `*[_type == "author"][0..4]{_id, name, role}`,
  })

  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={2}>
        <Label size={1}>GROQ Query</Label>
        <Text muted size={1} style={{opacity: isPending ? 0.5 : 1}}>
          {'*[_type == "author"][0..4]{_id, name, role}'}
        </Text>
        <pre
          style={{
            background: '#f5f5f5',
            borderRadius: 4,
            fontSize: 12,
            opacity: isPending ? 0.5 : 1,
            overflow: 'auto',
            padding: '8px',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </Stack>
    </Card>
  )
}
