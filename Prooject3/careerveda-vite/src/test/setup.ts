import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock Firebase
import { jest } from 'vitest'

Object.defineProperty(globalThis, 'firebase', {
  value: {
    auth: jest.fn(() => ({
      currentUser: null,
      onAuthStateChanged: jest.fn(callback => {
        callback(null)
        return jest.fn()
      }),
      signInWithEmailAndPassword: jest.fn(),
      createUserWithEmailAndPassword: jest.fn(),
      signOut: jest.fn()
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          set: jest.fn(),
          update: jest.fn(),
          delete: jest.fn()
        })),
        add: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }))
    })),
    storage: jest.fn(() => ({
      ref: jest.fn(() => ({
        uploadBytes: jest.fn(),
        getDownloadURL: jest.fn()
      }))
    }))
  },
  writable: true
})

// Mock MSW
import { setupWorker } from 'msw'
import { handlers } from './src/test/handlers'

const worker = setupWorker(...handlers)

beforeAll(async () => {
  await worker.start({
    onUnhandledRequest: 'bypass'
  })
})

afterAll(async () => {
  await worker.stop()
})

// Mock IntersectionObserver
Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
})

// Mock ResizeObserver
Object.defineProperty(globalThis, 'ResizeObserver', {
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
})

// Mock matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// Mock window.scrollTo
Object.defineProperty(globalThis, 'scrollTo', {
  value: jest.fn()
})
