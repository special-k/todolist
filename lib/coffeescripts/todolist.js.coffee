class glob.Todolist extends RT.Stratum
  #инициализация приложения: добавление менеджеров и корневого DOM-элемента приложения
  constructor: ->
    super
    @addManager 'itemsManager', new ItemsManager
    @addManager 'routesManager', new RoutesManager
    document.body.append @list ->
      ##можно добавлять дела в список и так
      #@item storageData: {task: 'Новое дело', finished: false, touched: true}

#данный менеджер реализует интерфейс для работы с коллекцией элементов
class ItemsManager extends RT.BaseManager

  STORAGE_NAME = 'todos-redtea'

  #сеттер основного объекта коллекции списка дел
  setStorageItems: (@storageItems)->
    @bime @storageItems, 'onItemAdded', 'onItemAdded'
    @bime @storageItems, 'onItemChanged', 'onItemChanged'
    @loadItems()

  onItemChanged: (eventObject, item, field, value)->
    switch field
      #сохранение коллекции при завершении дела
      when 'finished' then @asyncStore()
      #удаление элемента из коллекции и сохранение
      when 'deleted'
        if value
          @storageItems.remove item
          @asyncStore()

  #сохранение коллекции при добавлении дела
  onItemAdded: (eventObject, item)->
    @asyncStore()

  #удобный доступ к отфильтрованным частям коллекции
  scope: (name)->
    items = @storageItems.items
    switch name
      when '/' then items
      when 'touched' then items.filter (el)-> el.get('touched')
      when 'untouched' then items.filter (el)-> !el.get('touched')
      when '/active' then items.filter (el)-> !el.get('finished')
      when '/completed' then items.filter (el)-> el.get('finished')

  #загрузка списка дел из localStorage
  loadItems: ->
    @asyncStoreLock = true
    if localStorage.hasOwnProperty STORAGE_NAME
      for item in JSON.parse localStorage.getItem STORAGE_NAME
        @storageItems.push new RT.StorageItem(task: item.task, finished: item.finished, touched: true, 'both')
    @asyncStoreLock = false

  #добавление элемента в коллекцию
  createItem: (value)->
    if value
      @storageItems.push new RT.StorageItem(task: value, finished: false, touched: true, 'both')

  #удаление элемента
  deleteItem: (item)->
    if item
      @storageItems.remove item
      @asyncStore()

  #отметить все дела сделанными
  setAllDone: (value)->
    if value || @scope('/completed').length == @scope('/').length
      for item in @scope('/')
        item.set 'finished', value

  #сохранение коллекции в localStorage
  asyncStore: ->
    if !@asyncStoreLock
      @asyncStoreLock = true
      setTimeout =>
        localStorage.setItem STORAGE_NAME, JSON.stringify(@scope('/').map((el)-> task: el.data.task, finished: el.data.finished))
        @asyncStoreLock = false
      , 10

#данный менеджер реализует интерфейс для работы с адресной строкой браузер
class RoutesManager extends RT.BaseManager

  #подписка на изменение хэша адресной строки
  constructor: ->
    @bime window, RTC.HASHCHANGE, 'onHashchange'
    @bi 'onChangePath', 'onChangePath'
    @setPath location.href

  onHashchange: (eventObject, e)->
    @setPath e.newURL

  onChangePath: (eventObject, @path)->

  #получение из эдресной строки короткого значения текущей "директории"
  setPath: (url)->
    if url.match '#'
      @fire 'onChangePath', url.substring(url.split('#',1)[0].length + 1, url.length)
    else
      @fire 'onChangePath', '/'

