import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock Firebase
import { vi } from 'vitest'

Object.defineProperty(globalThis, 'firebase', {
  value: {
    auth: vi.fn(() => ({
      currentUser: null,
      onAuthStateChanged: vi.fn(callback => {
        callback(null)
        return vi.fn()
      }),
      signInWithEmailAndPassword: vi.fn(),
      createUserWithEmailAndPassword: vi.fn(),
      signOut: vi.fn()
    })),
    firestore: vi.fn(() => ({
      collection: vi.fn(() => ({
        doc: vi.fn(() => ({
          get: vi.fn(),
          set: vi.fn(),
          update: vi.fn(),
          delete: vi.fn()
        })),
        add: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
      }))
    })),
    storage: vi.fn(() => ({
      ref: vi.fn(() => ({
        uploadBytes: vi.fn(),
        getDownloadURL: vi.fn()
      }))
    }))
  },
  writable: true
})

// Mock MSW - using server instead of worker for Node/jsdom environment
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

const server = setupServer(...handlers)

beforeAll(async () => {
  await server.listen({
    onUnhandledRequest: 'bypass'
  })
})

afterAll(async () => {
  await server.close()
})

// Mock IntersectionObserver
Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
})

// Mock ResizeObserver
Object.defineProperty(globalThis, 'ResizeObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
})

// Mock matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock window.scrollTo
Object.defineProperty(globalThis, 'scrollTo', {
  value: vi.fn()
})
