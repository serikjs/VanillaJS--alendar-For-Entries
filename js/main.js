const minTimes = '0:10'

const app = new Vue({
	el: '#app',
	data: {
		settings: {
			worksDay: [0, 1, 2, 3, 4],
			startWorkTime: '8:20',
			endWorkTime: '17:00',
			workTypes: [
				{
					name: 'Простой',
					time: '1:00',
				},
				{
					name: 'Средний',
					time: '1:30',
				},
				{
					name: 'Сложный',
					time: '2:00',
				},
			],
			clientsDelay: '0:20',
		},

		dataCalendar: {
			'Tue Jan 31 2023': [
				{
					end: new Date(
						'Tue Jan 31 2023 10:20:00 GMT+0300 (за московським стандартним часом)'
					),
					name: 'Serhii',
					start: new Date(
						'Tue Jan 31 2023 09:20:00 GMT+0300 (за московським стандартним часом)'
					),
					tel: '380665916260',
					time: '1:00',
					type: 'Простой',
				},
			],
		},

		thisDate: null,
		currentMonth: null,

		calendarPosition: 0,
		calendar: [],
		prevCalendar: [],
		nextCalendar: [],

		clickedDate: null,

		workTimes: {},

		showDayPopap: false,
		popapStep: 0,
		personDataType: null,
		personDataTime: null,
		personDataName: '',
		personDataTel: '',
	},

	created() {
		let newDate = new Date()
		this.thisDate = new Date(
			newDate.getFullYear(),
			newDate.getMonth(),
			newDate.getDate()
		)

		this.currentMonth = this.thisDate.getMonth()
		this.calendar = this.setRenderCalendar()

		//Сортировка массивов записей в this.dataCalendar
		for (const key in this.dataCalendar) {
			if (Object.hasOwnProperty.call(this.dataCalendar, key)) {
				let element = this.dataCalendar[key]

				element = element.sort((el, el2) => {
					return el - el2
				})
			}
		}
	},
	computed: {
		datePosition() {
			let date = new Date(this.thisDate.getFullYear(), this.currentMonth)
			return date
		},
		currentDate() {
			let options = {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}
			return this.thisDate.toLocaleString('ru', options)
		},
		clicedDate() {
			let options = {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}
			return this.clickedDate.toLocaleString('ru', options)
		},
		currentWeekDay() {
			let options = {
				weekday: 'long',
			}
			let day = this.thisDate.toLocaleString('ru', options)
			day = day[0].toUpperCase() + day.substr(1)
			return day
		},
		currentYearMonth() {
			let options = {
				month: 'long',
				year: 'numeric',
			}
			let month = this.datePosition.toLocaleString('ru', options)
			month = month[0].toUpperCase() + month.substr(1)
			return month
		},
		mbTime() {
			let str = ''
			let time = this.stringTimeToObj(this.personDataType.time)
			if (time.h > 0) {
				str += `${time.h} ч.`
			}
			if (time.m > 0) {
				str += `${time.m} мин.`
			}

			return str
		},
		isPopapBtnDisabled() {
			switch (this.popapStep) {
				case 0:
					return !this.personDataType || !this.personDataTime
				case 1:
					return this.personDataName === '' || this.personDataTel === ''
			}
		},
	},
	watch: {
		personDataType() {
			this.personDataTime = this.workTimes[this.personDataType.name][0]
		},
	},
	methods: {
		//RENDER
		setRenderCalendar() {
			let renderCalendar = []
			renderCalendar = this.setRenderPrevMonth(renderCalendar)
			renderCalendar = this.setRenderCurrentMonth(renderCalendar)
			renderCalendar = this.setRenderNextMonth(renderCalendar)
			return renderCalendar
		},
		setRenderPrevMonth(arr) {
			let days = []
			let lastDayPrevMonth = this.getLastDayOfMonth(this.datePosition, 2)
			let firstDayThisMonth = this.getFirstDayOfMonth(this.datePosition)

			for (let index = firstDayThisMonth.day; index > 0; index--) {
				days.push({
					date: new Date(lastDayPrevMonth.date),
					class: 'calendar__body-day_disable',
					current: false,
				})

				lastDayPrevMonth.date = this.setDate(lastDayPrevMonth.date, -1)
			}

			days.reverse()
			return (arr = [...days])
		},
		setRenderCurrentMonth(arr) {
			let days = []
			let lastDayThisMonth = this.getLastDayOfMonth(this.datePosition, 1)
			let firstDayThisMonth = this.getFirstDayOfMonth(this.datePosition, 1)

			for (let index = 0; index < lastDayThisMonth.date.getDate(); index++) {
				let date = new Date(firstDayThisMonth.date)
				days.push({
					date: date,
					class: this.getDayClass(date),
					current: true,
				})
				firstDayThisMonth.date = this.setDate(firstDayThisMonth.date, 1)
			}

			return (arr = [...arr, ...days])
		},
		setRenderNextMonth(arr) {
			let firstDayOfMonth = this.getFirstDayOfMonth(this.datePosition, 2)
			let days = []
			let resOfWeekDay = 7 - arr[arr.length - 1].date.getDay()
			for (let index = 0; index < resOfWeekDay; index++) {
				days.push({
					date: new Date(firstDayOfMonth.date),
					class: 'calendar__body-day_disable',
					current: false,
				})
				firstDayOfMonth.date = this.setDate(firstDayOfMonth.date, 1)
			}

			return (arr = [...arr, ...days])
		},

		generateTimes() {
			let delay = this.stringTimeToFloat(this.settings.clientsDelay)
			let minTimeDelayObj = this.stringTimeToObj(minTimes)
			let minTimeDelay = this.stringTimeToFloat(minTimes)
			let start = this.stringTimeToFloat(this.settings.startWorkTime)
			let end = this.stringTimeToFloat(this.settings.endWorkTime)
			let date = this.createNewDate(
				this.clickedDate,
				this.stringTimeToObj(this.settings.startWorkTime)
			)

			let mass = []

			while (start <= end) {
				mass.push(date)
				date = this.createNewDate(date, {
					h: date.getHours() + minTimeDelayObj.h,
					m: date.getMinutes() + minTimeDelayObj.m,
				})
				start += minTimeDelay
			}

			let datas = this.dataCalendar[this.clickedDate.toDateString()]
			if (datas) {
				datas.forEach(data => {
					let s = mass.findIndex(v => {
						if (v) {
							return v.getTime() === data.start.getTime()
						} else {
							return false
						}
					})
					let e = mass.findIndex(v => {
						if (v) {
							return v.getTime() === data.end.getTime()
						} else {
							return false
						}
					})

					mass.splice(s, e - s + delay / minTimeDelay, ...new Array(e - s + 2))
				})
			}

			delay = (delay - minTimeDelay) / minTimeDelay
			this.settings.workTypes.forEach(element => {
				let timeForClient = this.stringTimeToFloat(element.time)
				let result = []

				const res = Math.round(timeForClient / minTimeDelay)
				let flag = 1
				let startN = 0
				let endN = 0

				for (let index = 1; index < mass.length; index++) {
					const el = mass[index]
					if (el) {
						endN = index
						if (flag === 0) {
							startN = index
						}
						if (flag === res) {
							result.push({
								start: mass[startN],
								end: mass[endN],
							})
							flag = 0
							index += delay
							continue
						}
						flag++
					} else {
						flag = 0
					}
				}

				this.$set(this.workTimes, element.name, result)
			})

			this.personDataTime = this.workTimes[this.personDataType.name][0]
		},

		//GET TO RENDER
		getCurrentDayOfWeek(date) {
			let day = date.getDay() + 7
			return day > 7 ? (day % 7) - 1 : day - 1
		},
		getFirstDayOfMonth(date, v = 1) {
			let newDate
			switch (v) {
				// Этого месяца
				case 1:
					newDate = new Date(date.getFullYear(), date.getMonth(), 1)
					break
				//Следующего месяца
				case 2:
					newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
					break
			}
			return {
				date: newDate,
				day: this.getCurrentDayOfWeek(newDate),
			}
		},
		getLastDayOfMonth(date, v = 1) {
			let newDate
			switch (v) {
				// Этого месяца
				case 1:
					newDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
					break
				//Прошлого месяца
				case 2:
					newDate = new Date(date.getFullYear(), date.getMonth(), 0)
					break
			}

			return {
				date: newDate,
				day: this.getCurrentDayOfWeek(newDate),
			}
		},
		setDate(date, days) {
			let dateCopy = date

			dateCopy.setDate(dateCopy.getDate() + days)
			return dateCopy
		},
		createNewDate(defaulData, { h, m }) {
			return new Date(
				defaulData.getFullYear(),
				defaulData.getMonth(),
				defaulData.getDate(),
				h,
				m
			)
		},

		//IFS
		ifThisDate(date, date2 = this.thisDate) {
			return date.getTime() === date2.getTime()
		},
		ifNotWorksDay(date) {
			return (
				date.getTime() < this.thisDate.getTime() ||
				this.settings.worksDay.indexOf(this.getCurrentDayOfWeek(date)) < 0 ||
				this.ifNoTimesInDay(date)
			)
		},
		ifNoTimesInDay(date) {
			if (this.dataCalendar[date.toDateString()]) {
				let minTimeDelay = this.stringTimeToFloat(minTimes)
				let start = this.stringTimeToFloat(this.settings.startWorkTime)
				let end = this.stringTimeToFloat(this.settings.endWorkTime)
				let rez = end - start
				let fullLength = rez / minTimeDelay
				let thisLenght =
					this.dataCalendar[date.toDateString()].length *
						(1 / minTimeDelay + 1) +
					this.dataCalendar[date.toDateString()].length -
					1

				return thisLenght >= fullLength
			}

			return false
		},
		ifClikedDay(date) {
			if (this.clickedDate) {
				return date.getTime() === this.clickedDate.getTime()
			}

			return false
		},
		isWorkDay(date) {
			return this.ifThisDate(date) || !this.ifNotWorksDay(date)
		},

		//GET CLASS
		getDayClass(date) {
			if (this.ifThisDate(date)) {
				return 'calendar__body-day_current'
			}
			if (this.ifNoTimesInDay(date)) {
				return 'calendar__body-day_notime'
			}
			if (this.ifNotWorksDay(date)) {
				return 'calendar__body-day_disable'
			}
			return ''
		},
		getTimeToDate(date) {
			let h = date.getHours()
			let m = date.getMinutes()
			return `${h}:${m < 10 ? '0' + m : m}`
		},
		//PARSE

		stringTimeToFloat(time) {
			let arrTime = time.split(':')
			let h = +arrTime[0]
			let m = +arrTime[1]

			if (h > 24) {
				h = h % 24
			}
			if (m >= 60) {
				h += m / 60
				m = m % 60
			}
			m = (100 * m) / 60 / 100
			return h + m
		},
		stringTimeToObj(time) {
			let arrTime = time.split(':')
			let h = +arrTime[0]
			let m = +arrTime[1]

			if (h > 24) {
				h = h % 24
			}
			if (m >= 60) {
				h += m / 60
				m = m % 60
			}

			return {
				h,
				m,
			}
		},

		//CLIKED
		nextMonthClick() {
			this.currentMonth++
			this.calendarPosition++
			this.prevCalendar = this.calendar

			if (this.nextCalendar.length !== 0) {
				this.calendar = this.nextCalendar
				this.nextCalendar = []
			} else {
				this.calendar = this.setRenderCalendar()
			}
		},
		prevMonthClick() {
			this.currentMonth--
			this.calendarPosition--
			this.nextCalendar = this.calendar

			if (this.prevCalendar.length !== 0) {
				this.calendar = this.prevCalendar
				this.prevCalendar = []
			} else {
				this.calendar = this.setRenderCalendar()
			}
		},
		dayClick(date) {
			this.clickedDate = date
			this.showDayPopap = true
			this.personDataType = this.settings.workTypes[0]

			this.generateTimes()
		},
		nextPopapStep() {
			this.popapStep++
		},

		formSubmite() {
			let date = this.clickedDate
			let stringDate = date.toDateString()

			this.dataCalendar[stringDate].push({
				start: this.personDataTime.start,
				end: this.personDataTime.end,
				type: this.personDataType.name,
				time: this.personDataType.time,
				name: this.personDataName,
				tel: this.personDataTel,
			})

			let element = this.dataCalendar[stringDate]

			element = element.sort((el, el2) => {
				return el - el2
			})

			this.showDayPopap = false
			this.personDataName = ''
			this.personDataTel = ''
			this.popapStep = 0

			console.log(this.dataCalendar)
		},
	},
})
