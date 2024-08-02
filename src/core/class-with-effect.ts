import { EffectController } from './effect-controller'

export abstract class ClassWithEffect {
    protected controller: EffectController
    constructor(controller: EffectController) {
        this.controller = controller.createChildController(
            this.constructor.name
        )
        this.controller.onCleanup((reason) => {
            this.destroy(reason)
        })
    }
    abstract destroy(reason?: string): void
}
