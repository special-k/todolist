class glob.Todolist extends RT.Stratum
  constructor: (@dom)->
    super
    @addManager 'listManager', new ListManager
    @addManager 'panelsManager', new TodolistPanelsManager
    @addManager 'storageManager', new StorageManager


class glob.TodolistPanelsManager extends RT.ControlsPanelsManager
  init: ->
    super
    @setPanel 'todoList', document.one( 'todo-list' )


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
    else
      unless @statusBarEl.isAdded()
        @stratum.dom.add @statusBarEl 


class TodoItemWidget extends RedTeaWidget

  @register 'todoItem'

  isMain: true

  createDom: (self)->
    @li().bi(RTC.DBLCLICK, 'onStartEdit', context: self).add ->
      @div class: 'view', ->
        @input( class: 'toggle', type: 'checkbox' ).setas('checkboxEl').bi RTC.CHANGE, 'onChange', context: self
        @label ->
          @tn( self.body ).setas 'bodyEl'
        @button( class: 'destroy' ).bi RTC.CLICK, 'onDeleteFire', context: self
      @input( class: 'edit', value: self.body ).setas( 'editField' ).bi RTC.CHANGE, 'onFinishEdit', context: self

  init: (params)->
    window.bi RTC.CLICK, 'stopEdit', context: @
    @update params

  update: (params)->
    @isChecked = params.isChecked
    if @isChecked
      @checkboxEl.checked = true
      @dom.addCls 'completed'
    else
      @checkboxEl.checked = false
      @dom.remCls 'completed'
    @body = params.body
    @bodyEl.nodeValue = @body
    @editField.value = @body

  onStartEdit: (el, e)->
    e.preventDefault()
    @dom.addCls 'editing'
    @editField.focus()
    @editField.value = ''
    @editField.value = @body

  stopEdit: ->
    @dom.remCls 'editing'

  onChange: (el, e)->
    if el.checked
      @fire 'onDone'
    else
      @fire 'onComback'

  onDeleteFire: (el, e)->
    @fire 'onDelete'

  onFinishEdit: (el,e)->
    @fire 'onEdit', el.value
    @stopEdit()


class StatusBarWidget extends RedTeaWidget

  @register 'statusBar'

  isMain: true

  createDom: (self)->
    @footer id: 'footer', ->
      @span id: 'todo-count', ->
        @strong ->
          @tn( '0' ).setas 'todoCountEl'
          @tn ' item left'
      @ul id: 'filters', ->
        @li ->
          @a( href: '#/' ).setas('allButton').add ->
            @tn 'All'
        @li ->
          @a( href: '#/active' ).setas('activeButton').add ->
            @tn 'Active'
        @li ->
          @a( href: '#/completed' ).setas('completedButton').add ->
            @tn 'Completed'

  init: ->
    self = @
    @removeCompletedButton = RT.button( id: 'clear-completed' ).bi( RTC.CLICK, 'onRemoveCompletedFire', context: @).add ->
      @tn 'Clear completed ('
      @tn( '0' ).setas 'completedCountEl', self
      @tn ')'

  selectAll: ->
    @selectItem @allButton

  selectActiveOnly: ->
    @selectItem @activeButton

  selectCompletedOnly: ->
    @selectItem @completedButton

  selectItem: (item)->
    if @selectedItem?
      @selectedItem.remCls 'selected'
    item.addCls 'selected'
    @selectedItem = item

  setCount: (v)->
    @todoCountEl.nodeValue = v

  setCompletedCount: (v)->
    @completedCountEl.nodeValue = v
    if v > 0
      @dom.add @removeCompletedButton
    else
      @removeCompletedButton.removeSelf()

  onRemoveCompletedFire: ->
    @fire 'onRemoveCompleted'
