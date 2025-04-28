import { configureStore } from '@reduxjs/toolkit'
import { shoppingListReducer } from './features/shopping/shoppingSlice'
import { appointmentsReducer } from './features/appointments/appointmentsSlice'
import { babyNamesReducer } from './features/babyNames/babyNamesSlice'
import { hospitalBagReducer } from './features/hospitalBag/hospitalBagSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      shoppingList: shoppingListReducer,
      appointments: appointmentsReducer,
      babyNames: babyNamesReducer,
      hospitalBag: hospitalBagReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch'] 