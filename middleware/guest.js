export default function ({ store, redirect }) {
  console.log(store.state.auth.user)
  if (!store.state.auth.user) {
    return redirect('/login');
  }
}
