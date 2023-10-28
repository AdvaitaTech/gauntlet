<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Gauntlet" />
	<meta
		property="og:description"
		content="Gauntlet is a place for web developers to hone their craft"
	/>
	<meta property="og:url" content="gauntlet.advaita.co" />
</svelte:head>
<div class="px-20 py-10 bg-background-800 text-white-0">
	<div class="flex flex-col items-center">
		<h1 class="text-4xl text-center mt-[150px]">
			<span class="text-primary-800 font-bold">Gauntlet</span> is the place for developers <br /> to
			hone their craft
		</h1>
		<p class="mt-2 mb-12 text-xl text-center text-background-300">
			Meet the LeetCode for web development. Pick challenges, <br />learn technologies, and build
			products
		</p>
		<a class="px-10 py-3 bg-primary-800 rounded-3xl" href="/register">Get Started</a>
		<img
			class="mt-[200px] border border-primary-800"
			alt="Code Editor used to solve challenges"
			src="/challenge-page.png"
		/>
	</div>
	<div class="mt-[200px] flex flex-col items-center">
		<h1 class="text-4xl text-center mt-[150px]">Explore different development challenges</h1>
		<p class="mt-2 mb-12 text-xl text-center text-background-300">
			Pick from many rewarding challenges to learn and improve your skills
		</p>

		<div
			class="grid w-[500px] grid-cols-2 grid-rows-[50px_auto_50px] gap-2 p-5 flex-0 rounded-xl bg-background-900 border-primary-800 border"
		>
			<div class="col-span-2 text-xl font-bold">Todo List</div>
			<div class="col-span-2 overflow-hidden text-ellipsis text-md text-white-700 truncate-body">
				Build a todo list that helps a user manage their todos for the day. It have a <code
					>input</code
				>
				element that accepts text. There must be a button next to it with an id of
				<code>create-todo</code>. Once this button is clicked, the...
			</div>
			<div class="flex items-center text-sm">
				<div class="px-2 py-[1px] bg-background-800 rounded-2xl text-primary-600">Easy</div>
			</div>
			<div class="flex items-center justify-end text-primary-800 text-right font-semibold">
				Attempt >
			</div>
		</div>
	</div>
	<div class="mt-[200px] flex flex-col items-center">
		<h1 class="text-4xl text-center mt-[150px]">Preview and submit your code</h1>
		<p class="mt-2 mb-12 text-xl text-center text-background-300">
			Receive scores based on how well you pass the acceptance criteria for each challenge
		</p>
		<div class="w-[500px] rounded-xl border border-primary-800 bg-background-950">
			<div
				role="table"
				id="runs-table"
				class="grid grid-cols-[1fr_auto_auto_auto] grid-rows-1 auto-rows-auto"
			>
				<div
					role="columnheader"
					class="p-2 border-r border-r-background-700 text-left font-bold border-b border-b-background-400"
				>
					Status
				</div>
				<div
					role="columnheader"
					class="p-2 border-r border-r-background-700 text-left font-bold border-b border-b-background-400"
				>
					Tests
				</div>
				<div
					role="columnheader"
					class="p-2 border-r border-r-background-700 text-left font-bold border-b border-b-background-400"
				>
					Language
				</div>
				<div role="columnheader" class="p-2 text-left font-bold border-b border-b-background-400">
					Environment
				</div>

				<!-- Run 1 -->
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400 text-primary-600"
				>
					Accepted
				</div>
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400"
				>
					3/3
				</div>
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400"
				>
					Javascript
				</div>
				<div role="cell" class="px-2 py-1 text-left border-b border-b-background-400">React</div>

				<!-- Run 2 -->
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400 text-red-600"
				>
					Failed
				</div>
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400"
				>
					1/3
				</div>
				<div
					role="cell"
					class="px-2 py-1 border-r border-background-600 text-left border-b border-b-background-400"
				>
					Javascript
				</div>
				<div role="cell" class="px-2 py-1 text-left border-b border-b-background-400">React</div>

				<!-- Run 3 -->
				<div role="cell" class="px-2 py-1 border-r border-background-600 text-left">
					Runtime Error
				</div>
				<div role="cell" class="px-2 py-1 border-r border-background-600 text-left">0/3</div>
				<div role="cell" class="px-2 py-1 border-r border-background-600 text-left">Javascript</div>
				<div role="cell" class="px-2 py-1 text-left">React</div>
			</div>
		</div>
	</div>
	<div class="mt-[200px] flex flex-col items-center mb-[400px]">
		<h1 class="text-4xl text-center mt-[150px]">Created for Builders.</h1>
		<h1 class="text-4xl text-center">In Beta.</h1>
		<a class="mt-10 px-10 py-3 bg-primary-800 rounded-3xl" href="/register">Sign up for free</a>
	</div>
</div>
