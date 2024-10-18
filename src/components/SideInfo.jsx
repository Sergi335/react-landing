import { useEffect, useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import useGoogleAuth from '../hooks/useGoogleAuth'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import { useSessionStore } from '../store/session'
import { SearchIcon } from './Icons/icons'
import Nav from './nav'
import styles from './SideInfo.module.css'
import Sideinfopaneltop from './Sideinfopaneltop'

export default function SideInfo ({ environment, className = 'listoflinks' }) {
  const { desktopName } = useParams()
  // const user = useSessionStore(state => state.user)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns.filter(column => column.escritorio.toLowerCase() === desktopName).toSorted((a, b) => a.orden - b.orden) // memo
  // const [desktopDisplayName, setDesktopDisplayName] = useState()
  const numberCols = Number(usePreferencesStore(state => state.numberOfColumns))
  const numRows = Math.ceil(desktopColumns.length / numberCols)
  const result = []

  const localClass = Object.hasOwn(styles, className) ? styles[className] : ''
  // const globalLoading = useGlobalStore(state => state.globalLoading)
  const sideInfoRef = useRef()

  const user = useSessionStore(state => state.user)
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const deleteConfFormVisible = useFormsStore(state => state.deleteConfFormVisible)
  const setDeleteConfFormVisible = useFormsStore(state => state.setDeleteConfFormVisible)
  const { handleGoogleLogOut } = useGoogleAuth()
  const location = useLocation()
  // console.log('🚀 ~ SideInfo ~ desktopColumnsIds:', desktopColumnsIds)

  // Agrupa las columnas del escritorio en funcion del numero de columnas seleccionado -> memo
  for (let i = 0; i < numRows; i++) {
    const startIdx = i * numberCols
    const row = [...desktopColumns].slice(startIdx, startIdx + numberCols)
    result.push(row)
  }

  // useEffect(() => {
  //   const newDeskName = (window.location.pathname).replace('/desktop/', '')
  //   const newDeskObject = desktopsStore.find(desk => desk.name === decodeURIComponent(newDeskName))
  //   setDesktopDisplayName(newDeskObject?.displayName)
  //   useTitle({ title: newDeskObject?.displayName })
  // }, [desktopsStore, desktopName])

  useEffect(() => {
    const sideBlocks = Array.from(document.querySelectorAll('.block'))
    const elements = sideBlocks?.map(el => (
      {
        el,
        mappedEls: Array.from(el.children).map(item => (document.getElementById((`${item.id}`).replace('Side', ''))))
      }
    ))
    const handleScroll = () => {
      // console.log(elements)
      if (elements === undefined || elements === null) return
      elements?.forEach(targ => {
        const props = targ.mappedEls.map(elem => (
          elem?.getBoundingClientRect()
        ))
        const elementTopPosition = props[0].top
        // si la posicion de la parte superior de la fila es mayor a 141 y menor a 1414 o la posicion bottom maxima de cada columna es mayor a 141 o menor a 1414
        if (Math.abs(elementTopPosition >= 77) && Math.abs(elementTopPosition <= 1141)) {
          targ.el.classList.add(`${styles.sectActive}`)
        } else {
          targ.el.classList.remove(`${styles.sectActive}`)
        }
      })
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [result])

  // const handleScrollIntoView = (event) => {
  //   event.preventDefault()
  //   const element = document.getElementById(`${event.target.id.replace('Side', '')}`)
  //   element.scrollIntoView({ block: 'center', behavior: 'smooth' })
  //   element.classList.add(`${styles.sideInfoSelectedCol}`)
  //   setTimeout(() => {
  //     element.classList.remove(`${styles.sideInfoSelectedCol}`)
  //   }, 1000)
  // }

  const toggleSearch = () => {
    const search = document.getElementById('searchForm')
    search.classList.toggle('show')
  }
  const handleChangeTheme = () => {
    const root = document.documentElement
    // if (window.matchMedia('prefers-color-scheme: dark').matches) {
    //   document.root.classList.add('dark')
    // }
    if (root.classList.contains('dark')) {
      root.classList.remove('dark')
      root.classList.add('light')
      // constants.DEFAULT_BACKGROUNDS.light.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('light'))
    } else if (root.classList.contains('light')) {
      root.classList.remove('light')
      root.classList.add('dark')
      // constants.DEFAULT_BACKGROUNDS.dark.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('dark'))
    } else {
      root.classList.add('dark')
      // constants.DEFAULT_BACKGROUNDS.dark.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('dark'))
    }
  }
  return (
      <div ref={sideInfoRef} id='sideinfo' className={`${styles.sideInfo} ${localClass}`}>
          <Sideinfopaneltop />
          <Nav />
          <section className={styles.bottom_controls}>
          <div className={styles.settings} onClick={toggleSearch}>
            <SearchIcon />
          </div>
          <div className={styles.settings} onClick={handleChangeTheme}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uiIcon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>

          </div>
          {
            location.pathname !== '/desktop/profile' && (
              <div className={styles.settings}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uiIcon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
              </svg>
              <div className={styles.bodcontrols}>
                <span id="addDesk" onClick={() => setAddDeskFormVisible(!addDeskFormVisible)}>
                  <svg className="uiIcon icofont-plus" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Añade escritorio</span>
                </span>
                <span id="selectLayout">
                  <svg className="uiIcon icofont-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"></path></svg>
                  <span>Cambiar vista</span>
                </span>
                <span id="removeDesk" onClick={() => setDeleteConfFormVisible(!deleteConfFormVisible)}>
                  <svg className="uiIcon icofont-recycle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
                  <span>Eliminar escritorio</span>
                </span>
              </div>
            </div>
            )
          }

            <Link to={'/profile'} className={styles.settingsImg}><img src={user.profileImage ? user.profileImage : '/img/avatar.svg' } alt={user.realName}/></Link>

          <div className={styles.settings} onClick={handleGoogleLogOut}>
            <svg className="uiIcon icofont-exit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"></path></svg>

          </div>
          </section>
              {/* {
                environment === 'listoflinks' && (
                  <div id="sectContainer" className={styles.sectContainer}>
                  {
                    globalLoading
                      ? <><SideInfoLoader className={styles.sectLoader}/><SideInfoLoader className={styles.sectLoader} /><SideInfoLoader className={styles.sectLoader} /></>
                      : (
                          result.map((subarray, index) => (
                          <div key={index} className={`${styles.sect} block`}>
                              {
                              subarray.map(column => (
                                      <a onClick={handleScrollIntoView} key={column._id} id={`Side${column._id}`}>{column.name}</a>
                              ))
                              }
                        </div>
                          ))
                        )

                  }
                  </div>
                )
              } */}

          </div>
  )
}
