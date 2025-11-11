import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export const useAppSelector = (selector: (state: RootState) => any) => useSelector(selector)