#========== Виджеты ==========
#-----------------------------
class List extends RT.Widget

  #регистрация виджета для использования при описании DOM-структур
  @register 'list'

  #подключение менеджеров
  managers: ['itemsManager', 'routesManager']

  #установка основного элемента колекции при добавлении менеджера
  #storageItem является каркасом структуры данных:
  #логика взаимодействует со storageItem -
  #storageItem взаимодействует со структурами DOM
  itemsManagerLoaded: ->
    @itemsManager.setStorageItems @getCollectionField('items')

  #подписка на изменение директории
  routesManagerLoaded: ->
    @onChangePath null, @routesManager.path
    @bime @routesManager, 'onChangePath', 'onChangePath'

  #DOM-структура виджета ====================-
  createDom: (self)->
    @section id: 'todoapp', ->
      @h1 ->
        @tn 'дела'
      #данный узел записан в объектную переменную @listEl (this.listEl) для последующего использования
      @ul(id: 'todo-list').setas('listEl', self).append ->
        @newItem()
      @statusBar ->
        @tools()
  #=========================================-

  #по-умолчанию дочерние узлы добавляются в корневой элемент,
  #но можно установить специфичное правило добавления элементов
  #в данном случае все дочерние элементы будут добавляться к @listEl (смотри выше)
  append: (el, params)->
    @newAddedItems = []
    @addHelper @listEl, el, params
    #добавленные элементы должны проверяться на видимость
    for item in @newAddedItems
      #скрытие/показ элемента в зависимости от фильтра видимости
      @checkTouching item
    #обновление счетчика незавершенных дел
    @asyncUpdateCount()

  #подписка на основыные изменения
  storageInit: ->
    @bime @getCollectionField('items'), 'onItemAdded', 'onItemAdded'
    @bime @getCollectionField('items'), 'onItemChanged', 'onItemChanged'

  onItemAdded: (eventObject, item)->
    unless item.widget?
      #добавление нового "дела"
      @append ->
        @item storageItem: item
      @checkTouching item
      @asyncUpdateCount()
    else
      #если "дело" добавляется через storageItem,
      #то его видимость и счетчики будет обновляться в этой функции,
      #иначе элемент нужно сохранить в массив, чтобы выполнить операции
      #после добавления его (виджета) в DOM 
      @newAddedItems.push item

  onItemChanged: (eventObject, item, field, value)->
    #изменение полей storageItem виджета "дела"
    switch field
      #в зависимости от значения поля 'touched' элемент
      #помещается в DOM-дерево, или удаляется из него
      when 'touched'
        if value
          @append item.widget
        else
          item.widget.removeSelf()
      #при изменении завершенности дела обновлять счетчик и менять видимость
      when 'finished'
        @asyncUpdateCount()
        @checkTouching item
      when 'deleted'
        if value && item.widget?
          item.widget.destroy()
          @asyncUpdateCount()

  #массовое изменение видимости при изменении раздела
  onChangePath: (eventObject, path)->
    @itemsManager.scope('touched').forEach (el)-> el.set('touched', false)
    @itemsManager.scope(path).forEach (el)-> el.set('touched', true)
    @storageItem.get('statusBar').first().get('widgets').first().set 'path', path

  #обертка функции обновления счетчика незавершенных дел
  #для обнократного, а не многократного обновления при массовых операциях
  asyncUpdateCount: ->
    if !@asyncCountLock
      @asyncCountLock = true
      setTimeout =>
        @updateStatusBar()
        @asyncCountLock = false
      , 10

  #обновление счетчика незавершенных дел
  updateStatusBar: ->
    @storageItem.get('statusBar').first().set 'count', @itemsManager.scope('/active').length
    @storageItem.get('newItem').first().set 'count', @itemsManager.scope('/active').length

  #установка соответствующей видимости "делу"
  checkTouching: (item)->
    if @routesManager
      item.set 'touched', item in @itemsManager.scope(@routesManager.path)

class Item extends RT.Widget

  #регистрация виджета для использования при описании DOM-структур
  @register 'item'

  #настройка добавление @storageItem в родительскую коллекцию
  #по-умолчанию дочерние @storageItem попадают в поле 'widgets'
  #виджет этого же класса будут попадать в поле 'items'
  collectionName: 'items'

  #синхранизация полей с дочерними элементами
  #both - в обе стороны
  #to - пробрасывание значение в дочерние элементы
  #from - импорт значений из дочерних элементов
  pass: 'both'

  #DOM-структура виджета ====================-
  createDom: (self)->
    @li ->
      @checkbox name: 'finished'
      @stringField(name: 'task').setas 'stringFieldEl', self
      @div(class: 'view').setas('viewEl', self).append ->
        @textBox name: 'task'
        @button(class: 'destroy').setas 'destroyEl', self
  #=========================================-

  init: ->
    @viewMode()
    @checkFinished @storageItem.get 'finished'
    @bime @destroyEl, RTC.CLICK, 'onDestroy'

  storageInit: ->
    @bime @storageItem, 'onFieldChanged', 'onFieldChanged'

  onFieldChanged: (eventObject, field, value)->
    switch field
      when 'finished' then @checkFinished(value)
      when 'editing'
        if value
          @editMode()
        else
          @viewMode()
          unless @storageItem.get('task')
            @onDestroy()

  viewMode: ->
    @stringFieldEl.removeSelf()
    @dom.append @viewEl

  editMode: ->
    @viewEl.removeSelf()
    @dom.append @stringFieldEl

  checkFinished: (value)->
    if value
      @addCls 'done'
    else
      @remCls 'done'

  onDestroy: ()->
    @storageItem.set 'deleted', true

