import { nanoid } from 'nanoid'
import dayjs from 'dayjs'
import { create } from 'zustand'
import { clauses as seedClauses, contracts as seedContracts, users as seedUsers } from './data/seed'
import {
  type Clause,
  type ClauseStatus,
  type Contract,
  type ContractStatus,
  type ManualContractStatus,
  type Role,
  type User
} from './types/domain'

interface AppState {
  users: User[]
  currentUser: User
  clauses: Clause[]
  contracts: Contract[]
  setRole: (role: Role) => void
  addClause: (clause: Pick<Clause, 'text' | 'type' | 'tags'>) => void
  setClauseStatus: (id: string, status: ClauseStatus, reviewer: string) => void
  addClauseVersion: (id: string, text: string, editor: string) => void
  addContract: (payload: { title: string, clauseIds: string[], approver: string }) => void
  updateContractStatus: (id: string, status: ContractStatus) => void
  updateManualContractStatus: (id: string, status: ManualContractStatus) => void
  addComment: (entity: 'clause' | 'contract', id: string, text: string, author: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  users: seedUsers,
  currentUser: seedUsers[0],
  clauses: seedClauses,
  contracts: seedContracts,

  setRole: (role) => set((state) => ({
    currentUser: { ...state.currentUser, role }
  })),

  addClause: ({ text, type, tags }) => set((state) => {
    const timestamp = dayjs().toISOString()
    const newClause: Clause = {
      id: nanoid(),
      text,
      type,
      tags,
      author: state.currentUser.name,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'Створено',
      versions: [
        {
          id: nanoid(),
          text,
          updatedAt: timestamp,
          editor: state.currentUser.name
        }
      ],
      comments: []
    }
    return { clauses: [newClause, ...state.clauses] }
  }),

  setClauseStatus: (id, status, reviewer) => set((state) => ({
    clauses: state.clauses.map((clause) => clause.id === id
      ? { ...clause, status, reviewer, updatedAt: dayjs().toISOString() }
      : clause)
  })),

  addClauseVersion: (id, text, editor) => set((state) => ({
    clauses: state.clauses.map((clause) => {
      if (clause.id !== id) return clause
      const timestamp = dayjs().toISOString()
      const updatedVersions = [...clause.versions, { id: nanoid(), text, updatedAt: timestamp, editor }]
      return {
        ...clause,
        text,
        versions: updatedVersions,
        updatedAt: timestamp
      }
    })
  })),

  addContract: ({ title, clauseIds, approver }) => set((state) => {
    const timestamp = dayjs().toISOString()
    const newContract: Contract = {
      id: nanoid(),
      title,
      clauseIds,
      approver,
      author: state.currentUser.name,
      status: 'Створено',
      createdAt: timestamp,
      updatedAt: timestamp,
      comments: [],
      versions: [
        {
          id: nanoid(),
          createdAt: timestamp,
          author: state.currentUser.name,
          clauseIds
        }
      ]
    }
    return { contracts: [newContract, ...state.contracts] }
  }),

  updateContractStatus: (id, status) => set((state) => ({
    contracts: state.contracts.map((contract) => contract.id === id
      ? { ...contract, status, updatedAt: dayjs().toISOString() }
      : contract)
  })),

  updateManualContractStatus: (id, status) => set((state) => ({
    contracts: state.contracts.map((contract) => contract.id === id
      ? {
          ...contract,
          manualStatus: status,
          updatedAt: dayjs().toISOString(),
          versions: [
            ...contract.versions,
            {
              id: nanoid(),
              createdAt: dayjs().toISOString(),
              author: state.currentUser.name,
              clauseIds: contract.clauseIds,
              manualStatus: status
            }
          ]
        }
      : contract)
  })),

  addComment: (entity, id, text, author) => set((state) => {
    const comment = { id: nanoid(), author, text, createdAt: dayjs().toISOString() }
    if (entity === 'clause') {
      return {
        clauses: state.clauses.map((clause) => clause.id === id
          ? { ...clause, comments: [...clause.comments, comment] }
          : clause)
      }
    }
    return {
      contracts: state.contracts.map((contract) => contract.id === id
        ? { ...contract, comments: [...contract.comments, comment] }
        : contract)
    }
  })
}))
