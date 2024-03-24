const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const token = '6843064960:AAEzZv-hAyiV5P-mvxfei2SGT3Sbxzzxlag'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async chatId => {
	await bot.sendMessage(chatId, 'Отгадай число от 0 до 9')
	const randomNumber = Math.floor(Math.random() * 10)
	chats[chatId] = randomNumber
	await bot.sendMessage(chatId, `Отгадывай ${chats[chatId]}`, gameOptions)
}

const start = () => {
	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id

		bot.setMyCommands([
			{
				command: '/start',
				description: 'Приветствие'
			},
			{
				command: '/info',
				description: 'Выведение имени'
			},
			{
				command: '/game',
				description: 'Отгадай случайное число'
			}
		])
		if (text === '/start') {
			await bot.sendSticker(
				chatId,
				'https://tlgrm.ru/_/stickers/25d/f5a/25df5a18-cf79-4b3e-a2f1-4862771ebd1c/1.webp'
			)
			return bot.sendMessage(chatId, `Добро пожаловать `)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, msg.from.first_name)
		}

		if (text === '/game') {
			return startGame(chatId)
		}

		return bot.sendMessage(chatId, 'Не правильная команда')
	})

	bot.on('callback_query', msg => {
		const data = msg.data
		const chatId = msg.message.chat.id
		console.log(data)
		console.log(chats[chatId])

		if (data === '/again') {
			return startGame(chatId)
		}

		if (Number(data) === Number(chats[chatId])) {
			return bot.sendMessage(chatId, 'Правильно! Молодец!', againOptions)
		} else {
			return bot.sendMessage(
				chatId,
				`Не правильно, это была цифра ${chats[chatId]}. Попробуй еще раз :)`,
				againOptions
			)
		}
	})
}

start()
