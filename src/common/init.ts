import { Entries } from 'type-fest/source/entries'
import { PartialObjectDeep } from 'type-fest/source/partial-deep'
import { State, StateAction } from '../@types/typings'

export default function setInitialState (state: State, setState: React.Dispatch<StateAction<PartialObjectDeep<State>>>): void {
  const entries = Object.entries(state) as Entries<State>
  return entries.forEach(([type, data]) => setState({ type, data }))
}
