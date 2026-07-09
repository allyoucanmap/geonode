import { useState } from 'react'
import { Alert, Spinner } from '@geonode/ui'
import { useFacetTopics, useFacets, useTopicResources } from '../api.js'
import { home as t } from '../messages.js'
import styles from './FacetTree.module.css'

function Twisty({ open }) {
  return (
    <svg className={styles.twisty} data-open={open || undefined} width="1em" height="1em" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TreeRow({ label, count, title, expandable, expanded, loading, href, onToggle }) {
  const inner = (
    <>
      {expandable ? <Twisty open={expanded} /> : <span className={styles.spacer} />}
      <span className={styles.label}>{label}</span>
      {loading && <Spinner size="sm" />}
      {count != null && !loading && <span className={styles.count}>{count}</span>}
    </>
  )

  if (href) {
    return (
      <a className={styles.row} href={href} target="_blank" rel="noopener noreferrer" title={title}>
        {inner}
      </a>
    )
  }

  return (
    <button type="button" className={styles.row} onClick={onToggle} aria-expanded={expanded} title={title}>
      {inner}
    </button>
  )
}

function EmptyRow() {
  return (
    <li>
      <span className={styles.muted}>{t.treeEmpty}</span>
    </li>
  )
}

function ResourceLeaf({ resource }) {
  return (
    <li>
      <TreeRow label={resource.title} title={resource.title} href={resource.detail_url} />
    </li>
  )
}

function TopicBranch({ facet, topic, ownerPk }) {
  const [expanded, setExpanded] = useState(false)
  const { data, isFetching } = useTopicResources(facet.filter, topic.key, ownerPk, expanded)
  const resources = data?.resources ?? []

  return (
    <li>
      <TreeRow
        label={topic.label}
        count={topic.count}
        title={topic.label}
        expandable
        expanded={expanded}
        loading={expanded && isFetching && !data}
        onToggle={() => setExpanded((value) => !value)}
      />
      {expanded && data && (
        <ul className={styles.group}>
          {resources.length === 0 && <EmptyRow />}
          {resources.map((resource) => (
            <ResourceLeaf key={resource.pk ?? resource.id} resource={resource} />
          ))}
        </ul>
      )}
    </li>
  )
}

function FacetBranch({ facet, ownerPk }) {
  const [expanded, setExpanded] = useState(false)
  const { data, isFetching } = useFacetTopics(facet.name, ownerPk, expanded)
  const topics = data?.topics?.items ?? []

  return (
    <li>
      <TreeRow
        label={facet.label}
        title={facet.label}
        expandable
        expanded={expanded}
        loading={expanded && isFetching && !data}
        onToggle={() => setExpanded((value) => !value)}
      />
      {expanded && data && (
        <ul className={styles.group}>
          {topics.length === 0 && <EmptyRow />}
          {topics.map((topic) => (
            <TopicBranch key={topic.key} facet={facet} topic={topic} ownerPk={ownerPk} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function FacetTree({ ownerPk }) {
  const { data: facets, isLoading, isError } = useFacets()

  if (isLoading) return <Spinner label={t.loadingFacets} />
  if (isError) return <Alert variant="danger" title={t.facetsError} />

  return (
    <nav className={styles.region} aria-label={t.browseTitle}>
      <h2 className={styles.heading}>{t.browseTitle}</h2>
      <ul className={styles.tree}>
        {(facets ?? []).map((facet) => (
          <FacetBranch key={facet.name} facet={facet} ownerPk={ownerPk} />
        ))}
      </ul>
    </nav>
  )
}
