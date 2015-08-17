class glob.Todolist extends RT.Stratum
  constructor: ->
    super
    self = @
    document.body.append ->
      @section(id: 'todoapp').setas('dom', self).append ->
        @header id: 'header', ->
          @h1 ->
            @tn 'todolist'
          @input id: 'new-todo', placeholder: 'What needs to be done?', autofocus: '' 
        @section style: 'display: block;', id: 'main', ->
          @input id: 'toggle-all', type: 'checkbox'
          @ul(id: 'todo-list').setas('todoListEl', self)
      @aside class: 'learn', ->
        @header ->
          @h3 ->
            @tn 'RedTea'
          @span class: 'source-links', ->
            @h5 ->
              @tn 'Example'
            @a href: "https://github.com/special-k/todolist", ->
              @tn 'Source'
      @footer id: 'info', ->
        @p ->
          @tn 'Double-click to edit a todo'
        @p ->
          @tn 'Written by '
          @a href: 'https://github.com/special-k', ->
            @tn 'Kirill Jakovlev'

    @addManager 'listManager', new ListManager
    @addManager 'panelsManager', new TodolistPanelsManager
    @addManager 'storageManager', new StorageManager


class glob.TodolistPanelsManager extends RT.ControlsPanelsManager
  init: ->
    super
    @setPanel 'todoList', @stratum.todoListEl


class glob.StorageManager extends RT.BaseManager
  constructor: ->
    @todoItems = new RT.Storage('todoItems')


class glob.ListManager extends RT.BaseManager

  managers: ['panelsManager', 'storageManager']

  constructor: ->
    anti = new RT.SimpleSyncAnticipant
    @bi 'panelsManagerLoaded', 'managersLoaded', through: anti
    @bi 'storageManagerLoaded', 'managersLoaded', through: anti

    document.one( 'new-todo' ).bi RTC.KEYUP, 'onNewTodoAdd', context: @
    document.one( 'toggle-all' ).sprm('checked', false).bi RTC.CHANGE, 'onToggleAll', context: @
    window.bi RTC.HASHCHANGE, 'onHashChange', context: @
    @todoItems = {}
    @statusBarEl = RT.statusBar().bi 'onRemoveCompleted', 'onRemoveCompleted', context: @
    @mainEl = document.one( 'main' )

  managersLoaded: ->
    @storage = @storageManager.todoItems
    @storage.bi 'onSet', 'onSetTodoItem', context: @
    @storage.bi 'onRemove', 'onRemoveTodoItem', context: @
    @makeAction()
    @updateItemsCount()

  onHashChange: (el,e)->
    @makeAction()

  makeAction: ->
    @panelsManager.clear( 'todoList' )
    switch window.location.href.split( '#' )[1]
      when '/active'
        @statusBarEl.selectActiveOnly()
        for item in @storage.getObjects( (item)-> !item.isChecked )
          @panelsManager.append 'todoList', @getOrCreateItem( item )
      when '/completed'
        @statusBarEl.selectCompletedOnly()
        for item in @storage.getObjects( (item)-> item.isChecked )
          @panelsManager.append 'todoList', @getOrCreateItem( item )
      else
        @statusBarEl.selectAll()
        for item in @storage.getObjects()
          @panelsManager.append 'todoList', @getOrCreateItem( item )

  onSetTodoItem: (storage, recordId, obj)->
    widget = @todoItems[recordId]
    if widget?
      widget.update obj
    else
      widget = @createItem obj
    @makeAction()
    @updateItemsCount()

  onRemoveTodoItem: (storage, recordId)->
    @todoItems[recordId].removeSelf()
    delete @todoItems[recordId]
    @updateItemsCount()

  onNewTodoAdd: (el, e)->
    t = el.value.trim()
    if e.keyCode == 13 && t != ''
      el.value = ''
      @storage.push body: t, isChecked: false

  onToggleAll: (checkbox, e)->
    if checkbox.checked
      for obj in @storage.getObjects( (el)-> !el.isChecked )
        obj.isChecked = true
        @storage.set obj.id, obj
    else
      for obj in @storage.getObjects( (el)-> el.isChecked )
        obj.isChecked = false
        @storage.set obj.id, obj

  getOrCreateItem: (params)->
   @todoItems[params.id] || @createItem( params )

  createItem: (params)->
    t = RT.todoItem( params )
      .bi( 'onDone', 'onDone', context: @ )
      .bi( 'onComback', 'onComback', context: @ )
      .bi( 'onDelete', 'onDelete', context: @ )
      .bi( 'onEdit', 'onEdit', context: @ )
    @todoItems[params.id] = t
    t

  onDone: (widget)->
    @storage.set widget.id, id: widget.id, body: widget.body, isChecked: true

  onComback: (widget)->
    @storage.set widget.id, id: widget.id, body: widget.body, isChecked: false

  onDelete: (widget)->
    @storage.remove widget.id

  onEdit: (widget, body)->
    @storage.set widget.id, id: widget.id, body: body, isChecked: widget.isChecked

  onRemoveCompleted: ->
    for item in @storage.getObjects( (el)-> el.isChecked )
      @storage.remove item.id

  updateItemsCount: ->
    uncheckedCount = @storage.getObjects( (el)-> !el.isChecked ).length
    completedCount = @storage.getObjects( (el)-> el.isChecked ).length
    @statusBarEl.setCount uncheckedCount
    @statusBarEl.setCompletedCount completedCount
    if uncheckedCount == 0 && completedCount == 0
      @statusBarEl.removeSelf()
      @mainEl.style.display = 'none'

    else
      unless @statusBarEl.isAdded()
        @stratum.dom.append @statusBarEl 
        @mainEl.style.display = 'block'
