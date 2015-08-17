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
