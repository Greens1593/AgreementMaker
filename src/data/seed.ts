import dayjs from 'dayjs'
import { type Clause, type Contract, type User } from '../types/domain'

const now = dayjs()

export const users: User[] = [
  { id: 'u1', name: 'Оксана', role: 'Співробітник' },
  { id: 'u2', name: 'Ігор', role: 'Юрист' },
  { id: 'u3', name: 'Марія', role: 'Адміністратор' }
]

export const clauses: Clause[] = [
  {
    id: 'c1',
    text: 'Постачальник зобов’язується поставити товар належної якості у строки, визначені договором.',
    type: 'Поставка',
    tags: ['#договір_поставки', '#типовий', '#перевірив_Ігор'],
    author: 'Оксана',
    reviewer: 'Ігор',
    createdAt: now.subtract(20, 'day').toISOString(),
    updatedAt: now.subtract(7, 'day').toISOString(),
    status: 'Визнано типовим',
    versions: [
      {
        id: 'v1',
        text: 'Постачальник зобов’язується поставити товар належної якості.',
        updatedAt: now.subtract(10, 'day').toISOString(),
        editor: 'Ігор'
      },
      {
        id: 'v2',
        text: 'Постачальник зобов’язується поставити товар належної якості у строки, визначені договором.',
        updatedAt: now.subtract(7, 'day').toISOString(),
        editor: 'Ігор'
      }
    ],
    comments: [
      {
        id: 'cm1',
        author: 'Ігор',
        text: 'Додано уточнення щодо строків.',
        createdAt: now.subtract(7, 'day').toISOString()
      }
    ]
  },
  {
    id: 'c2',
    text: 'Оплата здійснюється протягом 10 банківських днів після отримання рахунку-фактури.',
    type: 'Оплата',
    tags: ['#передплата', '#перевірив_Ігор'],
    author: 'Оксана',
    reviewer: 'Ігор',
    createdAt: now.subtract(14, 'day').toISOString(),
    updatedAt: now.subtract(5, 'day').toISOString(),
    status: 'Перевірено юристом',
    versions: [
      {
        id: 'v1',
        text: 'Оплата здійснюється протягом 15 банківських днів після отримання рахунку-фактури.',
        updatedAt: now.subtract(12, 'day').toISOString(),
        editor: 'Ігор'
      },
      {
        id: 'v2',
        text: 'Оплата здійснюється протягом 10 банківських днів після отримання рахунку-фактури.',
        updatedAt: now.subtract(5, 'day').toISOString(),
        editor: 'Ігор'
      }
    ],
    comments: []
  },
  {
    id: 'c3',
    text: 'Сторони зберігають конфіденційність інформації протягом 3 років після завершення договору.',
    type: 'Конфіденційність',
    tags: ['#одноразове', '#автор_Марія'],
    author: 'Марія',
    reviewer: 'Ігор',
    createdAt: now.subtract(8, 'day').toISOString(),
    updatedAt: now.subtract(3, 'day').toISOString(),
    status: 'Одноразово погоджено',
    versions: [
      {
        id: 'v1',
        text: 'Сторони зберігають конфіденційність інформації.',
        updatedAt: now.subtract(6, 'day').toISOString(),
        editor: 'Марія'
      },
      {
        id: 'v2',
        text: 'Сторони зберігають конфіденційність інформації протягом 3 років після завершення договору.',
        updatedAt: now.subtract(3, 'day').toISOString(),
        editor: 'Ігор'
      }
    ],
    comments: []
  }
]

export const contracts: Contract[] = [
  {
    id: 'ct1',
    title: 'Поставка офісних матеріалів',
    clauseIds: ['c1', 'c2'],
    status: 'Погоджено юристом',
    manualStatus: 'Погоджено начальником ЮО',
    approver: 'Ігор',
    author: 'Оксана',
    createdAt: now.subtract(6, 'day').toISOString(),
    updatedAt: now.subtract(1, 'day').toISOString(),
    comments: [
      {
        id: 'ctc1',
        author: 'Ігор',
        text: 'Уточнив строки оплати.',
        createdAt: now.subtract(5, 'day').toISOString()
      }
    ],
    versions: [
      {
        id: 'ctv1',
        createdAt: now.subtract(6, 'day').toISOString(),
        author: 'Оксана',
        clauseIds: ['c1']
      },
      {
        id: 'ctv2',
        createdAt: now.subtract(3, 'day').toISOString(),
        author: 'Оксана',
        clauseIds: ['c1', 'c2'],
        manualStatus: 'Погоджено начальником ЮО'
      }
    ]
  }
]
