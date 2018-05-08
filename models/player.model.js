export const createPlayer = (user) => {
  return {
    user: user,
    faction: undefined,
    hitler: false,
    president: false,
    chancellor: false,
    executed: false
  }
}