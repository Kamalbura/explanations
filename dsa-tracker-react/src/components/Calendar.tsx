import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Plus, Clock, AlertTriangle, CheckCircle, Edit, Trash2, Target, BookOpen, Users, Calendar as CalendarIconOutline } from 'lucide-react'
import { calendarService, type CalendarEvent } from '../services/CalendarService'

const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'study-goal' as CalendarEvent['type'],
    date: '',
    time: '',
    description: '',
    priority: 'medium' as CalendarEvent['priority'],
    reminders: ['1day'] as string[]
  })

  useEffect(() => {
    loadEvents()
    // Set initial selectedDate to today using consistent format
    const today = formatDate(new Date())
    setSelectedDate(today)
    console.log('Initial selectedDate set to:', today) // Debug log
  }, [])

  const loadEvents = () => {
    const loadedEvents = calendarService.getEvents()
    console.log('Loading events:', loadedEvents) // Debug log
    setEvents(loadedEvents)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const formatDate = (date: Date): string => {
    // Ensure consistent YYYY-MM-DD format
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date)
    const dayEvents = events.filter(event => event.date === dateStr)
    console.log(`Events for ${dateStr}:`, dayEvents) // Debug log
    console.log('All events:', events) // Debug log
    return dayEvents
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  const isPastDue = (event: CalendarEvent): boolean => {
    const eventDate = new Date(event.date)
    const today = new Date()
    return eventDate < today && !event.completed
  }

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.date) return

    console.log('Adding event with date:', eventForm.date) // Debug log

    const newEvent = calendarService.addEvent({
      title: eventForm.title,
      type: eventForm.type,
      date: eventForm.date,
      time: eventForm.time || undefined,
      description: eventForm.description || undefined,
      priority: eventForm.priority,
      completed: false,
      reminders: eventForm.reminders
    })

    console.log('Created event:', newEvent) // Debug log
    
    // CRITICAL FIX: Set selectedDate to the new event's date so it shows in the sidebar
    setSelectedDate(eventForm.date)
    console.log('Selected date set to:', eventForm.date) // Debug log
    
    // Force immediate reload of events to ensure UI sync
    loadEvents()
    
    resetForm()
    setShowAddEvent(false)
  }

  const handleUpdateEvent = () => {
    if (!editingEvent) return

    const updatedEvent = calendarService.updateEvent(editingEvent.id, {
      title: eventForm.title,
      type: eventForm.type,
      date: eventForm.date,
      time: eventForm.time || undefined,
      description: eventForm.description || undefined,
      priority: eventForm.priority,
      reminders: eventForm.reminders
    })

    // If the date was changed, update selectedDate to show the updated event
    if (eventForm.date !== editingEvent.date) {
      setSelectedDate(eventForm.date)
      console.log('Updated event date, selected date set to:', eventForm.date) // Debug log
    }
    
    // Force immediate reload of events to ensure UI sync
    loadEvents()
    
    resetForm()
    setEditingEvent(null)
  }

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      calendarService.deleteEvent(id)
      // Force immediate reload of events
      loadEvents()
    }
  }

  const handleCompleteEvent = (id: string) => {
    calendarService.completeEvent(id)
    // Force immediate reload of events
    loadEvents()
  }

  const resetForm = () => {
    setEventForm({
      title: '',
      type: 'study-goal',
      date: '',
      time: '',
      description: '',
      priority: 'medium',
      reminders: ['1day']
    })
  }

  const startEdit = (event: CalendarEvent) => {
    setEventForm({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time || '',
      description: event.description || '',
      priority: event.priority,
      reminders: event.reminders
    })
    setEditingEvent(event)
    setShowAddEvent(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mock-test': return <Target className="w-4 h-4" />
      case 'interview': return <Users className="w-4 h-4" />
      case 'deadline': return <AlertTriangle className="w-4 h-4" />
      case 'study-goal': return <BookOpen className="w-4 h-4" />
      default: return <CalendarIconOutline className="w-4 h-4" />
    }
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const stats = calendarService.getEventStats()

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar & Events</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your study schedule and important dates
          </p>
        </div>
        
        <button
          onClick={() => setShowAddEvent(true)}
          className="btn-primary mt-4 md:mt-0 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.upcoming}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2 h-24"></div>
              }

              const dayEvents = getEventsForDate(day)
              const isSelected = selectedDate === formatDate(day)

              return (
                <div
                  key={index}
                  className={`p-2 h-24 border rounded-lg cursor-pointer transition-colors ${
                    isToday(day)
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : isSelected
                      ? 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                      : 'hover:bg-gray-50 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedDate(formatDate(day))}
                >
                  <div className={`text-sm font-medium ${
                    isToday(day) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${getPriorityColor(event.priority)} ${
                          event.completed ? 'opacity-50 line-through' : ''
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {selectedDate ? `Events for ${new Date(selectedDate).toLocaleDateString()}` : 'Upcoming Events'}
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(selectedDate 
              ? events.filter(e => e.date === selectedDate)
              : calendarService.getUpcomingEvents()
            ).map(event => (
              <div
                key={event.id}
                className={`p-3 border rounded-lg ${
                  event.completed 
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : isPastDue(event)
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1">
                    <div className="mt-1">{getTypeIcon(event.type)}</div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        event.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
                      }`}>
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString()}
                        {event.time && ` at ${event.time}`}
                      </div>
                      {event.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {event.description}
                        </div>
                      )}
                      <div className={`inline-block text-xs px-2 py-1 rounded mt-2 ${getPriorityColor(event.priority)}`}>
                        {event.priority} priority
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {!event.completed && (
                      <button
                        onClick={() => handleCompleteEvent(event.id)}
                        className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title="Mark as completed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(event)}
                      className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Edit event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {(selectedDate 
              ? events.filter(e => e.date === selectedDate).length === 0
              : calendarService.getUpcomingEvents().length === 0
            ) && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No events found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="study-goal">Study Goal</option>
                  <option value="mock-test">Mock Test</option>
                  <option value="interview">Interview</option>
                  <option value="deadline">Deadline</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={eventForm.priority}
                  onChange={(e) => setEventForm(prev => ({ ...prev, priority: e.target.value as CalendarEvent['priority'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="Event description (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reminders
                </label>
                <div className="space-y-2">
                  {['1day', '1hour', '30min'].map(reminder => (
                    <label key={reminder} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eventForm.reminders.includes(reminder)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEventForm(prev => ({ ...prev, reminders: [...prev.reminders, reminder] }))
                          } else {
                            setEventForm(prev => ({ ...prev, reminders: prev.reminders.filter(r => r !== reminder) }))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {reminder === '1day' ? '1 day before' : reminder === '1hour' ? '1 hour before' : '30 minutes before'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddEvent(false)
                  setEditingEvent(null)
                  resetForm()
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                disabled={!eventForm.title || !eventForm.date}
                className="btn-primary disabled:opacity-50"
              >
                {editingEvent ? 'Update' : 'Add'} Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
