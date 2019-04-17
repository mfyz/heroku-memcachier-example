const express = require('express')
const PORT = process.env.PORT || 4006

const memjs = require('memjs')
const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
	failover: true,  // default: false
	timeout: 1,      // default: 0.5 (seconds)
	keepAlive: true  // default: false
})

const app = express()

// some expensive calculation
const calculatePrime = (n) => {
	let prime = 1;
	for (let i = n; i > 1; i--) {
		let is_prime = true;
		for (let j = 2; j < i; j++) {
			if (i % j == 0) {
				is_prime = false;
				break;
			}
		}
		if (is_prime) {
			prime = i;
			break;
		}
	}
	return prime;
}

const getPrime = n => new Promise((resolve, reject) => {
	const primeKey = 'primeNumber' + n
	mc.get(primeKey, (err, val) => {
		if(err == null && val != null) {
			resolve(parseInt(val))
		}
		else {
			const primeNumber = calculatePrime(n)
			mc.set(primeKey, '' + primeNumber, { expires: 10 }, (err, val) => {
				if (err) console.log(err)
				resolve(primeNumber)
			})
		}
	})
})

app.get('/', (req, res) => {
	const start = new Date()
	const n = req.query.n || 2000000000
	getPrime(n).then((primeNumber) => {
		const took = new Date() - start
		res.send(`Largest prime smaller than ${n} is ${primeNumber}. Took ${took}ms to calculate.`)
	})
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))