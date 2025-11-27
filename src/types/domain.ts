export type ClauseStatus = 'Створено' | 'Перевірено юристом' | 'Визнано типовим' | 'Одноразово погоджено'

export interface ClauseVersion {
  id: string
  text: string
  updatedAt: string
  editor: string
}

export interface ClauseComment {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface Clause {
  id: string
  text: string
  type: string
  tags: string[]
  author: string
  reviewer?: string
  createdAt: string
  updatedAt: string
  status: ClauseStatus
  versions: ClauseVersion[]
  comments: ClauseComment[]
}

export type ContractStatus = 'Створено' | 'На погодженні' | 'Погоджено юристом'
export type ManualContractStatus = 'Погоджено начальником ЮО' | 'Підписано'

export interface ContractVersion {
  id: string
  createdAt: string
  author: string
  clauseIds: string[]
  manualStatus?: ManualContractStatus
}

export interface ContractComment {
  id: string
  author: string
  text: string
  createdAt: string
}

export interface Contract {
  id: string
  title: string
  clauseIds: string[]
  status: ContractStatus
  manualStatus?: ManualContractStatus
  approver: string
  author: string
  createdAt: string
  updatedAt: string
  comments: ContractComment[]
  versions: ContractVersion[]
}

export type Role = 'Співробітник' | 'Юрист' | 'Адміністратор'

export interface User {
  id: string
  name: string
  role: Role
}
