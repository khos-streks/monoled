import { create } from 'zustand'
import { ISortingMethod } from './shop.types'

interface State {
	currentSortingId: ISortingMethod['id']
	setCurrentSortingId: (id: number) => void
	productsPerPage: number
	setProductPerPage: (quantity: number) => void
	currentPage: number
	setCurrentPage: (page: number) => void
	currentShowMode: 'grid' | 'list'
	setCurrentShowMode: (showMode: 'grid' | 'list') => void
	totalPages: number
	setTotalPages: (totalPages: number) => void
}

export const useShopStore = create<State>(set => ({
	currentSortingId: 1,
	setCurrentSortingId: id => set({ currentSortingId: id }),
	productsPerPage: 25,
	setProductPerPage: quantity => set({ productsPerPage: quantity }),
	currentShowMode: 'grid',
	setCurrentShowMode: showMode => set({ currentShowMode: showMode }),
	currentPage: 1,
	setCurrentPage: page => set({ currentPage: page }),
	totalPages: 1,
	setTotalPages: totalPages => set({ totalPages })
}))