class NewItem extends Item

  @register 'newItem'

  collectionName: 'newItem'

  managers: ['itemsManager']

  itemsManagerLoaded: ->
    @bime @stringFieldEl, 'onEnter', 'onEnter'

  #DOM-структура виджета ====================-
  createDom: (self)->
    @li ->
      @checkbox(name: 'finished').setas 'checkboxEl', self
      @stringField(name: 'task', placeholder: 'Че делать-то, а?').setas 'stringFieldEl', self
  #=========================================-

  init: ->
    @addCls 'newItem'
    @storageItem.set 'task', ''

  onEnter: ->
    @itemsManager.createItem @stringFieldEl.getValue()
    @storageItem.set 'task', ''

  onFieldChanged: (eventObject, field, value)->
    switch field
      when 'finished' then @itemsManager.setAllDone value
      when 'count' 
        if value == 0
          @storageItem.set 'finished', true
        else
          @storageItem.set 'finished', false

class Checkbox extends RT.Widget

  @register 'checkbox'

  #DOM-структура виджета ====================-
  createDom: (self)->
    @input type: 'checkbox', class: 'checkbox'
  #=========================================-

  init: (params)->
    @name = params.name
    @setValue @storageItem.get @name
    @bime @dom, RTC.CHANGE, 'onChange'
    @dom.stopProp RTC.DBLCLICK

  storageInit: ->
    @bime @storageItem, 'onFieldChanged', 'onFieldChanged'

  onFieldChanged: (eventObject, field, value)->
    if field == @name
      @setValue(value)

  getValue: ->
    @dom.checked

  setValue: (value)->
    if value
      @dom.checked = true
    else
      @dom.checked = false

  onChange: (eventObject, e)->
    @storageItem.set @name, @dom.checked

class StringField extends RT.Widget

  @register 'stringField'

  #DOM-структура виджета ====================-
  createDom: (self, params)->
    @input(type: 'text', class: 'stringField', placeholder: params.placeholder || '')
  #=========================================-

  init: (params)->
    @name = params.name
    @setValue @storageItem.get @name
    @bime @dom, RTC.KEYUP, 'onKeyUp'
    @bime @dom, RTC.CHANGE, 'onChange'
    @bime @dom, 'blur', 'setEditing'

  storageInit: ->
    @bime @storageItem, 'onFieldChanged', 'onFieldChanged'

  onFieldChanged: (eventObject, field, value)->
    switch field
      when @name then @setValue value
      when 'editing' then @onEditing value

  onChange: (eventObject, domEvent)->
    @storageItem.set @name, @getValue()

  onKeyUp: (eventObject, domEvent)->
    if domEvent.keyCode == 13
      @setEditing()
      @fire 'onEnter'

  getValue: ->
    @dom.value

  setValue: (value)->
    @dom.value = value

  setEditing: ->
    @storageItem.set 'editing', false

  onEditing: (value)->
    if value
      @dom.focus()
      @dom.setSelectionRange @dom.value.length, @dom.value.length

class TextBox extends RT.Widget

  @register 'textBox'

  #DOM-структура виджета ====================-
  createDom: (self)->
    @div class: 'textBox', ->
      @tn('').setas 'body', self
  #=========================================-

  init: (params)->
    @name = params.name
    @setValue @storageItem.get @name
    @bime @dom, RTC.DBLCLICK, 'setEditing'

  storageInit: ->
    @bime @storageItem, 'onFieldChanged', 'onFieldChanged'

  onFieldChanged: (eventObject, field, value)->
    if field == @name
      @setValue value

  setValue: (v)->
    @body.nodeValue = v
    v

  setEditing: ->
    @storageItem.set 'editing', true

class StatusBar extends RT.Widget

  @register 'statusBar'

  collectionName: 'statusBar'

  #DOM-структура виджета ====================-
  createDom: (self)->
    @footer id: 'footer', ->
      @span id: 'todo-count', ->
        @tn( '0' ).setas 'todoCountEl', self
  #=========================================-

  storageInit: ->
    @bime @storageItem, 'onFieldChanged', 'onFieldChanged'

  onFieldChanged: (eventObject, field, value)->
    if field == 'count'
      @todoCountEl.nodeValue = value

class Tools extends RT.Widget

  @register 'tools'

  preinit: ->
    @buttons = {}

  #DOM-структура виджета ====================-
  createDom: (self)->
    @ul id: 'filters', ->
      @li ->
        @a( href: '#/' ).setas('/', self.buttons).add ->
          @tn 'все'
      @li ->
        @a( href: '#/active' ).setas('/active', self.buttons).add ->
          @tn 'активные'
      @li ->
        @a( href: '#/completed' ).setas('/completed', self.buttons).add ->
          @tn 'сделанные'
  #=========================================-

  storageInit: ->
    @bime @storageItem, 'onFieldChanged', 'onFieldChanged'

  onFieldChanged: (eventObject, field, value)->
    if field == 'path'
      @selectButton @buttons[value] || @buttons['/']

  selectButton: (button)->
    if @selectedButton?
      @selectedButton.remCls 'selected'
    button.addCls 'selected'
    @selectedButton = button
