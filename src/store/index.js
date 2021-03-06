import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import moment from 'moment'
import { Note, Task, CalendarListItem, CalendarItem } from '../model'
import { dummyCalendarList, dummyCalendarItems } from './dummy-data'
import httpCal from '../utils/http-calendar'

Vue.use(Vuex)

export default new Vuex.Store({

  plugins: [createPersistedState()],

  state: {
    notes: [],
    tasks: [],
    editorOption: {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['code', 'clean']
        ]
      },
      placeholder: 'New note...',
      theme: 'bubble'
    },
    calendarList: [],
    calendarItems: [],
    token: null,
    notification: 'default'
  },

  getters: {
    hasToken: state => !!state.token,
    allowNotification: state => state.notification === 'granted',
    hasActiveTasks: state => state.tasks.some(o => !o.status),
    hasCompletedTasks: state => state.tasks.some(o => o.status),
    eventsByDateGroup: state => {
      return state.calendarItems.reduce((acc, obj) => {
        const key = moment(obj.start.date || obj.start.dateTime).toISOString();
        (acc[key] || (acc[key] = [])).push(obj)
        return acc
      }, {})
    }
  },

  actions: {

    async getCalendarList ({ commit }) {
      const response = await httpCal.get('users/me/calendarList')
      commit('setCalendarList', response.data)
    },

    async getEventList ({ state, dispatch, commit }) {
      if (state.calendarList.length === 0) {
        await dispatch('getCalendarList')
      }

      const fromDate = moment()
      const toDate = moment().add(14, 'days')

      const requestList = state.calendarList.map(cal => {
        const url = [
          'calendars/',
          encodeURIComponent(cal.id),
          '/events',
          '?timeMin=' + encodeURIComponent(fromDate.toISOString()),
          '&timeMax=' + encodeURIComponent(toDate.toISOString()),
          '&maxResults=50',
          '&orderBy=startTime',
          '&singleEvents=true'
        ].join('')
        return httpCal.get(url)
      })

      const response = await Promise.all(requestList)
      commit('setCalendarItems', response)
    }

  },

  mutations: {

    changeToken (state, token) {
      state.token = token
    },

    setToken (state, token) {
      httpCal.defaults.headers.common.Authorization = `Bearer ${token}`
    },

    changeNotification (state, status) {
      state.notification = status
    },

    // NOTE

    addNote (state) {
      state.notes.unshift(new Note())
    },
    changeNote (state, { note, content }) {
      note.content = content
    },
    updateNotes (state, newList) {
      state.notes = newList
    },
    removeNote (state, note) {
      const index = state.notes.indexOf(note)
      if (index > -1) {
        state.notes.splice(index, 1)
      }
    },

    // TASK

    updateTasks (state, newList) {
      state.tasks = newList
    },
    addTask (state) {
      state.tasks.unshift(new Task())
    },
    changeTextTask (state, { task, text }) {
      task.text = text
    },
    changeStatusTask (state, { task, status }) {
      task.status = status
    },
    removeTasks (state, task) {
      const index = state.tasks.indexOf(task)
      if (index > -1) {
        state.tasks.splice(index, 1)
      }
    },

    // CALENDAR

    calSetDummyData (state) {
      state.calendarList = dummyCalendarList().map(item => new CalendarListItem(item))
      state.calendarItems = dummyCalendarItems().map(event => new CalendarItem(event))
    },

    setCalendarList (state, data) {
      state.calendarList = data.items.map(item => new CalendarListItem(item))
    },

    setCalendarItems (state, items) {
      const data = items.map(item => item.data)
      const events = data.map(calendar => calendar.items)
      state.calendarItems = events.flat().map(event => new CalendarItem(event))
    }
  }

})
