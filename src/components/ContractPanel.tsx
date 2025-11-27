import { useMemo, useState } from 'react'
import { useAppStore } from '../store'
import { type ClauseStatus, type ContractStatus, type ManualContractStatus } from '../types/domain'

const clauseStatusesAllowed: ClauseStatus[] = ['Перевірено юристом', 'Визнано типовим']
const contractStatuses: ContractStatus[] = ['Створено', 'На погодженні', 'Погоджено юристом']
const manualStatuses: ManualContractStatus[] = ['Погоджено начальником ЮО', 'Підписано']

export function ContractPanel (): JSX.Element {
  const { clauses, contracts, addContract, updateContractStatus, updateManualContractStatus, currentUser, addComment, users } = useAppStore()
  const [title, setTitle] = useState('')
  const [approver, setApprover] = useState(users.find((user) => user.role === 'Юрист')?.name ?? '')
  const [selected, setSelected] = useState<string[]>([])

  const availableClauses = useMemo(() => clauses.filter((clause) => clauseStatusesAllowed.includes(clause.status)), [clauses])

  const toggleClause = (id: string): void => {
    setSelected((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])
  }

  const createContract = (): void => {
    if (title.trim() === '' || selected.length === 0) return
    addContract({ title, clauseIds: selected, approver })
    setTitle('')
    setSelected([])
  }

  return (
    <section>
      <h2>Каталог договорів</h2>
      <div className="card">
        <h3>Новий договір</h3>
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div>
            <label>Назва</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Наприклад, Поставка обладнання" />
          </div>
          <div>
            <label>Юрист для погодження</label>
            <select value={approver} onChange={(e) => setApprover(e.target.value)}>
              {users.filter((user) => user.role === 'Юрист').map((user) => (
                <option key={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Оберіть клаузи (лише перевірені та типові)</p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {availableClauses.map((clause) => (
            <label key={clause.id} className="card" style={{ display: 'block', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selected.includes(clause.id)}
                onChange={() => toggleClause(clause.id)}
              />{' '}
              <strong>{clause.type}</strong>
              <p style={{ fontSize: '0.9rem' }}>{clause.text.slice(0, 90)}...</p>
            </label>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <button onClick={createContract}>Зібрати договір</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}>
        {contracts.map((contract) => (
          <div key={contract.id} className="card">
            <div className="flex" style={{ justifyContent: 'space-between' }}>
              <div>
                <p className="status contract">{contract.status}</p>
                <p style={{ margin: 0, fontWeight: 700 }}>{contract.title}</p>
              </div>
              <small>Автор: {contract.author}</small>
            </div>
            <div className="chip-row">
              {contract.clauseIds.map((id) => {
                const clause = clauses.find((c) => c.id === id)
                return clause != null ? <span key={id} className="badge">{clause.type}</span> : null
              })}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>Юрист: {contract.approver}</p>
            <details>
              <summary>Версії</summary>
              <ul>
                {contract.versions.map((v) => (
                  <li key={v.id}>
                    {new Date(v.createdAt).toLocaleString('uk-UA')} — {v.author} ({v.manualStatus ?? '—'})
                  </li>
                ))}
              </ul>
            </details>
            <details>
              <summary>Коментарі</summary>
              <ul>
                {contract.comments.map((comment) => (
                  <li key={comment.id}><strong>{comment.author}</strong>: {comment.text}</li>
                ))}
              </ul>
              <CommentBox contractId={contract.id} />
            </details>

            <div className="flex" style={{ marginTop: '0.75rem' }}>
              {currentUser.role !== 'Співробітник' && contractStatuses.map((status) => (
                <button
                  key={status}
                  className="secondary"
                  onClick={() => updateContractStatus(contract.id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex" style={{ marginTop: '0.5rem' }}>
              {manualStatuses.map((status) => (
                <button
                  key={status}
                  className="secondary"
                  onClick={() => updateManualContractStatus(contract.id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CommentBox ({ contractId }: { contractId: string }): JSX.Element {
  const { addComment, currentUser } = useAppStore()
  const [text, setText] = useState('')

  const submit = (): void => {
    if (text.trim() === '') return
    addComment('contract', contractId, text, currentUser.name)
    setText('')
  }

  return (
    <div className="flex" style={{ marginTop: '0.5rem' }}>
      <input placeholder="Залишити коментар" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={submit}>Додати</button>
    </div>
  )
}
