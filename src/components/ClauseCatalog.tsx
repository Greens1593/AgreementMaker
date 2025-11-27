import { useMemo, useState } from 'react'
import { useAppStore } from '../store'
import { type Clause, type ClauseStatus } from '../types/domain'

const statusToClass: Record<ClauseStatus, string> = {
  'Створено': 'status created',
  'Перевірено юристом': 'status reviewed',
  'Визнано типовим': 'status typical',
  'Одноразово погоджено': 'status oneoff'
}

export function ClauseCatalog (): JSX.Element {
  const { clauses, currentUser, addClause, setClauseStatus, addComment } = useAppStore()
  const [query, setQuery] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [form, setForm] = useState({ text: '', type: '', tags: '' })

  const filtered = useMemo(() => clauses.filter((clause) => {
    const matchText = clause.text.toLowerCase().includes(query.toLowerCase())
    const matchTag = tagFilter === '' || clause.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    return matchText && matchTag
  }), [clauses, query, tagFilter])

  const addNewClause = (): void => {
    if (form.text.trim() === '' || form.type.trim() === '') return
    const tags = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
    addClause({ text: form.text, type: form.type, tags })
    setForm({ text: '', type: '', tags: '' })
  }

  const handleStatus = (clause: Clause, status: ClauseStatus): void => {
    setClauseStatus(clause.id, status, currentUser.name)
  }

  return (
    <section>
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Каталог пунктів</h2>
          <p style={{ margin: 0, color: '#4a5568' }}>Пошук за тегами та повним текстом, доступні версії та коментарі</p>
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="flex">
          <input
            placeholder="Пошук за текстом"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input
            placeholder="Фільтр тегів (#...)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Додати новий пункт</h3>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Тип</label>
            <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          </div>
          <div>
            <label>Теги (через кому)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <label>Текст пункту</label>
          <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <button onClick={addNewClause}>Зберегти</button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '1rem' }}>
        {filtered.map((clause) => (
          <div className="card" key={clause.id}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className={statusToClass[clause.status]}>{clause.status}</p>
                <p style={{ margin: 0, fontWeight: 600 }}>{clause.type}</p>
              </div>
              <small>Автор: {clause.author}</small>
            </div>
            <p>{clause.text}</p>
            <div className="chip-row">
              {clause.tags.map((tag) => (<span className="badge" key={tag}>{tag}</span>))}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#4a5568' }}>
              Оновлено: {new Date(clause.updatedAt).toLocaleDateString('uk-UA')} | Версій: {clause.versions.length}
            </div>
            <details style={{ marginTop: '0.5rem' }}>
              <summary>Історія версій</summary>
              <ul>
                {clause.versions.map((version) => (
                  <li key={version.id}>
                    <strong>{version.editor}</strong> — {new Date(version.updatedAt).toLocaleString('uk-UA')}<br />
                    <em style={{ color: '#2d3748' }}>{version.text}</em>
                  </li>
                ))}
              </ul>
            </details>
            <details>
              <summary>Коментарі</summary>
              <ul>
                {clause.comments.map((comment) => (
                  <li key={comment.id}><strong>{comment.author}:</strong> {comment.text}</li>
                ))}
              </ul>
              <CommentBox clauseId={clause.id} />
            </details>
            {currentUser.role !== 'Співробітник' && (
              <div className="flex" style={{ marginTop: '0.75rem' }}>
                <button
                  className="secondary"
                  onClick={() => handleStatus(clause, 'Перевірено юристом')}
                >
                  Перевірено юристом
                </button>
                <button className="secondary" onClick={() => handleStatus(clause, 'Визнано типовим')}>Типовий</button>
                <button className="secondary" onClick={() => handleStatus(clause, 'Одноразово погоджено')}>Одноразово</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function CommentBox ({ clauseId }: { clauseId: string }): JSX.Element {
  const { addComment, currentUser } = useAppStore()
  const [text, setText] = useState('')

  const submit = (): void => {
    if (text.trim() === '') return
    addComment('clause', clauseId, text, currentUser.name)
    setText('')
  }

  return (
    <div className="flex" style={{ marginTop: '0.5rem' }}>
      <input placeholder="Залишити коментар" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={submit}>Додати</button>
    </div>
  )
}
