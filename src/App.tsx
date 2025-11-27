import { Header } from './components/Header'
import { ClauseCatalog } from './components/ClauseCatalog'
import { ContractPanel } from './components/ContractPanel'
import { Analytics } from './components/Analytics'

export default function App (): JSX.Element {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <ClauseCatalog />
        <ContractPanel />
        <Analytics />
      </main>
    </div>
  )
}
