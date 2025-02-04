import { create } from 'zustand'
import { constants } from '../services/constants'

export const usePreferencesStore = create(
  (set) => {
    return {
      activeLocalStorage: false,
      setActiveLocalStorage: (activeLocalStorage) => {
        set({ activeLocalStorage })
      },
      numberOfColumns: localStorage.getItem('numberOfColumns') ? JSON.parse(localStorage.getItem('numberOfColumns')) : 4,
      setNumberOfColumns: (numberOfColumns) => {
        set({ numberOfColumns })
      },
      styleOfColumns: localStorage.getItem('styleOfColumns') ? JSON.parse(localStorage.getItem('styleOfColumns')) : constants.COLUMNS_COUNT[4],
      setStyleOfColumns: (styleOfColumns) => {
        set({ styleOfColumns })
      },
      limit: 0,
      setLimit: (limit) => {
        set({ limit })
      },
      selectModeGlobal: false,
      setSelectModeGlobal: (selectModeGlobal) => {
        set({ selectModeGlobal })
      },
      columnSelectModeId: [],
      setColumnSelectModeId: (columnSelectModeId) => {
        set({ columnSelectModeId })
      },
      selectedLinks: [],
      setSelectedLinks: (selectedLinks) => {
        set({ selectedLinks })
      },
      columnHeights: [],
      setColumnHeights: (columnHeights) => {
        set({ columnHeights })
      },
      openedColumns: [],
      setOpenedColumns: (openedColumns) => {
        set({ openedColumns })
      },
      globalOpenColumns: false,
      setGlobalOpenColumns: (globalOpenColumns) => {
        set({ globalOpenColumns })
      }
    }
  }
)
