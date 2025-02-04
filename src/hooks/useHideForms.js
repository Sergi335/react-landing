import { useEffect } from 'react'

const useHideForms = ({ form, setFormVisible }) => {
  useEffect(() => {
    const handleHideFormOnClickOutside = (e) => {
      const tags = ['SPAN', 'svg', 'path', 'IMG']
      // console.log(e.target)
      // console.log('click')
      // console.log(form)
      // console.log(setFormVisible)
      if (e.target !== form && !tags.includes(e.target.nodeName) && !form?.contains(e.target)) {
        // console.log('entramos')
        setFormVisible(false)
      }
    }
    window.addEventListener('click', handleHideFormOnClickOutside)

    return () => {
      window.removeEventListener('click', handleHideFormOnClickOutside)
    }
  }, [form])
}

export default useHideForms
