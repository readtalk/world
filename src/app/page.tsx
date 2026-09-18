import { auth, login, logout } from "./actions"

export default async function Home() {
  const subject = await auth()
  return (
    <div>
      {subject ? (
        <>
          <p>Logged in as <code>{subject.properties.id}</code>.</p>
          <form action={logout}><button>Logout</button></form>
        </>
      ) : (
        <>
          <p>Login with your email and password.</p>
          <form action={login}><button>Login with OpenAuth</button></form>
        </>
      )}
    </div>
  )
}
