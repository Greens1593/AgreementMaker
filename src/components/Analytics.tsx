import { useMemo } from 'react'
import { useAppStore } from '../store'

export function Analytics (): JSX.Element {
  const { clauses, contracts } = useAppStore()

  const stats = useMemo(() => {
    const byStatus = clauses.reduce<Record<string, number>>((acc, clause) => {
      acc[clause.status] = (acc[clause.status] ?? 0) + 1
      return acc
    }, {})

    const popular = clauses
      .slice()
      .sort((a, b) => b.versions.length - a.versions.length)
      .slice(0, 3)

    const approvalDurations = contracts.map((contract) => {
      const created = new Date(contract.createdAt).getTime()
      const updated = new Date(contract.updatedAt).getTime()
      return Math.max(0, Math.round((updated - created) / (1000 * 60 * 60 * 24)))
    })

    const avgApproval = approvalDurations.length > 0
      ? Math.round(approvalDurations.reduce((sum, day) => sum + day, 0) / approvalDurations.length)
      : 0

    return { byStatus, popular, avgApproval }
  }, [clauses, contracts])

  return (
    <section>
      <h2>Аналітика</h2>
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginTop: '1rem' }}>
        <div className="card">
          <h3>Пункти за статусами</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Статус</th>
                <th>Кількість</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Середня тривалість погодження</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{stats.avgApproval} днів</p>
          <p style={{ color: '#4a5568' }}>Розрахунок за фінальними оновленнями договорів</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Популярні клаузи</h3>
        <ol>
          {stats.popular.map((clause) => (
            <li key={clause.id}><strong>{clause.type}</strong> — {clause.text}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}
