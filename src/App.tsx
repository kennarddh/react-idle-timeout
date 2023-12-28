import { useEffect, useMemo, useState } from 'react'

import { useIdleTimer } from 'react-idle-timer'

const timeout = 10_000
const promptBeforeIdle = 4_000

enum IState {
	Active,
	Prompted,
	Idle,
}

const App = () => {
	const [State, SetState] = useState<IState>(IState.Active)
	const [RemainingTimeUntilIdle, SetRemainingTimeUntilIdle] =
		useState<number>(0)
	const [PromptOpen, SetPromptOpen] = useState<boolean>(false)

	const OnIdle = () => {
		SetState(IState.Idle)

		SetPromptOpen(false)
	}

	const OnActive = () => {
		SetState(IState.Active)

		SetPromptOpen(false)
	}

	const OnPrompt = () => {
		SetState(IState.Prompted)

		SetPromptOpen(true)
	}

	const { getRemainingTime, activate } = useIdleTimer({
		onIdle: OnIdle,
		onActive: OnActive,
		onPrompt: OnPrompt,
		timeout,
		promptBeforeIdle,
		throttle: 500,
	})

	useEffect(() => {
		const interval = setInterval(() => {
			SetRemainingTimeUntilIdle(Math.ceil(getRemainingTime() / 1000))
		}, 500)

		return () => clearInterval(interval)
	}, [getRemainingTime])

	const HandleStillHere = () => {
		activate()
	}

	const RemainingTimeUntilPropmt = useMemo(
		() => Math.max(RemainingTimeUntilIdle - promptBeforeIdle / 1000, 0),
		[RemainingTimeUntilIdle],
	)

	return (
		<>
			<h1>React Idle Timer</h1>
			<h2>Confirm Prompt</h2>
			<br />
			<p>Current State: {State}</p>
			{RemainingTimeUntilPropmt > 0 && (
				<p>
					{RemainingTimeUntilPropmt}{' '}
					{RemainingTimeUntilPropmt > 1 ? 'seconds' : 'second'} until
					prompt
				</p>
			)}
			<div
				className='modal'
				style={{
					display: PromptOpen ? 'flex' : 'none',
				}}
			>
				<h3>Are you still here?</h3>
				<p>Logging out in {RemainingTimeUntilIdle} seconds</p>
				<button onClick={HandleStillHere}>Im still here</button>
			</div>
		</>
	)
}

export default App
