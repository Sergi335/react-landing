import { useEffect, useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createColumn } from '../../services/dbQueries'
import { useDesktopsStore } from '../../store/desktops'
import { useFormsStore } from '../../store/forms'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
import columnStyles from '../Column.module.css'
import { AddColumnIcon, AddDesktopIcon, ChangeLayoutIcon, EditDeskIcon, ExpandHeightIcon, HidePanels, MenuIcon, SearchIcon, SettingsIcon, TrashIcon } from '../Icons/icons'
import DesktopNameDisplay from './DesktopNameDisplay'
import styles from './Header.module.css'

export default function ToolBar () {
  const { desktopName } = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns.filter(column => column.escritorio.toLowerCase() === desktopName).toSorted((a, b) => a.orden - b.orden) // memo
  const desktopColumnsIds = desktopColumns.map(col => col._id)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  const setOpenedColumns = usePreferencesStore(state => state.setOpenedColumns)
  const openFlag = useRef(false)
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const desktop = desktopsStore.find(desk => desk.name === desktopName) // memo
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const deleteConfFormVisible = useFormsStore(state => state.deleteConfFormVisible)
  const setDeleteConfFormVisible = useFormsStore(state => state.setDeleteConfFormVisible)
  const location = useLocation()
  const isDesktopLocation = location.pathname !== '/profile' && location.pathname !== '/readinglist'
  const searchBoxVisible = useFormsStore(state => state.searchBoxVisible)
  const setSearchBoxVisible = useFormsStore(state => state.setSearchBoxVisible)

  useEffect(() => {
    const setTheme = (e) => {
      console.log('cambio de tema detectado')
      const root = document.documentElement
      if (e.matches) {
        root.classList.add('dark')
        root.classList.remove('light')
        window.localStorage.setItem('theme', JSON.stringify('dark'))
        console.log('dark mode desde el header')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
        window.localStorage.setItem('theme', JSON.stringify('light'))
        console.log('light mode desde el header')
      }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme)

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setTheme)
    }
  }, [])

  const toggleMobileMenu = () => {
    const menu = document.getElementById('mobileMenu')
    menu.classList.toggle(styles.show)
  }
  const handleAddColumn = async () => {
    if (desktop === undefined) {
      toast.error('Debes crear un escritorio primero')
      return
    }
    const response = await createColumn({ name: 'New Column', escritorio: desktop.name, order: desktopColumns.length })
    const { column } = response
    setGlobalColumns((() => { return [...globalColumns, ...column] })())
  }
  const handleHideColumns = (e) => {
    e.currentTarget.classList.contains(styles.icon_clicked)
      ? e.currentTarget.classList.remove(styles.icon_clicked)
      : e.currentTarget.classList.add(styles.icon_clicked)
    const container = document.getElementById('maincontent')
    container.style.display === 'none' ? container.style.display = 'grid' : container.style.display = 'none'
  }
  const handleExpandAllColumns = (e) => {
    e.currentTarget.classList.contains(styles.icon_clicked)
      ? e.currentTarget.classList.remove(styles.icon_clicked)
      : e.currentTarget.classList.add(styles.icon_clicked)
    const columns = document.querySelectorAll(`.${columnStyles.columnWrapper}`)
    const newState = [...desktopColumnsIds]
    // Si el flag está en false significa que está en 'off' o cerrado y hay que abrir todas
    if (!openFlag.current) {
      columns.forEach((column) => {
        if (!column.classList.contains(columnStyles.colOpen)) {
          column.classList.add(columnStyles.colOpen)
        }
      })
      openFlag.current = true
      setOpenedColumns(newState)
      return
    }
    // Si está en true están abiertas y hay que cerrarlas todas
    if (openFlag.current) {
      columns.forEach((column, index) => {
        if (column.classList.contains(columnStyles.colOpen)) {
          column.classList.remove(columnStyles.colOpen)
        }
        setTimeout(() => { // --> Está esperando a la animación para poder ocultar los links
          openFlag.current = false
          setOpenedColumns([])
        }, 300)
      })
    }
  }
  const handleShowSearch = () => {
    setSearchBoxVisible(!searchBoxVisible)
  }
  const handleShowAddDesktop = () => {
    setAddDeskFormVisible(!addDeskFormVisible)
  }
  const handleShowDeleteDesktop = () => {
    setDeleteConfFormVisible(!deleteConfFormVisible)
  }
  return (
    <aside className={styles.sideControl}>
      <div className={styles.logo_container}>
        <Link className={styles.logo} to={'/'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
          <div className={styles.logoText}>
            <span>ZenMarks</span>
          </div>
        </Link>
        <button className={styles.mobile_menu_button} onClick={toggleMobileMenu}>
          <MenuIcon className={styles.mobile_menu} />
        </button>
      </div>
      <DesktopNameDisplay />
    {

        <div className={styles.deskInfos_controls}>
          {
            isDesktopLocation && (
              <button className={styles.sideButtons} onClick={handleHideColumns}>
                <HidePanels className={styles.uiIcon} id={'hidePanels'} />
              </button>
            )
          }
          <button className={styles.sideButtons} onClick={() => { setCustomizePanelVisible(!customizePanelVisible) }}>
            <EditDeskIcon className={styles.uiIcon} id={'editDesk'} />
          </button>
          {
            isDesktopLocation &&
            (
              <>
                <button className={styles.sideButtons} onClick={handleAddColumn}>
                  <AddColumnIcon className={styles.uiIcon} id={'addCol'} />
                </button>
                <button className={styles.sideButtons} onClick={handleExpandAllColumns}>
                  <ExpandHeightIcon className={styles.uiIcon} />
                </button>
              </>
            )
          }
          <button className={styles.sideButtons} onClick={handleShowSearch}>
            <SearchIcon />
          </button>
          {
            isDesktopLocation && (
              <div className={`${styles.settings} ${styles.sideButtons}`}>
                <SettingsIcon />
                <div className={styles.sidebar_inner_controls}>
                  <span onClick={handleShowAddDesktop}>
                    <AddDesktopIcon />
                    <span>Añade escritorio</span>
                  </span>
                  <span>
                    <ChangeLayoutIcon />
                    <span>Cambiar vista</span>
                  </span>
                  <span onClick={handleShowDeleteDesktop}>
                    <TrashIcon />
                    <span>Eliminar escritorio</span>
                  </span>
                </div>
            </div>
            )
          }

        </div>

    }
  </aside>
  )
}
