import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'

// Ambil filter dari subcollection Firestore
export const getFilters = async (category) => {
  try {
    const itemsRef = collection(db, 'filters', category, 'items')
    const q = query(itemsRef, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting filters:', error)
    return []
  }
}