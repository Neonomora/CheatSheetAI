import useRedirect from '../hooks/useRedirect'

export default function NavigationGuard({ navigation }) {
  useRedirect(navigation, 500)
  return null
}