import { useAppStore } from '../store'
import { type Role } from '../types/domain'

const roles: Role[] = ['Співробітник', 'Юрист', 'Адміністратор']

export function Header (): JSX.Element {
  const { currentUser, setRole } = useAppStore()

  return (
    <header>
      <div className="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0 }}>Agreement Maker</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>Конструктор договорів з перевірених клауз</p>
        </div>
        <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <span>Користувач: <strong>{currentUser.name}</strong></span>
          <select value={currentUser.role} onChange={(e) => setRole(e.target.value as Role)}>
            {roles.map((role) => (<option key={role}>{role}</option>))}
          </select>
        </div>
      </div>
    </header>
  )
}
