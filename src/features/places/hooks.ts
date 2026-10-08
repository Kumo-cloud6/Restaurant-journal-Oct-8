import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  getCuisines,
  getExperienceTags,
  getPlaceById,
  getPlaces,
  searchPlaces,
  type PlaceFilters,
} from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'

export const usePlaces = (filters: PlaceFilters) =>
  useQuery({
    queryKey: queryKeys.places.list(filters),
    queryFn: () => getPlaces(filters),
    placeholderData: keepPreviousData,
  })

export const usePlace = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.places.detail(id ?? ''),
    queryFn: () => getPlaceById(id!),
    enabled: Boolean(id),
  })

export const usePlaceSearch = (query: string) =>
  useQuery({
    queryKey: queryKeys.places.search(query),
    queryFn: () => searchPlaces(query),
    placeholderData: keepPreviousData,
  })

export const useCuisines = () =>
  useQuery({
    queryKey: queryKeys.places.cuisines,
    queryFn: getCuisines,
    staleTime: Infinity,
  })

export const useExperienceTags = () =>
  useQuery({ queryKey: queryKeys.tags, queryFn: getExperienceTags, staleTime: Infinity })
