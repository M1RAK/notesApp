import express from 'express'
const app = express()

let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		date: '2022-01-10T17:30:31.098Z',
		important: true
	},
	{
		id: 2,
		content: 'Browser can execute only Javascript',
		date: '2022-01-10T18:39:34.091Z',
		important: false
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		date: '2022-01-10T19:20:14.298Z',
		important: true
	}
]

app.use(express.json())
app.use(express.static('dist'))

const generateId = () => {
	const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0
	return maxId + 1
}

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
	res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
	const id = parseInt(request.params.id)
	const note = notes.find((note) => note.id === id)

	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
})

app.post('/api/notes', (request, response) => {
	const { content, important } = request.body

	if (!content) {
		return response.status(400).json({
			error: 'content missing...'
		})
	}

	const Note = {
		content,
		important,
		date: new Date(),
		id: generateId()
	}

	notes = notes.concat(Note)
	response.json(Note)
})

app.put('/api/notes/:id', (request, response) => {
	const { content, important } = request.body
	const id = parseInt(request.params.id)
	let note = notes.find((note) => note.id === id)

	if (!content) {
		return response.status(400).json({
			error: 'content missing'
		})
	}

	let updatedNote = {
		content,
		important,
		date: new Date(),
		id
	}

	if (note) {
		notes = notes.map((note) => (note.id === id ? updatedNote : note))
		response.json(updatedNote)
	} else {
		response.json({ error: 'Failed to update note...' })
	}
	console.log(note)
})

app.delete('/api/notes/:id', (request, response) => {
	const id = parseInt(request.params.id)
	notes = notes.filter((note) => note.id !== id)

	response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
