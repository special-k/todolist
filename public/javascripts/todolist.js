(function() {
  var StatusBarWidget, TodoItemWidget,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  glob.Todolist = (function(_super) {
    __extends(Todolist, _super);

    function Todolist(dom) {
      this.dom = dom;
      Todolist.__super__.constructor.apply(this, arguments);
      this.addManager('listManager', new ListManager);
      this.addManager('panelsManager', new TodolistPanelsManager);
      this.addManager('storageManager', new StorageManager);
    }

    return Todolist;

  })(RT.Stratum);

  glob.TodolistPanelsManager = (function(_super) {
    __extends(TodolistPanelsManager, _super);

    function TodolistPanelsManager() {
      return TodolistPanelsManager.__super__.constructor.apply(this, arguments);
    }

    TodolistPanelsManager.prototype.init = function() {
      TodolistPanelsManager.__super__.init.apply(this, arguments);
      return this.setPanel('todoList', document.one('todo-list'));
    };

    return TodolistPanelsManager;

  })(RT.ControlsPanelsManager);

  glob.StorageManager = (function(_super) {
    __extends(StorageManager, _super);

    function StorageManager() {
      this.todoItems = new RT.Storage('todoItems');
    }

    return StorageManager;

  })(RT.BaseManager);

  glob.ListManager = (function(_super) {
    __extends(ListManager, _super);

    ListManager.prototype.managers = ['panelsManager', 'storageManager'];

    function ListManager() {
      var anti;
      anti = new RT.SimpleSyncAnticipant;
      this.bi('panelsManagerLoaded', 'managersLoaded', {
        through: anti
      });
      this.bi('storageManagerLoaded', 'managersLoaded', {
        through: anti
      });
      document.one('new-todo').bi(RTC.KEYUP, 'onNewTodoAdd', {
        context: this
      });
      document.one('toggle-all').sprm('checked', false).bi(RTC.CHANGE, 'onToggleAll', {
        context: this
      });
      window.bi(RTC.HASHCHANGE, 'onHashChange', {
        context: this
      });
      this.todoItems = {};
      this.statusBarEl = RT.statusBar().bi('onRemoveCompleted', 'onRemoveCompleted', {
        context: this
      });
    }

    ListManager.prototype.managersLoaded = function() {
      this.storage = this.storageManager.todoItems;
      this.storage.bi('onSet', 'onSetTodoItem', {
        context: this
      });
      this.storage.bi('onRemove', 'onRemoveTodoItem', {
        context: this
      });
      this.makeAction();
      return this.updateItemsCount();
    };

    ListManager.prototype.onHashChange = function(el, e) {
      return this.makeAction();
    };

    ListManager.prototype.makeAction = function() {
      var item, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results, _results1, _results2;
      this.panelsManager.clear('todoList');
      switch (window.location.href.split('#')[1]) {
        case '/active':
          this.statusBarEl.selectActiveOnly();
          _ref = this.storage.getObjects(function(item) {
            return !item.isChecked;
          });
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(this.panelsManager.append('todoList', this.getOrCreateItem(item)));
          }
          return _results;
          break;
        case '/completed':
          this.statusBarEl.selectCompletedOnly();
          _ref1 = this.storage.getObjects(function(item) {
            return item.isChecked;
          });
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            item = _ref1[_j];
            _results1.push(this.panelsManager.append('todoList', this.getOrCreateItem(item)));
          }
          return _results1;
          break;
        default:
          this.statusBarEl.selectAll();
          _ref2 = this.storage.getObjects();
          _results2 = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            item = _ref2[_k];
            _results2.push(this.panelsManager.append('todoList', this.getOrCreateItem(item)));
          }
          return _results2;
      }
    };

    ListManager.prototype.onSetTodoItem = function(storage, recordId, obj) {
      var widget;
      widget = this.todoItems[recordId];
      if (widget != null) {
        widget.update(obj);
      } else {
        widget = this.createItem(obj);
      }
      this.makeAction();
      return this.updateItemsCount();
    };

    ListManager.prototype.onRemoveTodoItem = function(storage, recordId) {
      this.todoItems[recordId].removeSelf();
      delete this.todoItems[recordId];
      return this.updateItemsCount();
    };

    ListManager.prototype.onNewTodoAdd = function(el, e) {
      var t;
      t = el.value.trim();
      if (e.keyCode === 13 && t !== '') {
        el.value = '';
        return this.storage.push({
          body: t,
          isChecked: false
        });
      }
    };

    ListManager.prototype.onToggleAll = function(checkbox, e) {
      var obj, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
      if (checkbox.checked) {
        _ref = this.storage.getObjects(function(el) {
          return !el.isChecked;
        });
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          obj.isChecked = true;
          _results.push(this.storage.set(obj.id, obj));
        }
        return _results;
      } else {
        _ref1 = this.storage.getObjects(function(el) {
          return el.isChecked;
        });
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          obj = _ref1[_j];
          obj.isChecked = false;
          _results1.push(this.storage.set(obj.id, obj));
        }
        return _results1;
      }
    };

    ListManager.prototype.getOrCreateItem = function(params) {
      return this.todoItems[params.id] || this.createItem(params);
    };

    ListManager.prototype.createItem = function(params) {
      var t;
      t = RT.todoItem(params).bi('onDone', 'onDone', {
        context: this
      }).bi('onComback', 'onComback', {
        context: this
      }).bi('onDelete', 'onDelete', {
        context: this
      }).bi('onEdit', 'onEdit', {
        context: this
      });
      this.todoItems[params.id] = t;
      return t;
    };

    ListManager.prototype.onDone = function(widget) {
      return this.storage.set(widget.id, {
        id: widget.id,
        body: widget.body,
        isChecked: true
      });
    };

    ListManager.prototype.onComback = function(widget) {
      return this.storage.set(widget.id, {
        id: widget.id,
        body: widget.body,
        isChecked: false
      });
    };

    ListManager.prototype.onDelete = function(widget) {
      return this.storage.remove(widget.id);
    };

    ListManager.prototype.onEdit = function(widget, body) {
      return this.storage.set(widget.id, {
        id: widget.id,
        body: body,
        isChecked: widget.isChecked
      });
    };

    ListManager.prototype.onRemoveCompleted = function() {
      var item, _i, _len, _ref, _results;
      _ref = this.storage.getObjects(function(el) {
        return el.isChecked;
      });
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push(this.storage.remove(item.id));
      }
      return _results;
    };

    ListManager.prototype.updateItemsCount = function() {
      var completedCount, uncheckedCount;
      uncheckedCount = this.storage.getObjects(function(el) {
        return !el.isChecked;
      }).length;
      completedCount = this.storage.getObjects(function(el) {
        return el.isChecked;
      }).length;
      this.statusBarEl.setCount(uncheckedCount);
      this.statusBarEl.setCompletedCount(completedCount);
      if (uncheckedCount === 0 && completedCount === 0) {
        return this.statusBarEl.removeSelf();
      } else {
        if (!this.statusBarEl.isAdded()) {
          return this.stratum.dom.add(this.statusBarEl);
        }
      }
    };

    return ListManager;

  })(RT.BaseManager);

  TodoItemWidget = (function(_super) {
    __extends(TodoItemWidget, _super);

    function TodoItemWidget() {
      return TodoItemWidget.__super__.constructor.apply(this, arguments);
    }

    TodoItemWidget.register('todoItem');

    TodoItemWidget.prototype.isMain = true;

    TodoItemWidget.prototype.createDom = function(self) {
      return this.li().bi(RTC.DBLCLICK, 'onStartEdit', {
        context: self
      }).add(function() {
        this.div({
          "class": 'view'
        }, function() {
          this.input({
            "class": 'toggle',
            type: 'checkbox'
          }).setas('checkboxEl').bi(RTC.CHANGE, 'onChange', {
            context: self
          });
          this.label(function() {
            return this.tn(self.body).setas('bodyEl');
          });
          return this.button({
            "class": 'destroy'
          }).bi(RTC.CLICK, 'onDeleteFire', {
            context: self
          });
        });
        return this.input({
          "class": 'edit',
          value: self.body
        }).setas('editField').bi(RTC.CHANGE, 'onFinishEdit', {
          context: self
        });
      });
    };

    TodoItemWidget.prototype.init = function(params) {
      window.bi(RTC.CLICK, 'stopEdit', {
        context: this
      });
      return this.update(params);
    };

    TodoItemWidget.prototype.update = function(params) {
      this.isChecked = params.isChecked;
      if (this.isChecked) {
        this.checkboxEl.checked = true;
        this.dom.addCls('completed');
      } else {
        this.checkboxEl.checked = false;
        this.dom.remCls('completed');
      }
      this.body = params.body;
      this.bodyEl.nodeValue = this.body;
      return this.editField.value = this.body;
    };

    TodoItemWidget.prototype.onStartEdit = function(el, e) {
      e.preventDefault();
      this.dom.addCls('editing');
      this.editField.focus();
      this.editField.value = '';
      return this.editField.value = this.body;
    };

    TodoItemWidget.prototype.stopEdit = function() {
      return this.dom.remCls('editing');
    };

    TodoItemWidget.prototype.onChange = function(el, e) {
      if (el.checked) {
        return this.fire('onDone');
      } else {
        return this.fire('onComback');
      }
    };

    TodoItemWidget.prototype.onDeleteFire = function(el, e) {
      return this.fire('onDelete');
    };

    TodoItemWidget.prototype.onFinishEdit = function(el, e) {
      this.fire('onEdit', el.value);
      return this.stopEdit();
    };

    return TodoItemWidget;

  })(RedTeaWidget);

  StatusBarWidget = (function(_super) {
    __extends(StatusBarWidget, _super);

    function StatusBarWidget() {
      return StatusBarWidget.__super__.constructor.apply(this, arguments);
    }

    StatusBarWidget.register('statusBar');

    StatusBarWidget.prototype.isMain = true;

    StatusBarWidget.prototype.createDom = function(self) {
      return this.footer({
        id: 'footer'
      }, function() {
        this.span({
          id: 'todo-count'
        }, function() {
          return this.strong(function() {
            this.tn('0').setas('todoCountEl');
            return this.tn(' item left');
          });
        });
        return this.ul({
          id: 'filters'
        }, function() {
          this.li(function() {
            return this.a({
              href: '#/'
            }).setas('allButton').add(function() {
              return this.tn('All');
            });
          });
          this.li(function() {
            return this.a({
              href: '#/active'
            }).setas('activeButton').add(function() {
              return this.tn('Active');
            });
          });
          return this.li(function() {
            return this.a({
              href: '#/completed'
            }).setas('completedButton').add(function() {
              return this.tn('Completed');
            });
          });
        });
      });
    };

    StatusBarWidget.prototype.init = function() {
      var self;
      self = this;
      return this.removeCompletedButton = RT.button({
        id: 'clear-completed'
      }).bi(RTC.CLICK, 'onRemoveCompletedFire', {
        context: this
      }).add(function() {
        this.tn('Clear completed (');
        this.tn('0').setas('completedCountEl', self);
        return this.tn(')');
      });
    };

    StatusBarWidget.prototype.selectAll = function() {
      return this.selectItem(this.allButton);
    };

    StatusBarWidget.prototype.selectActiveOnly = function() {
      return this.selectItem(this.activeButton);
    };

    StatusBarWidget.prototype.selectCompletedOnly = function() {
      return this.selectItem(this.completedButton);
    };

    StatusBarWidget.prototype.selectItem = function(item) {
      if (this.selectedItem != null) {
        this.selectedItem.remCls('selected');
      }
      item.addCls('selected');
      return this.selectedItem = item;
    };

    StatusBarWidget.prototype.setCount = function(v) {
      return this.todoCountEl.nodeValue = v;
    };

    StatusBarWidget.prototype.setCompletedCount = function(v) {
      this.completedCountEl.nodeValue = v;
      if (v > 0) {
        return this.dom.add(this.removeCompletedButton);
      } else {
        return this.removeCompletedButton.removeSelf();
      }
    };

    StatusBarWidget.prototype.onRemoveCompletedFire = function() {
      return this.fire('onRemoveCompleted');
    };

    return StatusBarWidget;

  })(RedTeaWidget);

}).call(this);
