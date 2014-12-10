window.start = ->
  todolist = new Todolist document.one 'todoapp'

class Todolist extends RT.Stratum
  constructor: (@dom)->
    super
    @addManager 'listManager', new ListManager
    @addManager 'panelsManager', new TodolistPanelsManager


class glob.TodolistPanelsManager extends RT.ControlsPanelsManager
  init: ->
    super
    @setPanel 'todoList', document.one( 'todo-list' )


class glob.ListManager extends RT.BaseManager

  managers: ['panelsManager']

  constructor: ->
    document.one( 'new-todo' ).bi RTC.KEYUP, 'onNewTodoAdd', context: @
    window.bi RTC.HASHCHANGE, 'onHashChange', context: @
    @todoItems = {}

  panelsManagerLoaded: ->
    @statusBarEl = RT.statusBar().bi 'onRemoveCompleted', 'onRemoveCompleted', context: @
    @stratum.dom.add @statusBarEl 
    @makeAction window.location.href.split( '#' )[1]
    @updateItemsCount()

  onHashChange: (el,e)->
    @makeAction e.newURL.split( '#' )[1]

  makeAction: (v)->
    @panelsManager.clear( 'todoList' )
    switch v
      when '/active'
        @viewMode = 'active'
        @statusBarEl.selectActiveOnly()
        for item in RT.Storage.getObjectsByPath( 'todoItems' )
          unless item.isChecked
            @panelsManager.append 'todoList', @getOrCreateItem( item )
      when '/completed'
        @viewMode = 'completed'
        @statusBarEl.selectCompletedOnly()
        for item in RT.Storage.getObjectsByPath( 'todoItems' )
          if item.isChecked
            @panelsManager.append 'todoList', @getOrCreateItem( item )
      else
        @viewMode = 'all'
        @statusBarEl.selectAll()
        for item in RT.Storage.getObjectsByPath( 'todoItems' )
          @panelsManager.append 'todoList', @getOrCreateItem( item )

  onNewTodoAdd: (el, e)->
    t = el.value.trim()
    if e.keyCode == 13 && t != ''
      params = body: t, isChecked: false
      RT.Storage.pushObject 'todoItems', params
      @panelsManager.append 'todoList', @getOrCreateItem( params )
      el.value = ''
      @updateItemsCount()

  getOrCreateItem: (params)->
    t = @todoItems[params.id]
    unless t?
      t = RT.todoItem( params )
        .bi( 'onDone', 'onDone', context: @ )
        .bi( 'onComback', 'onComback', context: @ )
        .bi( 'onDelete', 'onDelete', context: @ )
        .bi( 'onEdit', 'onEdit', context: @ )
      @todoItems[params.id] = t
    t

  onDone: (widget)->
    RT.Storage.set widget.id, id: widget.id, body: widget.body, isChecked: true
    if @viewMode == 'active'
      widget.removeSelf()
    @updateItemsCount()

  onComback: (widget)->
    RT.Storage.set widget.id, id: widget.id, body: widget.body, isChecked: false
    @updateItemsCount()

  onDelete: (widget)->
    RT.Storage.delete widget.id
    widget.removeSelf()
    delete @todoItems[widget.id]
    @updateItemsCount()

  onEdit: (widget)->
    RT.Storage.set widget.id, id: widget.id, body: widget.body, isChecked: widget.isChecked

  updateItemsCount: ->
    @statusBarEl.setCount RT.Storage.getObjectsByPath( 'todoItems' ).filter( (el)-> !el.isChecked ).length
    @statusBarEl.setCompletedCount RT.Storage.getObjectsByPath( 'todoItems' ).filter( (el)-> el.isChecked ).length

  onRemoveCompleted: ->
    for item in RT.Storage.getObjectsByPath( 'todoItems' ).filter( (el)-> el.isChecked )
      RT.Storage.delete item.id
    @updateItemsCount()
    @makeAction window.location.href.split( '#' )[1]


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

  init: ->
    window.bi RTC.CLICK, 'stopEdit', context: @
    if @isChecked
      @checkboxEl.checked = true
      @dom.addCls 'completed'

  onChange: (el, e)->
    if el.checked
      @fire 'onDone'
      @isChecked = true
    else
      @fire 'onComback'
      @isChecked = false
    @dom.togCls 'completed'

  onDeleteFire: (el, e)->
    @fire 'onDelete'

  onStartEdit: (el, e)->
    e.preventDefault()
    @dom.addCls 'editing'
    @editField.focus()
    @editField.value = ''
    @editField.value = @body

  onFinishEdit: (el,e)->
    @body = el.value
    @bodyEl.nodeValue = el.value
    @dom.remCls 'editing'
    @fire 'onEdit'

  stopEdit: (el,e)->
    @dom.remCls 'editing'


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
