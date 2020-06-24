const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const TWO_HOURS = 1000 * 60 * 60 *2

const {
	PORT =3000,
	NODE_ENV = 'developement',

	SESS_NAME = 'sid',
	SESS_SECRET = 'ssh!quiet,it\'asecret!',
	SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'

//TODO DB
const users = [
	{ id: 1, name: 'Alexandru', email: 'alexandru@gmail.com', password: 'secret'},
	{ id: 2, name: 'Andrei', email: 'andrei@gmail.com', password: 'secret'},
	{ id: 3, name: 'Ana', email: 'ana@gmail.com', password: 'secret'}
]

const app = express()

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(session({
	name: SESS_NAME,
	resave: false,
	saveUninitialized: false,
	secret: SESS_SECRET,
	cookie: {
		maxAge: SESS_LIFETIME,
		sameSite: true,
		secure: IN_PROD
	}
}))

const redirectLogin = (req, res, next) => {
	if (!req.session.userID) {
		res.redirect('/login')
	} else {
		next()
	}
}

const redirectHome = (req, res, next) => {
	if (req.session.userID) {
		res.redirect('/home')
	} else {
		next()
	}
}

app.use((req, res, next) => {
	const { userID } = req.session
	if(userID) {
		res.locals.user = users.find(
			user => user.id === userID
			)
	}
	next()
})

app.get('/', (req, res) => {
const { userID } = req.session

	res.send(`
	<h1>Welcome</h1>
	${userID ? `
	<a href='/home'>Home</a>
	<form method='post' action='/logout'>
		<button>Logout</button>
	</form>
	` : `
	<a href='/login'>Login</a>
	<a href='/register'>Register</a>
	`}
	`)
})

app.get('/home', redirectLogin, (req, res) => {
	const { user } = res.locals
	console.log(req.sessionID)
	console.log(req.session)
	res.send(`
	<h1>Home</h1>
	<a href='/'>Main</a>
	<ul>
		<li>Name: ${user.name}</li>
		<li>Email: ${user.email}</li>
	</ul>
	`)
})


app.get('/login', redirectHome, (req, res) => {
res.send(`
<h1>Login</h1>
<form method='post' action='/login'>
	<input type='email' name='email' placeholder='Email' required />
	<input type='password' name='password' placeholder='Password' required />
	<input type='submit' />
</form>
<a href='/register'>Register</a>
`)

})

app.get('/register', redirectHome, (req, res) => {
	res.send(`
<h1>Register</h1>
<form method='post' action='/register'>
	<input name='name' placeholder='Name' required />
	<input type='email' name='email' placeholder='Email' required />
	<input type='password' name='password' placeholder='Password' required />
	<input type='submit' />
</form>
<a href='/login'>Login</a>
`)
})

app.post('/login', redirectHome, (req, res) => {
	const { email, password } = req.body

	if (email && password) { //TODO validation
		const user = users.find( 
			user => user.email === email && user.password === password
		)

		if (user) {
			req.session.userID = user.id
			return res.redirect('/home')
		}
	}

	res.redirect('/login')
})

app.post('/register', redirectHome, (req, res) => {
	const { name, email, password } = req.body

	if (name && email && password) {//TODO validation
		const exists = users.some(
			user => user.email === email
		)

		if (!exists) {
			const user = {
				id: users.length + 1,
				name,
				email,
				password //TODO hash
			}

			users.push(user)

			req.session.userID = user.id

			return res.redirect('/home')
		}
	}

	res.redirect('/register') //TODO qs errors
})

app.post('/logout', redirectLogin, (req, res) => {
	req.session.destroy(err => {
		if (err) {
			return res.redirect('/home')
		}

		res.clearCookie(SESS_NAME)
		res.redirect('/login')
	})
})

app.listen(PORT, () => console.log(
	`http://localhost:${PORT}`
))

