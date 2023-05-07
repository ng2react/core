import angular from 'angular'
import tpl from './componentWithImportedTemplate.tpl.html'
import './todo-list.css'
import todoListTpl from './todo-list.html'

class TodoListCtrl {
    static get $inject() {
        return ['myService']
    }
    constructor(myService) {
        this.items = []
    }
    /**
     *
     * @param {number} index
     */
    onDeleteItem(index) {
        this.items.splice(index, 1)
    }

    onAddItem() {
        this.newItem = this.newItem?.trim()
        if (!this.newItem) {
            return
        }
        if (!this.items.includes(this.newItem)) {
            this.items.push(this.newItem)
        }
        this.newItem = ''
    }
}

angular.module('componentWithClassCtrlModule', []).component('componentWithClassCtrl', {
    controller: TodoListCtrl,
    template: todoListTpl,
    bindings: {
        items: '<',
    },
})

const componentOnConstModuleConstName = angular.moodule('componentOnConstModuleModule', [])

componentOnConstModuleConstName.component('componentOnConstModule', {
    controller: TodoListCtrl,
    bindings: {
        items: '<',
    },
})

angular.module('componentWithInlineTemplateModule', []).component('componentWithInlineTemplate', {
    template: '<div>Inline template</div>',
})

angular.module('componentWithTemplateUrlModule', []).component('componentWithTemplateUrl', {
    templateUrl: 'componentWithTemplateUrl.tpl.html',
})

angular.module('componentWithUnmappedTemplateUrlModule', []).component('componentWithUnmappedTemplateUrl', {
    templateUrl: 'some-obscure-prefix/componentWithUnmappedTemplateUrl.tpl.html',
})

angular.module('componentWithUrlImportedTemplateModule', []).component('componentWithUrlImportedTemplate', {
    template: tpl,
})

angular.module('componentWithRequiredTemplateModule', []).component('componentWithRequiredTemplate', {
    template: require('./componentWithRequiredTemplate.tpl.html'),
})

angular.module('componentWithNoTemplateModule', []).component('componentWithNoTemplate', {})
