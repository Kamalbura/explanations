export interface CalendarEvent {
  id: string
  title: string
  type: 'mock-test' | 'interview' | 'deadline' | 'study-goal' | 'other'
  date: string // YYYY-MM-DD format
  time?: string // HH:MM format
  description?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  reminders: string[] // ['1day', '1hour', '30min']
  createdAt: string
  updatedAt: string
}

export interface CalendarNotification {
  id: string
  eventId: string
  type: '1day' | '1hour' | '30min'
  message: string
  shown: boolean
  createdAt: string
}

class CalendarService {
  private readonly EVENTS_STORAGE_KEY = 'dsa-tracker-calendar-events'
  private readonly NOTIFICATIONS_STORAGE_KEY = 'dsa-tracker-notifications'

  // Get all events
  getEvents(): CalendarEvent[] {
    const stored = localStorage.getItem(this.EVENTS_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing stored events:', error)
      }
    }
    return []
  }

  // Get events for a specific date
  getEventsForDate(date: string): CalendarEvent[] {
    return this.getEvents().filter(event => event.date === date)
  }

  // Get upcoming events (next 7 days)
  getUpcomingEvents(): CalendarEvent[] {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)
    
    return this.getEvents()
      .filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= today && eventDate <= nextWeek && !event.completed
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Add new event
  addEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): CalendarEvent {
    const event: CalendarEvent = {
      ...eventData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const events = this.getEvents()
    events.push(event)
    this.saveEvents(events)
    
    // Create notifications for this event
    this.createNotificationsForEvent(event)
    
    return event
  }

  // Update event
  updateEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const events = this.getEvents()
    const index = events.findIndex(event => event.id === id)
    
    if (index === -1) return null
    
    events[index] = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.saveEvents(events)
    
    // Update notifications if date or reminders changed
    if (updates.date || updates.reminders) {
      this.updateNotificationsForEvent(events[index])
    }
    
    return events[index]
  }

  // Delete event
  deleteEvent(id: string): boolean {
    const events = this.getEvents()
    const filteredEvents = events.filter(event => event.id !== id)
    
    if (filteredEvents.length === events.length) return false
    
    this.saveEvents(filteredEvents)
    this.deleteNotificationsForEvent(id)
    
    return true
  }

  // Mark event as completed
  completeEvent(id: string): boolean {
    return !!this.updateEvent(id, { completed: true })
  }

  // Get notifications
  getNotifications(): CalendarNotification[] {
    const stored = localStorage.getItem(this.NOTIFICATIONS_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing stored notifications:', error)
      }
    }
    return []
  }

  // Get pending notifications (not shown yet)
  getPendingNotifications(): CalendarNotification[] {
    const now = new Date()
    
    return this.getNotifications().filter(notification => {
      if (notification.shown) return false
      
      const event = this.getEvents().find(e => e.id === notification.eventId)
      if (!event || event.completed) return false
      
      const eventDateTime = new Date(`${event.date}${event.time ? `T${event.time}` : 'T09:00'}`)
      const notificationTime = this.calculateNotificationTime(eventDateTime, notification.type)
      
      return now >= notificationTime
    })
  }

  // Mark notification as shown
  markNotificationShown(id: string): void {
    const notifications = this.getNotifications()
    const notification = notifications.find(n => n.id === id)
    
    if (notification) {
      notification.shown = true
      this.saveNotifications(notifications)
    }
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private saveEvents(events: CalendarEvent[]): void {
    localStorage.setItem(this.EVENTS_STORAGE_KEY, JSON.stringify(events))
  }

  private saveNotifications(notifications: CalendarNotification[]): void {
    localStorage.setItem(this.NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  }

  private createNotificationsForEvent(event: CalendarEvent): void {
    const notifications = this.getNotifications()
    
    // Remove existing notifications for this event
    const filteredNotifications = notifications.filter(n => n.eventId !== event.id)
    
    // Create new notifications
    event.reminders.forEach(reminder => {
      filteredNotifications.push({
        id: this.generateId(),
        eventId: event.id,
        type: reminder as '1day' | '1hour' | '30min',
        message: this.createNotificationMessage(event, reminder),
        shown: false,
        createdAt: new Date().toISOString()
      })
    })
    
    this.saveNotifications(filteredNotifications)
  }

  private updateNotificationsForEvent(event: CalendarEvent): void {
    this.createNotificationsForEvent(event) // This already handles removal and recreation
  }

  private deleteNotificationsForEvent(eventId: string): void {
    const notifications = this.getNotifications()
    const filteredNotifications = notifications.filter(n => n.eventId !== eventId)
    this.saveNotifications(filteredNotifications)
  }

  private createNotificationMessage(event: CalendarEvent, reminder: string): string {
    const timeMap = {
      '1day': '1 day',
      '1hour': '1 hour', 
      '30min': '30 minutes'
    }
    
    return `"${event.title}" is ${timeMap[reminder as keyof typeof timeMap]} away!`
  }

  private calculateNotificationTime(eventTime: Date, reminderType: string): Date {
    const notificationTime = new Date(eventTime)
    
    switch (reminderType) {
      case '1day':
        notificationTime.setDate(notificationTime.getDate() - 1)
        break
      case '1hour':
        notificationTime.setHours(notificationTime.getHours() - 1)
        break
      case '30min':
        notificationTime.setMinutes(notificationTime.getMinutes() - 30)
        break
    }
    
    return notificationTime
  }

  // Statistics
  getEventStats() {
    const events = this.getEvents()
    const total = events.length
    const completed = events.filter(e => e.completed).length
    const upcoming = this.getUpcomingEvents().length
    const overdue = events.filter(e => {
      const eventDate = new Date(e.date)
      const today = new Date()
      return eventDate < today && !e.completed
    }).length

    return {
      total,
      completed,
      upcoming,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
}

export const calendarService = new CalendarService()
