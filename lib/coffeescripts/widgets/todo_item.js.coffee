class TodoItemWidget extends RedTeaWidget

  @register 'todoItem'

  isMain: true

  createDom: (self)->
    @li().bi(RTC.DBLCLICK, 'onStartEdit', context: self).append ->
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
