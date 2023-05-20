class ClassCtrl {
    constructor() {
        this.name = 'World'
    }
}

angular.module('classCtrl', []).component('classCtrl', {
    controller: ClassCtrl,
})
function FnCtrl() {}

angular.module('fnCtrl', []).component('fnCtrl', {
    controller: FnCtrl,
})

const ConstCtrl = ['$scope', ($scope) => {}]

angular.module('constCtrl', []).component('constCtrl', {
    controller: ConstCtrl,
})

angular.module('inlineCtrl', []).component('inlineCtrl', {
    controller: [() => {}],
})

angular.module('noCtrl', []).component('noCtrl', {})

angular.module('stringCtrl', []).component('stringCtrl', {
    controller: 'stringCtrlName',
})
