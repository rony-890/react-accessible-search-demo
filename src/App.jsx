import { useEffect, useRef, useState } from 'react'

const sampleEntries = [
  {
    number: '01',
    category: 'Control names',
    title: 'Name the search trigger',
    description: 'Give an icon-only button a short name that explains what it opens.',
    keywords: 'button label screen reader icon',
  },
  {
    number: '02',
    category: 'Forms',
    title: 'Label the search field',
    description: 'Keep a visible label connected to the input, even when a hint is nearby.',
    keywords: 'input label form hint',
  },
  {
    number: '03',
    category: 'Feedback',
    title: 'Announce the result count',
    description: 'Use a polite status message when submitted search results change.',
    keywords: 'live region status result count',
  },
  {
    number: '04',
    category: 'Keyboard use',
    title: 'Keep search usable without a pointer',
    description: 'Submit with Enter, move with Tab, and make focus easy to see.',
    keywords: 'keyboard enter tab focus',
  },
  {
    number: '05',
    category: 'Recovery',
    title: 'Explain an empty result',
    description: 'Say when nothing matches and give people a useful next step.',
    keywords: 'empty no matches recovery',
  },
]

const baseUrl = import.meta.env.BASE_URL
const repositoryUrl = 'https://github.com/rony-890/react-accessible-search-demo'

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href={baseUrl}>React <span>/ Accessible search</span></a>
      <nav aria-label="Page navigation">
        <a href="#search-demo">Search demo</a>
        <a href="#scope">What this shows</a>
      </nav>
    </header>
  )
}

function GeneralSearchDemo() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(sampleEntries)
  const [resultsFor, setResultsFor] = useState('')
  const [phase, setPhase] = useState('ready')
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function runSearch(value = query) {
    const searchTerm = value.trim()
    setResultsFor(searchTerm)
    setPhase('loading')
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      const normalizedTerm = searchTerm.toLocaleLowerCase()
      setResults(
        sampleEntries.filter((entry) =>
          `${entry.category} ${entry.title} ${entry.description} ${entry.keywords}`
            .toLocaleLowerCase()
            .includes(normalizedTerm),
        ),
      )
      setPhase('ready')
    }, 180)
  }

  function submitSearch(event) {
    event.preventDefault()
    runSearch()
  }

  function previewError() {
    window.clearTimeout(timerRef.current)
    setResultsFor(query.trim())
    setPhase('error')
  }

  const resultMessage = resultsFor
    ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${resultsFor}”.`
    : `Showing all ${results.length} example entries.`

  return (
    <section className="search-workspace" id="search-demo" aria-labelledby="search-demo-title">
      <div className="workspace-intro">
        <p className="section-index">01 / Local search</p>
        <h2 id="search-demo-title">Search a small library of patterns.</h2>
        <p>Try a term such as “keyboard”, “label”, or “empty”.</p>
      </div>

      <div className="workspace-content">
        <form className="search-form" onSubmit={submitSearch}>
          <label htmlFor="library-query">Search the example library</label>
          <p className="field-help" id="library-query-help">
            Searches sample entries stored on this page. No request is sent.
          </p>
          <div className="search-row">
            <input
              id="library-query"
              name="query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-describedby="library-query-help"
              autoComplete="off"
              required
            />
            <button className="button-primary" type="submit">Search</button>
          </div>
        </form>

        <div className="results-heading">
          <h3>Example entries</h3>
          <p className="result-status" role="status" aria-live="polite" aria-atomic="true">
            {phase === 'loading' ? 'Searching the local examples…' : resultMessage}
          </p>
        </div>

        {phase === 'error' ? (
          <div className="error-state" role="alert">
            <div>
              <h4>Example error state</h4>
              <p>The sample search is unavailable. Try again when you are ready.</p>
            </div>
            <button className="button-secondary" type="button" onClick={() => runSearch()}>
              Retry search
            </button>
          </div>
        ) : results.length > 0 ? (
          <ul className="result-list" aria-busy={phase === 'loading'}>
            {results.map((entry) => (
              <li className="result-item" key={entry.number}>
                <span className="result-number" aria-hidden="true">{entry.number}</span>
                <article>
                  <p className="result-category">{entry.category}</p>
                  <h4>{entry.title}</h4>
                  <p>{entry.description}</p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <h4>No matching entries</h4>
            <p>Try a broader term, such as “search” or “keyboard”.</p>
          </div>
        )}

        <details className="state-preview">
          <summary>Preview the recovery state</summary>
          <p>This shows an example error state; it does not disconnect a service.</p>
          <button className="button-secondary" type="button" onClick={previewError}>
            Show example error
          </button>
        </details>
      </div>
    </section>
  )
}

function GeneralDemo() {
  return (
    <>
      <section className="general-intro" aria-labelledby="page-title">
        <div className="intro-aside">
          <p className="breadcrumb">React demo / Accessible search</p>
          <p className="aside-caption">A small, runnable example.</p>
        </div>
        <div className="intro-main">
          <h1 id="page-title">Make search easier to ask for.</h1>
          <p className="intro-copy">
            A general example of labeled search, clear results, and useful feedback.
          </p>
        </div>
      </section>

      <GeneralSearchDemo />

      <section className="scope-section" id="scope" aria-labelledby="scope-title">
        <div>
          <p className="section-index">What this shows</p>
          <h2 id="scope-title">Useful patterns, without a service behind them.</h2>
        </div>
        <div>
          <p>The form has a visible label and help text, a clear Search action, and result feedback announced as it changes. Enter submits the form; keyboard focus remains visible.</p>
          <p>Five sample entries power the local search. Loading, empty, and error states are demonstrations; there is no API connection or client-specific content.</p>
        </div>
      </section>
    </>
  )
}

export default function App() {
  useEffect(() => {
    document.title = 'React Accessible Search Demo'
  }, [])

  return (
    <div className="page-shell" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <GeneralDemo />
      </main>
      <footer className="site-footer">
        <p>React accessible search demo · Local sample data · No search requests</p>
        <a href={repositoryUrl} target="_blank" rel="noreferrer">View source on GitHub</a>
      </footer>
    </div>
  )
}
