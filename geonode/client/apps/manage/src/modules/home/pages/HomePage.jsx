import { Alert, Badge, Card, DescriptionList, PageContent, PageHeader, Spinner, TwoColumn } from '@geonode/ui'
import { useUserInfo } from '../api.js'
import { FacetTree } from '../components/FacetTree.jsx'
import { home as t } from '../messages.js'

const badgeRow = { display: 'flex', flexWrap: 'wrap', gap: 'var(--gn-space-2, 0.5rem)' }

export function Component() {
  const { data, isLoading, isError } = useUserInfo()

  if (isLoading)
    return (
      <PageContent>
        <Spinner label={t.loading} />
      </PageContent>
    )

  if (isError || !data)
    return (
      <PageContent>
        <Alert variant="danger" title={t.couldNotLoad} />
      </PageContent>
    )

  const fullName = data.name?.trim()
  const isSuperuser = data.groups?.includes('admin')
  const groups = (data.groups ?? []).filter((group) => group && group !== 'admin')

  return (
    <TwoColumn sidebar={<FacetTree ownerPk={data.sub} />}>
      <PageHeader title={`${t.welcomeBack}, ${fullName || data.preferred_username}`} description={t.accountOverview} />
      <Card title={t.yourAccount}>
        <DescriptionList
          items={[
            { label: t.name, value: fullName || t.notProvided },
            { label: t.username, value: data.preferred_username },
            { label: t.email, value: data.email || t.notProvided },
            {
              label: t.role,
              value: <Badge variant={isSuperuser ? 'primary' : 'neutral'}>{isSuperuser ? t.superuser : t.member}</Badge>,
            },
            {
              label: t.groups,
              value: groups.length ? (
                <div style={badgeRow}>
                  {groups.map((group) => (
                    <Badge key={group}>{group}</Badge>
                  ))}
                </div>
              ) : (
                t.noGroups
              ),
            },
          ]}
        />
      </Card>
    </TwoColumn>
  )
}
