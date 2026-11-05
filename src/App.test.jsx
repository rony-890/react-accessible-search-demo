// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'

let root

globalThis.IS_REACT_ACT_ENVIRONMENT = true

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>'
  history.replaceState(null, '', '/')
  root = createRoot(document.getElementById('root'))
})

afterEach(async () => {
  await act(async () => root.unmount())
  document.body.innerHTML = ''
  history.replaceState(null, '', '/')
})

async function renderApp() {
  await act(async () => root.render(<App />))
}

function setInputValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('general accessible-search demo', () => {
  it('associates a visible label and help text with the search field', async () => {
    await renderApp()
    const input = document.querySelector('#library-query')
    expect(input.labels[0].textContent).toBe('Search the example library')
    expect(input.getAttribute('aria-describedby')).toBe('library-query-help')
    expect(document.querySelector('.button-primary').textContent).toBe('Search')
  })

  it('announces matching local results after submission', async () => {
    await renderApp()
    const input = document.querySelector('#library-query')
    const form = input.closest('form')

    await act(async () => {
      setInputValue(input, 'keyboard')
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })
    expect(document.querySelector('[role="status"]').textContent).toBe('Searching the local examples…')

    await act(async () => new Promise((resolve) => window.setTimeout(resolve, 220)))
    expect(document.querySelector('[role="status"]').textContent).toBe('1 result for “keyboard”.')
    expect(document.querySelector('.result-list').textContent).toContain('Keep search usable without a pointer')
  })

  it('shows a useful empty state when no sample entry matches', async () => {
    await renderApp()
    const input = document.querySelector('#library-query')

    await act(async () => {
      setInputValue(input, 'not-in-this-library')
      input.closest('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      await new Promise((resolve) => window.setTimeout(resolve, 220))
    })

    expect(document.querySelector('.empty-state h4').textContent).toBe('No matching entries')
    expect(document.querySelector('[role="status"]').textContent).toBe('0 results for “not-in-this-library”.')
  })

  it('shows a labeled example error and a working retry action', async () => {
    await renderApp()
    await act(async () => {
      document.querySelector('.state-preview summary').click()
      document.querySelector('.state-preview button').click()
    })
    expect(document.querySelector('[role="alert"]').textContent).toContain('Example error state')

    await act(async () => document.querySelector('.error-state button').click())
    expect(document.querySelector('[role="status"]').textContent).toBe('Searching the local examples…')
  })

  it('links only to existing demo sections and the public source repository', async () => {
    await renderApp()
    const navigationLinks = [...document.querySelectorAll('.site-header nav a')]
    expect(navigationLinks.map((link) => link.getAttribute('href'))).toEqual(['#search-demo', '#scope'])
    expect(document.getElementById(navigationLinks[0].hash.slice(1))).toBeTruthy()
    expect(document.getElementById(navigationLinks[1].hash.slice(1))).toBeTruthy()
    expect(document.querySelector('.site-footer a').href).toBe('https://github.com/rony-890/react-accessible-search-demo')
  })
})
