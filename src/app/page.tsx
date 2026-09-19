import { auth, login, logout } from "./actions";

export default async function Home() {
	const subject = await auth();

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				{subject ? (
					<>
						<p>
							Logged in as <code>{subject.properties.id}</code>.
						</p>
						<form action={logout}>
							<button className="rounded-full bg-red-600 text-white px-6 py-3 font-semibold">
								Logout
							</button>
						</form>
					</>
				) : (
					<>
						<p>Login with your email and password.</p>
						<form action={login}>
							<button className="rounded-full bg-red-600 text-white px-6 py-3 font-semibold">
								Login with OpenAuth
							</button>
						</form>
					</>
				)}
			</main>
		</div>
	);
}
