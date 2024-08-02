import { EffectController } from './effect-controller'
import { traceLog } from './util'

export abstract class ClassWithEffect {
    protected controller: EffectController
    constructor(controller: EffectController = new EffectController()) {
        traceLog(
            '[create class with effect]',
            this.constructor.name,
            controller.name
        )
        controller.onCleanup((reason) => {
            traceLog(
                '[destroy class with effect]',
                this.constructor.name,
                controller.name
            )
            this.destroy(reason)
        })
    }
    abstract destroy(reason?: string): void
}
